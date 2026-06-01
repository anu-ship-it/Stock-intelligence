#!/bin/bash
# ── PennyScope · run.sh ──────────────────────────────────────────────────────
# Single command to install deps and start the app.
# Usage: bash run.sh

set -e
cd "$(dirname "$0")"

echo ""
echo "  ██████╗ ███████╗███╗   ██╗███╗   ██╗██╗   ██╗"
echo "  ██╔══██╗██╔════╝████╗  ██║████╗  ██║╚██╗ ██╔╝"
echo "  ██████╔╝█████╗  ██╔██╗ ██║██╔██╗ ██║ ╚████╔╝ "
echo "  ██╔═══╝ ██╔══╝  ██║╚██╗██║██║╚██╗██║  ╚██╔╝  "
echo "  ██║     ███████╗██║ ╚████║██║ ╚████║   ██║   "
echo "  ╚═╝     ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═══╝   ╚═╝   "
echo "  PennyScope · US + IN penny stock screener"
echo ""

# ── 1. Check Python ───────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo "[error] python3 not found. Install Python 3.11+ first."
  exit 1
fi

PYTHON=$(command -v python3)
echo "[setup] Using $PYTHON ($($PYTHON --version))"

# ── 2. Create venv if missing ─────────────────────────────────────────────────
if [ ! -d "venv" ]; then
  echo "[setup] Creating virtual environment…"
  $PYTHON -m venv venv
fi
source venv/bin/activate

# ── 3. Install dependencies ───────────────────────────────────────────────────
echo "[setup] Installing dependencies…"
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# ── 4. Create .env if missing ─────────────────────────────────────────────────
if [ ! -f ".env" ]; then
  echo "[setup] Creating .env file — fill in Reddit credentials to enable Reddit scraping"
  cat > .env << 'ENVEOF'
# Reddit API credentials (free — register at https://www.reddit.com/prefs/apps)
# Create a "script" type app. Leave blank to skip Reddit scraping.
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=PennyScope/1.0
ENVEOF
fi

# ── 5. Check Ollama ───────────────────────────────────────────────────────────
if command -v ollama &>/dev/null; then
  echo "[ollama] found. Checking if running…"
  if ! curl -s http://localhost:11434/api/tags &>/dev/null; then
    echo "[ollama] starting Ollama in background…"
    ollama serve &>/dev/null &
    sleep 2
  fi
  # Pull model if not present
  if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
    echo "[ollama] pulling llama3.2 (this may take a few minutes)…"
    ollama pull llama3.2
  fi
  echo "[ollama] ready"
else
  echo "[ollama] not installed — AI summaries will use fallback mode."
  echo "         Install from https://ollama.com and run: ollama pull llama3.2"
fi

# ── 6. Start FastAPI backend ──────────────────────────────────────────────────
echo ""
echo "[start] Starting PennyScope backend on http://localhost:8000"
echo "[start] Open frontend/index.html in your browser"
echo "[start] API docs at http://localhost:8000/docs"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload