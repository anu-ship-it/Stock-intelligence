# backend/scrapers/us/reddit_scraper.py
"""
Scans penny stock subreddits using Reddit's official free API via PRAW.
Counts ticker mentions + basic sentiment (positive/negative word ratio).

Setup: Reddit requires a free app registration at https://www.reddit.com/prefs/apps
Set these in a .env file:
    REDDIT_CLIENT_ID=...
    REDDIT_CLIENT_SECRET=...
    REDDIT_USER_AGENT=PennyScope/1.0
"""
import os
import re
from collections import defaultdict
from dotenv import load_dotenv
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), "../../.."))
from config import REDDIT_SUBREDDITS, REDDIT_POST_LIMIT

load_dotenv()

# ── Lazy import PRAW so app still starts if creds are missing ────────────────
def _get_reddit():
    try:
        import praw
        return praw.Reddit(
            client_id     = os.getenv("REDDIT_CLIENT_ID", ""),
            client_secret = os.getenv("REDDIT_CLIENT_SECRET", ""),
            user_agent    = os.getenv("REDDIT_USER_AGENT", "PennyScope/1.0"),
        )
    except Exception as e:
        print(f"[reddit] PRAW init failed: {e}")
        return None


# Simple positive/negative word sets for penny stock context
POSITIVE_WORDS = {
    "moon", "bullish", "buy", "calls", "breakout", "squeeze", "surge",
    "rocket", "pump", "bull", "long", "upside", "growth", "catalyst",
    "undervalued", "gem", "strong", "explode", "run", "reversal",
}
NEGATIVE_WORDS = {
    "dump", "bearish", "sell", "puts", "crash", "scam", "avoid", "short",
    "fraud", "bankrupt", "dilution", "warning", "drop", "tank", "bagholding",
    "rug", "manipulation", "halt", "overvalued", "trap",
}

# Matches $TICK or standalone TICK (2-5 uppercase letters)
TICKER_PATTERN = re.compile(r"\$([A-Z]{2,5})\b|\b([A-Z]{2,5})\b")

# Common false positives to ignore
IGNORE_TICKERS = {
    "A", "I", "AM", "PM", "CEO", "IPO", "ETF", "SEC", "FDA", "USA",
    "NYSE", "OTC", "DD", "TA", "AI", "EV", "US", "UK", "GDP", "IMO",
    "YOLO", "FOMO", "TBH", "ATH", "ATL", "EOD", "EOW", "PT",
}


def _score_sentiment(text: str) -> float:
    """Returns sentiment score: 1.0 = all positive, 0.0 = all negative, 0.5 = neutral."""
    words = set(text.lower().split())
    pos = len(words & POSITIVE_WORDS)
    neg = len(words & NEGATIVE_WORDS)
    total = pos + neg
    if total == 0:
        return 0.5
    return round(pos / total, 3)


def _extract_tickers(text: str) -> set[str]:
    matches = TICKER_PATTERN.findall(text)
    found = set()
    for m in matches:
        ticker = m[0] or m[1]
        if ticker and ticker not in IGNORE_TICKERS and len(ticker) >= 2:
            found.add(ticker)
    return found


def fetch_reddit_signals(candidate_tickers: list[str] | None = None) -> dict[str, dict]:
    """
    Scans configured subreddits.
    If candidate_tickers provided, only tracks those.
    Returns dict: { TICKER: {mentions, sentiment, posts} }
    """
    reddit = _get_reddit()
    if not reddit:
        print("[reddit] skipping — no credentials")
        return {}

    ticker_data = defaultdict(lambda: {"mentions": 0, "sentiment_scores": [], "posts": []})
    candidate_set = {t.upper() for t in (candidate_tickers or [])}

    for sub_name in REDDIT_SUBREDDITS:
        try:
            subreddit = reddit.subreddit(sub_name)
            posts = list(subreddit.new(limit=REDDIT_POST_LIMIT))

            for post in posts:
                full_text = f"{post.title} {post.selftext}"
                tickers_in_post = _extract_tickers(full_text)

                # Filter to candidates if provided
                if candidate_set:
                    tickers_in_post = tickers_in_post & candidate_set

                sentiment = _score_sentiment(full_text)

                for ticker in tickers_in_post:
                    ticker_data[ticker]["mentions"] += 1
                    ticker_data[ticker]["sentiment_scores"].append(sentiment)
                    ticker_data[ticker]["posts"].append(post.title[:100])

        except Exception as e:
            print(f"[reddit] error on r/{sub_name}: {e}")
            continue

    # Aggregate sentiment
    result = {}
    for ticker, data in ticker_data.items():
        scores = data["sentiment_scores"]
        result[ticker] = {
            "mentions"  : data["mentions"],
            "sentiment" : round(sum(scores) / len(scores), 3) if scores else 0.5,
            "posts"     : data["posts"][:5],   # keep top 5 post titles
        }

    print(f"[reddit] found signals for {len(result)} tickers")
    return result
