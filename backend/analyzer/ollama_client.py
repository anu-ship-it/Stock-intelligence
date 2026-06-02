# backend/analyzer/ollama_client.py
"""
Sends the top-N scored stocks to local Ollama instance and gets
a human-readable buy rationale summary.
We pass structured data, not raw HTML — keeps the prompt tight.
"""
import requests
import json
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
from config import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT, OLLAMA_TOP_N

OLLAMA_ENDPOINT = f"{OLLAMA_BASE_URL}/api/generate"


def _build_prompt(market: str, stocks: list[dict]) -> str:
    top = stocks[:OLLAMA_TOP_N]

    lines = []
    for i, s in enumerate(top, 1):
        currency = s.get("currency", "USD")
        lines.append(
            f"{i}. {s['ticker']} ({s.get('name', '')})\n"
            f"   Price: {currency} {s.get('price', 0):.2f} | "
            f"Change: {s.get('change_pct', 0):+.1f}% | "
            f"Volume spike: {s.get('volume_spike', 1):.1f}× | "
            f"Score: {s.get('score', 0):.0f}/100\n"
            f"   Sub-scores: {json.dumps(s.get('sub_scores', {}))}\n"
            + (f"   Insider buy: YES\n" if s.get('insider_buy') else "")
            + (f"   Promoter holding: {s.get('promoter_holding', 0):.1f}%\n" if market == "IN" else "")
            + (f"   Debt/Equity: {s.get('debt_to_equity', 0):.2f}\n" if market == "IN" else "")
        )

    stock_block = "\n".join(lines)

    market_label = "US OTC/NYSE/NASDAQ penny stocks" if market == "US" else "Indian NSE/BSE small-cap penny stocks"

    return f"""You are a concise financial analyst assistant. Analyze these {market_label} that have been algorithmically scored for buy signals today.

{stock_block}

Write a SHORT summary (max 150 words) covering:
1. The 2-3 strongest picks and specifically WHY they scored high (use the actual numbers)
2. Any red flags or stocks to avoid in this list
3. One sentence of overall market context for {market_label} today

Be direct. No disclaimers. No "please consult a financial advisor". Just analysis."""


def get_ollama_summary(market: str, scored_stocks: list[dict]) -> str:
    """
    Sends top stocks to Ollama. Returns the AI summary string.
    Falls back to a generated summary if Ollama is not running.
    """
    if not scored_stocks:
        return "No stocks met the signal threshold in this scan."

    prompt = _build_prompt(market, scored_stocks)

    try:
        resp = requests.post(
            OLLAMA_ENDPOINT,
            json={
                "model" : OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
            },
            timeout=OLLAMA_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "").strip()

    except requests.exceptions.ConnectionError:
        print(f"[ollama] not running — using fallback summary")
        return _fallback_summary(market, scored_stocks)
    except Exception as e:
        print(f"[ollama] error: {e}")
        return _fallback_summary(market, scored_stocks)


def _fallback_summary(market: str, stocks: list[dict]) -> str:
    """Rule-based summary when Ollama is offline."""
    if not stocks:
        return "No signals found."

    top3 = stocks[:3]
    parts = []
    for s in top3:
        currency = "₹" if market == "IN" else "$"
        parts.append(
            f"{s['ticker']} (score {s['score']:.0f}/100, "
            f"{currency}{s.get('price', 0):.2f}, "
            f"{s.get('change_pct', 0):+.1f}%, "
            f"vol spike {s.get('volume_spike', 1):.1f}×)"
        )

    return (
        f"[Ollama offline — rule-based summary] "
        f"Top picks this scan: {', '.join(parts)}. "
        f"Start Ollama with `ollama run {OLLAMA_MODEL}` for AI analysis."
    )
