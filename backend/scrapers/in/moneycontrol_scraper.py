# backend/scrapers/in/moneycontrol_scraper.py
"""
Scrapes MoneyControl news headlines to count mention frequency
for Indian penny stocks in the last 24 hours.
High mention count + positive headline tone = buzz signal.
"""
import requests
from bs4 import BeautifulSoup
from collections import defaultdict
import re

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    ),
    "Accept-Language": "en-IN,en;q=0.9",
}

# MoneyControl market news page — publicly accessible
MC_NEWS_URL  = "https://www.moneycontrol.com/news/business/markets/"
MC_STOCK_URL = "https://www.moneycontrol.com/news/tags/stocks.html"

POSITIVE_WORDS = {
    "rally", "surge", "gain", "rise", "up", "buy", "breakout", "upside",
    "strong", "bull", "target", "upgrade", "outperform", "recommend",
    "multibagger", "momentum", "recovery",
}
NEGATIVE_WORDS = {
    "fall", "drop", "crash", "sell", "down", "loss", "weak", "bear",
    "downgrade", "underperform", "concern", "risk", "fraud", "probe",
    "suspend", "halt",
}


def _score_headline_sentiment(text: str) -> float:
    words = set(text.lower().split())
    pos   = len(words & POSITIVE_WORDS)
    neg   = len(words & NEGATIVE_WORDS)
    total = pos + neg
    return round(pos / total, 3) if total else 0.5


def fetch_moneycontrol_buzz(candidate_tickers: list[str]) -> dict[str, dict]:
    """
    Counts how many recent MoneyControl headlines mention each ticker.
    Returns dict: { TICKER: {mentions, sentiment, headlines} }
    """
    ticker_upper = {t.upper() for t in candidate_tickers}
    results      = defaultdict(lambda: {"mentions": 0, "sentiment_scores": [], "headlines": []})

    for url in [MC_NEWS_URL, MC_STOCK_URL]:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=12)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "lxml")

            # MoneyControl uses <li class="clearfix"> for news items
            items = soup.select("li.clearfix, div.news_wrap li, .article-list li")
            if not items:
                # Fallback: grab all anchor tags in news sections
                items = soup.select("a[href*='/news/']")

            for item in items[:100]:
                headline = item.get_text(strip=True)
                if not headline or len(headline) < 10:
                    continue

                headline_upper = headline.upper()
                sentiment      = _score_headline_sentiment(headline)

                for ticker in ticker_upper:
                    # Match ticker as whole word in headline
                    if re.search(rf"\b{re.escape(ticker)}\b", headline_upper):
                        results[ticker]["mentions"]          += 1
                        results[ticker]["sentiment_scores"].append(sentiment)
                        results[ticker]["headlines"].append(headline[:120])

        except Exception as e:
            print(f"[moneycontrol] fetch error from {url}: {e}")
            continue

    # Aggregate
    final = {}
    for ticker, data in results.items():
        scores = data["sentiment_scores"]
        final[ticker] = {
            "mentions"  : data["mentions"],
            "sentiment" : round(sum(scores) / len(scores), 3) if scores else 0.5,
            "headlines" : data["headlines"][:5],
        }

    print(f"[moneycontrol] found buzz for {len(final)} tickers")
    return final
