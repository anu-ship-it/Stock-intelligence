# backend/scrapers/us/stocktwits_scraper.py
"""
Fetches sentiment and message volume from StockTwits public API.
No API key required for basic symbol stream endpoint.
Returns bullish %, bearish %, and watcher count.
"""
import requests
import time

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

ST_URL = "https://api.stocktwits.com/api/2/streams/symbol/{ticker}.json?limit=30"


def fetch_stocktwits_sentiment(ticker: str) -> dict:
    """
    Returns: {bullish_pct, bearish_pct, message_count, watchers}
    Returns zeros on failure.
    """
    default = {"bullish_pct": 0.5, "bearish_pct": 0.5, "message_count": 0, "watchers": 0}

    try:
        resp = requests.get(
            ST_URL.format(ticker=ticker),
            headers=HEADERS,
            timeout=8,
        )
        if resp.status_code == 404:
            return default
        resp.raise_for_status()
        data = resp.json()

        messages = data.get("messages", [])
        bull = sum(1 for m in messages if m.get("entities", {}).get("sentiment", {}).get("basic") == "Bullish")
        bear = sum(1 for m in messages if m.get("entities", {}).get("sentiment", {}).get("basic") == "Bearish")
        total_sentiment = bull + bear

        symbol_info = data.get("symbol", {})
        watchers = symbol_info.get("watchlist_count", 0)

        return {
            "bullish_pct"   : round(bull / total_sentiment, 3) if total_sentiment else 0.5,
            "bearish_pct"   : round(bear / total_sentiment, 3) if total_sentiment else 0.5,
            "message_count" : len(messages),
            "watchers"      : watchers,
        }

    except Exception as e:
        print(f"[stocktwits] failed for {ticker}: {e}")
        return default


def fetch_bulk_stocktwits(tickers: list[str], delay: float = 0.25) -> dict[str, dict]:
    """Fetches StockTwits data for all tickers. Returns dict keyed by ticker."""
    results = {}
    for ticker in tickers:
        results[ticker] = fetch_stocktwits_sentiment(ticker)
        time.sleep(delay)
    print(f"[stocktwits] fetched sentiment for {len(results)} tickers")
    return results
