# backend/scrapers/us/finviz_scraper.py
"""
Pulls penny stock candidates from Finviz's free screener URL.
No API key needed — Finviz exposes filter results as HTML table.
Returns list of dicts with ticker + basic fundamentals.
"""
import requests
from bs4 import BeautifulSoup
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))
from config import US_MAX_PRICE, US_MIN_VOLUME, US_MIN_MARKET_CAP, US_MAX_MARKET_CAP

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

# Finviz screener URL — filters baked into query string:
# f=sh_price_u5   → price under $5
# sh_avgvol_o500  → avg volume over 500k
# sh_relvol_o1    → relative volume > 1 (moving today)
FINVIZ_URL = (
    "https://finviz.com/screener.ashx"
    "?v=111"
    "&f=sh_price_u5,sh_avgvol_o500,sh_relvol_o1"
    "&o=-volume"        # sort by volume descending
    "&r={start}"        # pagination — 20 results per page
)


def _parse_market_cap(raw: str) -> float:
    """Convert '12.4M' or '300B' style strings to float."""
    if not raw or raw == "-":
        return 0.0
    raw = raw.strip()
    multipliers = {"B": 1e9, "M": 1e6, "K": 1e3}
    for suffix, mult in multipliers.items():
        if raw.endswith(suffix):
            try:
                return float(raw[:-1]) * mult
            except ValueError:
                return 0.0
    try:
        return float(raw)
    except ValueError:
        return 0.0


def fetch_finviz_penny_stocks(max_pages: int = 5) -> list[dict]:
    """
    Scrapes up to max_pages * 20 results from Finviz screener.
    Returns list of dicts: {ticker, name, price, change_pct, volume, market_cap}
    """
    results = []

    for page in range(max_pages):
        start = page * 20 + 1
        url = FINVIZ_URL.format(start=start)

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"[finviz] page {page+1} fetch error: {e}")
            break

        soup = BeautifulSoup(resp.text, "lxml")

        # Finviz renders the table with class "screener-table"
        table = soup.find("table", {"class": "screener-table"})
        if not table:
            # Try legacy selector
            table = soup.find("table", id="screener-content")
        if not table:
            print(f"[finviz] could not find results table on page {page+1}")
            break

        rows = table.find_all("tr")[1:]  # skip header

        if not rows:
            break   # no more results

        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 12:
                continue

            try:
                ticker     = cols[1].get_text(strip=True)
                name       = cols[2].get_text(strip=True)
                price_raw  = cols[8].get_text(strip=True)
                change_raw = cols[9].get_text(strip=True).replace("%", "")
                volume_raw = cols[10].get_text(strip=True).replace(",", "")
                mktcap_raw = cols[6].get_text(strip=True)

                price      = float(price_raw)
                change_pct = float(change_raw)
                volume     = float(volume_raw) if volume_raw.isdigit() or volume_raw.replace(".", "").isdigit() else 0.0
                market_cap = _parse_market_cap(mktcap_raw)

                # Apply our config filters
                if price > US_MAX_PRICE:
                    continue
                if volume < US_MIN_VOLUME:
                    continue
                if market_cap and (market_cap < US_MIN_MARKET_CAP or market_cap > US_MAX_MARKET_CAP):
                    continue

                results.append({
                    "ticker"     : ticker,
                    "name"       : name,
                    "price"      : price,
                    "change_pct" : change_pct,
                    "volume"     : volume,
                    "market_cap" : market_cap,
                    "currency"   : "USD",
                })

            except (ValueError, IndexError):
                continue

    print(f"[finviz] fetched {len(results)} candidates")
    return results
