# backend/scrapers/us/yahoo_scraper.py
"""
Fetches price, volume, and 30-day average volume for a list of tickers
using Yahoo Finance's unofficial JSON endpoint — no API key needed.
Used to calculate volume_spike ratio (today / 30d avg).
"""
import requests
import time
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

# Yahoo Finance v8 quote endpoint — returns JSON with all fields we need
YF_QUOTE_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?range=1d&interval=1d"
YF_SUMMARY_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/{ticker}?modules=summaryDetail"


def fetch_yahoo_data(ticker: str) -> dict:
    """
    Returns enriched data for a single ticker:
    {volume, avg_volume_30d, volume_spike, price, change_pct}
    Returns empty dict on failure — caller must handle gracefully.
    """
    result = {}

    # ── 1. Current quote ─────────────────────────────────────────────────────
    try:
        resp = requests.get(
            YF_QUOTE_URL.format(ticker=ticker),
            headers=HEADERS,
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        meta = data["chart"]["result"][0]["meta"]

        result["price"]      = meta.get("regularMarketPrice", 0)
        result["volume"]     = meta.get("regularMarketVolume", 0)
        result["change_pct"] = round(
            (meta.get("regularMarketPrice", 0) - meta.get("previousClose", 1))
            / max(meta.get("previousClose", 1), 0.0001) * 100,
            2,
        )
    except Exception as e:
        print(f"[yahoo] quote fetch failed for {ticker}: {e}")
        return result

    # ── 2. 30-day average volume ──────────────────────────────────────────────
    try:
        resp2 = requests.get(
            YF_SUMMARY_URL.format(ticker=ticker),
            headers=HEADERS,
            timeout=10,
        )
        resp2.raise_for_status()
        data2 = resp2.json()
        avg_vol = (
            data2["quoteSummary"]["result"][0]
            ["summaryDetail"]
            ["averageVolume"]["raw"]
        )
        result["avg_volume_30d"] = avg_vol

        if avg_vol and avg_vol > 0:
            result["volume_spike"] = round(result["volume"] / avg_vol, 2)
        else:
            result["volume_spike"] = 1.0

    except Exception as e:
        print(f"[yahoo] summary fetch failed for {ticker}: {e}")
        result["avg_volume_30d"] = result.get("volume", 0)
        result["volume_spike"]   = 1.0

    return result


def enrich_tickers(tickers: list[str], delay: float = 0.3) -> dict[str, dict]:
    """
    Fetches Yahoo data for all tickers.
    Returns dict keyed by ticker: { ticker: {volume_spike, price, ...} }
    delay = seconds between requests to avoid rate limiting.
    """
    enriched = {}
    for ticker in tickers:
        data = fetch_yahoo_data(ticker)
        if data:
            enriched[ticker] = data
        time.sleep(delay)
    print(f"[yahoo] enriched {len(enriched)}/{len(tickers)} tickers")
    return enriched
