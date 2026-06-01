# backend/main.py
"""
FastAPI application.
Orchestrates all scrapers → scorer → Ollama → DB → API response.
"""
import json
from datetime import datetime
from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from config import API_HOST, API_PORT, CORS_ORIGINS
from backend.db.database import get_db, init_db
from backend.db.models import ScanResult, StockSignal

# ── US scrapers ───────────────────────────────────────────────────────────────
from backend.scrapers.us.finviz_scraper    import fetch_finviz_penny_stocks
from backend.scrapers.us.yahoo_scraper     import enrich_tickers
from backend.scrapers.us.reddit_scraper    import fetch_reddit_signals
from backend.scrapers.us.stocktwits_scraper import fetch_bulk_stocktwits
from backend.scrapers.us.sec_scraper       import fetch_insider_buys

# ── IN scrapers ───────────────────────────────────────────────────────────────
from backend.scrapers.in.screener_scraper    import fetch_screener_stocks
from backend.scrapers.in.nse_scraper         import enrich_nse_tickers
from backend.scrapers.in.moneycontrol_scraper import fetch_moneycontrol_buzz

# ── Analyzers ─────────────────────────────────────────────────────────────────
from backend.analyzer.scorer_us    import score_all_us
from backend.analyzer.scorer_in    import score_all_in
from backend.analyzer.ollama_client import get_ollama_summary

# ── Scheduler ─────────────────────────────────────────────────────────────────
from backend.scheduler import start_scheduler

app = FastAPI(title="PennyScope", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── DB session for non-route use ──────────────────────────────────────────────
from backend.db.database import SessionLocal

def _get_db_direct() -> Session:
    return SessionLocal()


# ─────────────────────────────────────────────────────────────────────────────
# SCAN PIPELINES
# ─────────────────────────────────────────────────────────────────────────────

def run_us_scan() -> dict:
    """Full US scan pipeline. Returns result dict."""
    print("[scan_us] starting")
    db = _get_db_direct()
    started = datetime.utcnow()

    scan_record = ScanResult(market="US", started_at=started)
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    try:
        # 1. Get candidates from Finviz
        candidates = fetch_finviz_penny_stocks(max_pages=5)
        tickers    = [s["ticker"] for s in candidates]

        # 2. Enrich with Yahoo Finance (volume spike)
        yahoo_map  = enrich_tickers(tickers)

        # 3. Reddit mention + sentiment
        reddit_map = fetch_reddit_signals(tickers)

        # 4. StockTwits bullish %
        twits_map  = fetch_bulk_stocktwits(tickers)

        # 5. SEC insider buys
        insider_buys = fetch_insider_buys(days_back=7)

        # 6. Score everything
        scored = score_all_us(candidates, yahoo_map, reddit_map, twits_map, insider_buys)

        # 7. AI summary (top N only)
        summary = get_ollama_summary("US", scored)

        # 8. Persist to DB
        for s in scored:
            db.add(StockSignal(
                scan_id      = scan_record.id,
                market       = "US",
                ticker       = s["ticker"],
                name         = s.get("name", ""),
                price        = s.get("price", 0),
                currency     = "USD",
                change_pct   = s.get("change_pct", 0),
                volume       = s.get("volume", 0),
                volume_spike = s.get("volume_spike", 1),
                score        = s.get("score", 0),
                signals      = json.dumps(s.get("sub_scores", {})),
                insider_buy  = s.get("insider_buy", False),
            ))

        scan_record.finished_at   = datetime.utcnow()
        scan_record.stocks_scanned = len(candidates)
        scan_record.signals_found  = len(scored)
        scan_record.ai_summary     = summary
        db.commit()

        print(f"[scan_us] done — {len(scored)} signals, scan_id={scan_record.id}")
        return {"scan_id": scan_record.id, "signals": scored, "summary": summary}

    except Exception as e:
        print(f"[scan_us] error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def run_in_scan() -> dict:
    """Full IN scan pipeline. Returns result dict."""
    print("[scan_in] starting")
    db = _get_db_direct()
    started = datetime.utcnow()

    scan_record = ScanResult(market="IN", started_at=started)
    db.add(scan_record)
    db.commit()
    db.refresh(scan_record)

    try:
        # 1. Candidates from screener.in
        candidates = fetch_screener_stocks(max_pages=3)
        symbols    = [s["ticker"] for s in candidates if s["ticker"]]

        # 2. Live data from NSE
        nse_map = enrich_nse_tickers(symbols)

        # 3. MoneyControl buzz
        mc_map = fetch_moneycontrol_buzz(symbols)

        # 4. Score
        scored = score_all_in(candidates, nse_map, mc_map)

        # 5. AI summary
        summary = get_ollama_summary("IN", scored)

        # 6. Persist
        for s in scored:
            db.add(StockSignal(
                scan_id      = scan_record.id,
                market       = "IN",
                ticker       = s["ticker"],
                name         = s.get("name", ""),
                price        = s.get("price", 0),
                currency     = "INR",
                change_pct   = s.get("change_pct", 0),
                volume       = s.get("volume", 0),
                volume_spike = s.get("volume_spike", 1),
                score        = s.get("score", 0),
                signals      = json.dumps(s.get("sub_scores", {})),
                insider_buy  = False,
            ))

        scan_record.finished_at    = datetime.utcnow()
        scan_record.stocks_scanned = len(candidates)
        scan_record.signals_found  = len(scored)
        scan_record.ai_summary     = summary
        db.commit()

        print(f"[scan_in] done — {len(scored)} signals, scan_id={scan_record.id}")
        return {"scan_id": scan_record.id, "signals": scored, "summary": summary}

    except Exception as e:
        print(f"[scan_in] error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    init_db()
    start_scheduler(run_us_scan, run_in_scan)
    print("[app] PennyScope started")


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/scan/us")
def trigger_us_scan(background_tasks: BackgroundTasks):
    """Manually trigger a US scan. Runs in background, returns immediately."""
    background_tasks.add_task(run_us_scan)
    return {"status": "US scan started"}


@app.post("/api/scan/in")
def trigger_in_scan(background_tasks: BackgroundTasks):
    """Manually trigger an IN scan. Runs in background, returns immediately."""
    background_tasks.add_task(run_in_scan)
    return {"status": "IN scan started"}


@app.post("/api/scan/both")
def trigger_both_scans(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_us_scan)
    background_tasks.add_task(run_in_scan)
    return {"status": "Both scans started"}


@app.get("/api/results/latest")
def get_latest_results(market: str = "both", db: Session = Depends(get_db)):
    """
    Returns latest scan results.
    market = 'us' | 'in' | 'both'
    """
    markets = []
    if market.lower() == "both":
        markets = ["US", "IN"]
    elif market.lower() == "us":
        markets = ["US"]
    else:
        markets = ["IN"]

    response = {}
    for m in markets:
        # Get most recent scan
        latest_scan = (
            db.query(ScanResult)
            .filter(ScanResult.market == m, ScanResult.finished_at != None)
            .order_by(ScanResult.finished_at.desc())
            .first()
        )
        if not latest_scan:
            response[m.lower()] = {"signals": [], "summary": "No scan completed yet.", "scan_info": None}
            continue

        signals = (
            db.query(StockSignal)
            .filter(StockSignal.scan_id == latest_scan.id)
            .order_by(StockSignal.score.desc())
            .all()
        )

        response[m.lower()] = {
            "scan_info": {
                "id"             : latest_scan.id,
                "started_at"     : latest_scan.started_at.isoformat() if latest_scan.started_at else None,
                "finished_at"    : latest_scan.finished_at.isoformat() if latest_scan.finished_at else None,
                "stocks_scanned" : latest_scan.stocks_scanned,
                "signals_found"  : latest_scan.signals_found,
            },
            "summary": latest_scan.ai_summary or "",
            "signals": [
                {
                    "ticker"      : s.ticker,
                    "name"        : s.name,
                    "price"       : s.price,
                    "currency"    : s.currency,
                    "change_pct"  : s.change_pct,
                    "volume"      : s.volume,
                    "volume_spike": s.volume_spike,
                    "score"       : s.score,
                    "sub_scores"  : json.loads(s.signals) if s.signals else {},
                    "insider_buy" : s.insider_buy,
                }
                for s in signals
            ],
        }

    return response


@app.get("/api/history")
def get_scan_history(limit: int = 20, db: Session = Depends(get_db)):
    """Returns last N scan metadata records."""
    scans = (
        db.query(ScanResult)
        .order_by(ScanResult.started_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id"             : s.id,
            "market"         : s.market,
            "started_at"     : s.started_at.isoformat() if s.started_at else None,
            "finished_at"    : s.finished_at.isoformat() if s.finished_at else None,
            "stocks_scanned" : s.stocks_scanned,
            "signals_found"  : s.signals_found,
            "ai_summary"     : s.ai_summary,
        }
        for s in scans
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=API_HOST, port=API_PORT, reload=False)