# backend/scrapers/in/screener_scraper.py
"""
Scrapes screener.in for Indian penny stock candidates.
screener.in has a public query system — no login needed for basic screens.
We use their pre-built screen for small-cap stocks with high volume.
Returns list of dicts with fundamentals unique to Indian market:
  promoter_holding, debt_to_equity, screener_score, price, volume.
"""
import requests
from bs4 import BeautifulSoup
import time
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))
from config import IN_MAX_PRICE, IN_MIN_VOLUME

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.screener.in/",
}

# Screener.in custom screen URL
# Query: Price < 50 AND Volume > 100000 AND Market Cap < 500
# Sorted by day change descending
SCREENER_URL = (
    "https://www.screener.in/screen/raw/"
    "?sort=Day+Change+%25&order=desc"
    "&query=Price+%3C+50+AND+Volume+%3E+100000+AND+Market+Capitalization+%3C+500"
    "&page={page}"
)


def _safe_float(val: str, default: float = 0.0) -> float:
    try:
        return float(val.replace(",", "").replace("%", "").strip())
    except (ValueError, AttributeError):
        return default


def fetch_screener_stocks(max_pages: int = 3) -> list[dict]:
    """
    Returns list of dicts:
    {ticker, name, price, change_pct, volume, market_cap,
     promoter_holding, debt_to_equity, screener_score, currency}
    """
    results = []

    for page in range(1, max_pages + 1):
        url = SCREENER_URL.format(page=page)

        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
        except requests.RequestException as e:
            print(f"[screener.in] page {page} error: {e}")
            break

        soup = BeautifulSoup(resp.text, "lxml")

        # screener.in renders results in a <table> with class "data-table"
        table = soup.find("table", {"class": "data-table"})
        if not table:
            print(f"[screener.in] no table found on page {page}")
            break

        rows = table.find("tbody").find_all("tr") if table.find("tbody") else []
        if not rows:
            break

        # Parse column headers to map positions dynamically
        header_row = table.find("thead")
        headers = []
        if header_row:
            headers = [th.get_text(strip=True).lower() for th in header_row.find_all("th")]

        for row in rows:
            cols = row.find_all("td")
            if len(cols) < 6:
                continue

            try:
                # screener.in column order (typical):
                # Name | CMP | P/E | Mkt Cap | Div Yld | NP Qtr | QoQ | Sales Qtr | QoQ | ROCE | Debt/Eq | Promoter% | Change%
                name_cell = cols[0]
                link = name_cell.find("a")
                name   = link.get_text(strip=True) if link else name_cell.get_text(strip=True)
                # Extract NSE ticker from the URL e.g. /company/TATASTEEL/
                ticker = ""
                if link and link.get("href"):
                    parts = link["href"].strip("/").split("/")
                    if len(parts) >= 2:
                        ticker = parts[-1].upper()

                price          = _safe_float(cols[1].get_text(strip=True)) if len(cols) > 1 else 0.0
                market_cap     = _safe_float(cols[3].get_text(strip=True)) if len(cols) > 3 else 0.0  # in Cr
                debt_to_equity = _safe_float(cols[10].get_text(strip=True)) if len(cols) > 10 else 0.0
                promoter_hold  = _safe_float(cols[11].get_text(strip=True)) if len(cols) > 11 else 0.0
                change_pct     = _safe_float(cols[12].get_text(strip=True)) if len(cols) > 12 else 0.0

                # Volume not directly on screener.in screen — will be enriched by nse_scraper
                volume = 0.0

                if price > IN_MAX_PRICE or price <= 0:
                    continue

                # screener.in doesn't give a single "score" — we synthesize one
                # from fundamentals: high promoter holding + low D/E = better
                screener_score = min(100.0, max(0.0,
                    (promoter_hold * 0.6) +                    # 0–60 pts
                    (max(0, 5 - debt_to_equity) / 5 * 40)     # 0–40 pts, lower D/E = higher
                ))

                results.append({
                    "ticker"          : ticker,
                    "name"            : name,
                    "price"           : price,
                    "change_pct"      : change_pct,
                    "volume"          : volume,
                    "market_cap_cr"   : market_cap,      # ₹ Crores
                    "promoter_holding": promoter_hold,   # %
                    "debt_to_equity"  : debt_to_equity,
                    "screener_score"  : round(screener_score, 2),
                    "currency"        : "INR",
                })

            except (ValueError, IndexError, AttributeError):
                continue

        time.sleep(0.5)

    print(f"[screener.in] fetched {len(results)} candidates")
    return results
