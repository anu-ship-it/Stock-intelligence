# backend/analyzer/scorer_us.py
"""
Composite scorer for US penny stocks.
Takes raw data from all US scrapers and produces a 0–100 score per ticker.
Higher = stronger buy signal confluence.
"""
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
from config import US_WEIGHTS


def _normalize_volume_spike(spike: float) -> float:
    """Volume spike ratio → 0–100. 1× = 0, 5× = 100, capped."""
    return min(100.0, max(0.0, (spike - 1.0) / 4.0 * 100))


def _normalize_price_change(pct: float) -> float:
    """% price change → 0–100. 0% = 50 (neutral), +20% = 100, -20% = 0."""
    return min(100.0, max(0.0, (pct + 20) / 40 * 100))


def _normalize_mentions(mentions: int) -> float:
    """Reddit mentions → 0–100. Log scale. 0 = 0, 50+ = 100."""
    if mentions <= 0:
        return 0.0
    import math
    return min(100.0, math.log(mentions + 1) / math.log(51) * 100)


def score_us_stock(
    ticker      : str,
    yahoo_data  : dict,
    reddit_data : dict,
    twits_data  : dict,
    insider_buys: set,
) -> dict:
    """
    Scores a single US ticker. Returns dict with score + all sub-scores.

    yahoo_data  : {price, change_pct, volume, volume_spike}
    reddit_data : {mentions, sentiment}  — or empty dict
    twits_data  : {bullish_pct, message_count}  — or empty dict
    insider_buys: set of tickers with Form 4 purchase activity
    """
    w = US_WEIGHTS

    # ── Sub-scores (each 0–100) ───────────────────────────────────────────────
    vol_spike_score   = _normalize_volume_spike(yahoo_data.get("volume_spike", 1.0))
    price_change_score = _normalize_price_change(yahoo_data.get("change_pct", 0.0))

    reddit_mentions   = reddit_data.get("mentions", 0)
    reddit_sentiment  = reddit_data.get("sentiment", 0.5)
    mention_score     = _normalize_mentions(reddit_mentions)
    sentiment_score   = reddit_sentiment * 100          # already 0–1 → 0–100

    bull_pct          = twits_data.get("bullish_pct", 0.5)
    stocktwits_score  = bull_pct * 100

    insider_score     = 100.0 if ticker.upper() in insider_buys else 0.0

    # ── Weighted composite ────────────────────────────────────────────────────
    composite = (
        vol_spike_score   * w["volume_spike"]     +
        price_change_score * w["price_change_pct"] +
        mention_score     * w["reddit_mentions"]   +
        sentiment_score   * w["reddit_sentiment"]  +
        stocktwits_score  * w["stocktwits_bull"]   +
        insider_score     * w["insider_buy"]
    )

    return {
        "ticker"            : ticker,
        "score"             : round(composite, 2),
        "price"             : yahoo_data.get("price", 0),
        "change_pct"        : yahoo_data.get("change_pct", 0),
        "volume"            : yahoo_data.get("volume", 0),
        "volume_spike"      : yahoo_data.get("volume_spike", 1.0),
        "currency"          : "USD",
        "sub_scores"        : {
            "volume_spike"    : round(vol_spike_score, 1),
            "price_change"    : round(price_change_score, 1),
            "reddit_mentions" : round(mention_score, 1),
            "reddit_sentiment": round(sentiment_score, 1),
            "stocktwits_bull" : round(stocktwits_score, 1),
            "insider_buy"     : round(insider_score, 1),
        },
        "reddit_mentions"   : reddit_mentions,
        "reddit_posts"      : reddit_data.get("posts", []),
        "insider_buy"       : ticker.upper() in insider_buys,
    }


def score_all_us(
    candidates  : list[dict],
    yahoo_map   : dict,
    reddit_map  : dict,
    twits_map   : dict,
    insider_buys: set,
    min_score   : float = 20.0,
) -> list[dict]:
    """
    Scores all US candidates and returns sorted list (highest score first).
    Filters out stocks below min_score.
    """
    scored = []
    for stock in candidates:
        ticker = stock["ticker"]
        result = score_us_stock(
            ticker       = ticker,
            yahoo_data   = yahoo_map.get(ticker, stock),   # fallback to finviz data
            reddit_data  = reddit_map.get(ticker, {}),
            twits_data   = twits_map.get(ticker, {}),
            insider_buys = insider_buys,
        )
        result["name"] = stock.get("name", ticker)
        if result["score"] >= min_score:
            scored.append(result)

    scored.sort(key=lambda x: x["score"], reverse=True)
    print(f"[scorer_us] {len(scored)} stocks above score threshold {min_score}")
    return scored
