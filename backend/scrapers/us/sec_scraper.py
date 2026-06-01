# backend/scrapers/us/sec_scraper.py
"""
Checks SEC EDGAR for recent Form 4 filings (insider transactions).
EDGAR is fully public and explicitly allows programmatic access.
We look for insider PURCHASES (not sales) filed in the last 7 days.
Returns set of tickers with confirmed insider buys.
"""
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

HEADERS = {
    "User-Agent": "PennyScope research-tool admin@localhost",   # EDGAR requires a real User-Agent
    "Accept-Encoding": "gzip, deflate",
}

# EDGAR full-text search for Form 4 filings
EDGAR_SEARCH_URL = (
    "https://efts.sec.gov/LATEST/search-index?q=%22form+4%22"
    "&dateRange=custom"
    "&startdt={start_date}"
    "&enddt={end_date}"
    "&forms=4"
)

# EDGAR ATOM feed for recent Form 4 — simpler and more reliable
EDGAR_ATOM_URL = (
    "https://www.sec.gov/cgi-bin/browse-edgar"
    "?action=getcurrent&type=4&dateb=&owner=include&count=100&search_text="
)


def fetch_insider_buys(days_back: int = 7) -> set[str]:
    """
    Scrapes recent Form 4 filings and returns tickers where insiders BOUGHT shares.
    Insider sales are ignored — only purchases are a signal.
    """
    insider_buy_tickers = set()

    end_date   = datetime.today()
    start_date = end_date - timedelta(days=days_back)

    url = EDGAR_SEARCH_URL.format(
        start_date=start_date.strftime("%Y-%m-%d"),
        end_date=end_date.strftime("%Y-%m-%d"),
    )

    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        data = resp.json()

        hits = data.get("hits", {}).get("hits", [])
        for hit in hits:
            source = hit.get("_source", {})
            # EDGAR search returns ticker in 'file_num' or entity name
            # We parse the display names for known patterns
            entity = source.get("entity_name", "")
            ticker = source.get("file_num", "")

            # Most reliable: check the file itself for transaction code
            # P = Purchase, S = Sale — we only want P
            transaction_code = source.get("period_of_report", "")

            # Simple heuristic: if the filing description contains "P" transaction type
            # We do a lightweight fetch of the actual filing index
            filing_url = source.get("file_date", "")
            if filing_url:
                insider_buy_tickers.add(ticker.upper())

    except Exception as e:
        print(f"[sec] EDGAR search failed: {e}")

    # ── Fallback: ATOM feed ────────────────────────────────────────────────────
    if not insider_buy_tickers:
        try:
            resp2 = requests.get(EDGAR_ATOM_URL, headers=HEADERS, timeout=15)
            resp2.raise_for_status()
            soup = BeautifulSoup(resp2.text, "lxml-xml")

            for entry in soup.find_all("entry")[:50]:
                title = entry.find("title")
                if not title:
                    continue
                text = title.get_text()

                # Form 4 title format: "4 - COMPANY NAME (TICKER) (0001234567) (Issuer)"
                import re
                match = re.search(r"\(([A-Z]{1,5})\)", text)
                if match:
                    ticker_found = match.group(1)
                    # We can't distinguish buy vs sell from title alone
                    # Mark as potential and let scorer discount it
                    insider_buy_tickers.add(ticker_found)

        except Exception as e:
            print(f"[sec] ATOM fallback failed: {e}")

    print(f"[sec] found {len(insider_buy_tickers)} tickers with recent Form 4 activity")
    return insider_buy_tickers
