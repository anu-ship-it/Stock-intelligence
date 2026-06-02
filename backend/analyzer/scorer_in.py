# backend/analyzer/scorer_in.py
"""
Composite scorer for Indian penny stocks (NSE/BSE).
Uses fundamentals from screener.in + live data from NSE + buzz from MoneyControl.
"""
import math
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
from config import IN_WEIGHTS


def _normalize_volume_spike(spike: float) -> float:
    return min(100.0, max(0.0, (spike - 1.0) / 4.0 * 100))


def _normalize_price_change(pct: float) -> float:
    return min(100.0, max(0.0, (pct + 20) / 40 * 100))


def _normalize_screener_score(score: float) -> float:
    """screener_score already computed 0–100 in screener_scraper."""
    return min(100.0, max(0.0, score))


def _normalize_promoter_holding(pct: float) -> float:
    """Higher promoter holding = more confidence. 70%+ = 100 pts."""
    return min(100.0, max(0.0, pct / 70 * 100))


def _normalize_debt_to_equity(de: float) -> float:
    """Lower D/E = better. 0 = 100 pts, 5+ = 0 pts. Inverted."""
    return min(100.0, max(0.0, (1 - min(de, 5) / 5) * 100))


def _normalize_buzz(mentions: int) -> float:
    if mentions <= 0:
        return 0.0
    return min(100.0, math.log(mentions + 1) / math.log(20) * 100)


def score_in_stock(
    ticker         : str,
    screener_data  : dict,
    nse_data       : dict,
    moneycontrol_data: dict,
) -> dict:
    """
    Scores a single Indian ticker. Returns dict with score + sub-scores.

    screener_data     : {price, change_pct, screener_score, promoter_holding, debt_to_equity}
    nse_data          : {price, volume, volume_spike, change_pct}
    moneycontrol_data : {mentions, sentiment}
    """
    w = IN_WEIGHTS

    # Prefer NSE live data for price/volume, fall back to screener.in
    price      = nse_data.get("price") or screener_data.get("price", 0)
    change_pct = nse_data.get("change_pct") or screener_data.get("change_pct", 0)
    vol_spike  = nse_data.get("volume_spike", 1.0)
    volume     = nse_data.get("volume", 0)

    # ── Sub-scores ────────────────────────────────────────────────────────────
    vol_spike_score    = _normalize_volume_spike(vol_spike)
    price_change_score = _normalize_price_change(change_pct)
    screener_score_n   = _normalize_screener_score(screener_data.get("screener_score", 50))
    promoter_score     = _normalize_promoter_holding(screener_data.get("promoter_holding", 0))
    de_score           = _normalize_debt_to_equity(screener_data.get("debt_to_equity", 0))
    buzz_score         = _normalize_buzz(moneycontrol_data.get("mentions", 0))

    composite = (
        vol_spike_score    * w["volume_spike"]      +
        price_change_score * w["price_change_pct"]  +
        screener_score_n   * w["screener_score"]    +
        promoter_score     * w["promoter_holding"]  +
        de_score           * w["debt_to_equity"]    +
        buzz_score         * w["moneycontrol_buzz"]
    )

    return {
        "ticker"           : ticker,
        "score"            : round(composite, 2),
        "price"            : price,
        "change_pct"       : change_pct,
        "volume"           : volume,
        "volume_spike"     : vol_spike,
        "currency"         : "INR",
        "sub_scores"       : {
            "volume_spike"    : round(vol_spike_score, 1),
            "price_change"    : round(price_change_score, 1),
            "screener_score"  : round(screener_score_n, 1),
            "promoter_holding": round(promoter_score, 1),
            "debt_to_equity"  : round(de_score, 1),
            "moneycontrol_buzz": round(buzz_score, 1),
        },
        "promoter_holding" : screener_data.get("promoter_holding", 0),
        "debt_to_equity"   : screener_data.get("debt_to_equity", 0),
        "mc_headlines"     : moneycontrol_data.get("headlines", []),
    }


def score_all_in(
    candidates        : list[dict],
    nse_map           : dict,
    moneycontrol_map  : dict,
    min_score         : float = 20.0,
) -> list[dict]:
    """
    Scores all Indian candidates and returns sorted list (highest score first).
    """
    scored = []
    for stock in candidates:
        ticker = stock["ticker"]
        if not ticker:
            continue

        result = score_in_stock(
            ticker            = ticker,
            screener_data     = stock,
            nse_data          = nse_map.get(ticker, {}),
            moneycontrol_data = moneycontrol_map.get(ticker, {}),
        )
        result["name"] = stock.get("name", ticker)
        if result["score"] >= min_score:
            scored.append(result)

    scored.sort(key=lambda x: x["score"], reverse=True)
    print(f"[scorer_in] {len(scored)} stocks above score threshold {min_score}")
    return scored
