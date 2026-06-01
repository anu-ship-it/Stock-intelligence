# backend/scheduler.py
"""
Runs the full scan pipeline on a schedule.
Only fires during market hours for each respective market.
US: 9:30–16:00 EST  |  IN: 9:15–15:30 IST
"""
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import pytz
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from config import (
    SCAN_INTERVAL_MINUTES,
    US_MARKET_OPEN, US_MARKET_CLOSE, US_MARKET_TZ,
    IN_MARKET_OPEN, IN_MARKET_CLOSE, IN_MARKET_TZ,
)

# Import scan runners — defined in main.py and injected here
_scan_us_fn = None
_scan_in_fn = None


def _is_market_open(open_time: str, close_time: str, tz_name: str) -> bool:
    tz  = pytz.timezone(tz_name)
    now = datetime.now(tz)
    # Skip weekends
    if now.weekday() >= 5:
        return False
    open_h,  open_m  = map(int, open_time.split(":"))
    close_h, close_m = map(int, close_time.split(":"))
    market_open  = now.replace(hour=open_h,  minute=open_m,  second=0, microsecond=0)
    market_close = now.replace(hour=close_h, minute=close_m, second=0, microsecond=0)
    return market_open <= now <= market_close


def _scheduled_job():
    """Called by scheduler every SCAN_INTERVAL_MINUTES."""
    us_open = _is_market_open(US_MARKET_OPEN, US_MARKET_CLOSE, US_MARKET_TZ)
    in_open = _is_market_open(IN_MARKET_OPEN, IN_MARKET_CLOSE, IN_MARKET_TZ)

    print(f"[scheduler] tick — US market {'OPEN' if us_open else 'closed'} | IN market {'OPEN' if in_open else 'closed'}")

    if us_open and _scan_us_fn:
        try:
            _scan_us_fn()
        except Exception as e:
            print(f"[scheduler] US scan error: {e}")

    if in_open and _scan_in_fn:
        try:
            _scan_in_fn()
        except Exception as e:
            print(f"[scheduler] IN scan error: {e}")


def start_scheduler(scan_us_fn, scan_in_fn):
    """
    Starts the background scheduler.
    Pass the actual scan functions from main.py.
    """
    global _scan_us_fn, _scan_in_fn
    _scan_us_fn = scan_us_fn
    _scan_in_fn = scan_in_fn

    scheduler = BackgroundScheduler(timezone=pytz.utc)
    scheduler.add_job(
        _scheduled_job,
        trigger=IntervalTrigger(minutes=SCAN_INTERVAL_MINUTES),
        id="penny_scan",
        replace_existing=True,
    )
    scheduler.start()
    print(f"[scheduler] started — scanning every {SCAN_INTERVAL_MINUTES} minutes during market hours")
    return scheduler
