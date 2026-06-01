# ── PennyScope · config.py ──────────────────────────────────────────────────
# Single source of truth for all constants, weights, and thresholds.
# Edit here — nowhere else needs to change.

# ── Ollama ───────────────────────────────────────────────────────────────────
OLLAMA_BASE_URL   = "http://localhost:11434"
OLLAMA_MODEL      = "llama3.2"          # change to any model you have pulled
OLLAMA_TIMEOUT    = 120                 # seconds

# ── Scheduler ────────────────────────────────────────────────────────────────
SCAN_INTERVAL_MINUTES = 30
# Market hours in their local timezones — scheduler only runs scans inside these
US_MARKET_OPEN    = "09:30"
US_MARKET_CLOSE   = "16:00"
US_MARKET_TZ      = "America/New_York"

IN_MARKET_OPEN    = "09:15"
IN_MARKET_CLOSE   = "15:30"
IN_MARKET_TZ      = "Asia/Kolkata"

# ── US Screener filters ───────────────────────────────────────────────────────
US_MAX_PRICE      = 5.00               # USD  — anything above is not a penny stock
US_MIN_VOLUME     = 500_000            # daily volume floor
US_MIN_MARKET_CAP = 1_000_000          # $1M — filters out dead shells
US_MAX_MARKET_CAP = 300_000_000        # $300M ceiling

# ── IN Screener filters ───────────────────────────────────────────────────────
IN_MAX_PRICE      = 50.0               # INR  — sub-₹50 is the penny zone
IN_MIN_VOLUME     = 100_000
IN_MIN_MARKET_CAP = 10_000_000         # ₹1 Cr floor
IN_MAX_MARKET_CAP = 5_000_000_000      # ₹500 Cr ceiling

# ── Scoring weights (must sum to 1.0 per market) ─────────────────────────────
US_WEIGHTS = {
    "volume_spike"      : 0.25,   # today's volume / 30-day avg
    "price_change_pct"  : 0.20,   # % change today
    "reddit_mentions"   : 0.20,   # mention velocity last 2h
    "reddit_sentiment"  : 0.15,   # positive ratio from PRAW
    "stocktwits_bull"   : 0.10,   # bullish % on StockTwits
    "insider_buy"       : 0.10,   # SEC Form 4 insider purchase flag
}

IN_WEIGHTS = {
    "volume_spike"      : 0.25,
    "price_change_pct"  : 0.20,
    "screener_score"    : 0.20,   # screener.in's own quality score
    "promoter_holding"  : 0.15,   # high promoter holding = positive signal
    "debt_to_equity"    : 0.10,   # lower = better (inverted in scorer)
    "moneycontrol_buzz" : 0.10,   # news mention count last 24h
}

# ── Top-N passed to Ollama for summary ───────────────────────────────────────
OLLAMA_TOP_N      = 10             # only top 10 scored stocks go to LLM

# ── Reddit ────────────────────────────────────────────────────────────────────
REDDIT_SUBREDDITS = [
    "pennystocks",
    "RobinHoodPennyStocks",
    "stocks",
    "wallstreetbets",
]
REDDIT_POST_LIMIT = 100            # posts to scan per subreddit per run

# ── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL      = "sqlite:///./pennyscope.db"

# ── API ───────────────────────────────────────────────────────────────────────
API_HOST          = "0.0.0.0"
API_PORT          = 8000
CORS_ORIGINS      = ["*"]          # lock this down if you expose to network