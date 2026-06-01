# backend/scrapers/in/nse_scraper.py
"""
Fetches live price, volume, and 30-day average volume from NSE India's
public JSON endpoints. No API key required.
NSE explicitly provides these for public use.
"""
import requests
import time

# NSE requires a session cookie obtained by hitting the homepage first
NSE_BASE     = "https://www.nseindia.com"
NSE_QUOTE    = "https://www.nseindia.com/api/quote-equity?symbol={symbol}"
NSE_TRADE    = "https://www.nseindia.com/api/quote-equity?symbol={symbol}&section=trade_info"

HEADERS = {
    "User-Agent"     : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept"         : "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer"        : "https://www.nseindia.com/",
}


def _get_nse_session() -> requests.Session:
    """
    NSE requires a valid session cookie from the homepage before API calls work.
    """
    session = requests.Session()
    try:
        session.get(NSE_BASE, headers=HEADERS, timeout=10)
    except Exception as e:
        print(f"[nse] session init failed: {e}")
    return session


def fetch_nse_data(symbol: str, session: requests.Session) -> dict:
    """
    Fetch price, volume, 52w high/low for a single NSE symbol.
    Returns dict or empty dict on failure.
    """
    result = {}
    try:
        url  = NSE_QUOTE.format(symbol=symbol.upper())
        resp = session.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        price_info = data.get("priceInfo", {})
        metadata   = data.get("metadata", {})

        result["price"]      = price_info.get("lastPrice", 0)
        result["change_pct"] = price_info.get("pChange", 0)
        result["high_52w"]   = price_info.get("weekHighLow", {}).get("max", 0)
        result["low_52w"]    = price_info.get("weekHighLow", {}).get("min", 0)
        result["name"]       = metadata.get("companyName", symbol)

    except Exception as e:
        print(f"[nse] quote failed for {symbol}: {e}")
        return result

    # ── Trade info for volume ─────────────────────────────────────────────────
    try:
        url2  = NSE_TRADE.format(symbol=symbol.upper())
        resp2 = session.get(url2, headers=HEADERS, timeout=10)
        resp2.raise_for_status()
        data2 = resp2.json()

        trade = data2.get("tradeInfo", {})
        result["volume"]         = trade.get("totalTradedVolume", 0)
        result["avg_volume_30d"] = trade.get("vwap", 0)   # VWAP as proxy

        today_vol = result["volume"]
        avg_vol   = result["avg_volume_30d"]
        result["volume_spike"] = round(today_vol / avg_vol, 2) if avg_vol else 1.0

    except Exception as e:
        print(f"[nse] trade info failed for {symbol}: {e}")
        result.setdefault("volume", 0)
        result.setdefault("volume_spike", 1.0)

    return result


def enrich_nse_tickers(symbols: list[str], delay: float = 0.4) -> dict[str, dict]:
    """
    Fetches NSE data for all symbols.
    Returns dict: { SYMBOL: {price, volume, volume_spike, change_pct, ...} }
    """
    session  = _get_nse_session()
    enriched = {}

    for symbol in symbols:
        data = fetch_nse_data(symbol, session)
        if data:
            enriched[symbol] = data
        time.sleep(delay)

    print(f"[nse] enriched {len(enriched)}/{len(symbols)} symbols")
    return enriched
