#!/usr/bin/env bash
# Trust Electric Heating — Local Development Starter
# Usage: bash scripts/dev.sh

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   Trust Electric Heating — Dev Mode       ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ── 1. Start database services ───────────────────────────────
echo "▶ Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

echo "  Waiting for services to be healthy..."
until docker-compose exec -T postgres pg_isready -U trust -d trust_electric > /dev/null 2>&1; do
  sleep 1
done
until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
  sleep 1
done
echo "  ✓ Database services healthy"

# ── 2. Backend ───────────────────────────────────────────────
echo ""
echo "▶ Starting FastAPI backend..."
if [ -d "$ROOT_DIR/backend" ] && [ -f "$ROOT_DIR/backend/main.py" ]; then
  cd "$ROOT_DIR/backend"
  if [ ! -d ".venv" ]; then
    echo "  Creating Python virtual environment..."
    python -m venv .venv
    source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate 2>/dev/null
    pip install -r requirements.txt -q
  else
    source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate 2>/dev/null
  fi
  uvicorn main:app --reload --port 8000 &
  BACKEND_PID=$!
  echo "  ✓ Backend starting on http://localhost:8000 (PID $BACKEND_PID)"
  cd "$ROOT_DIR"
else
  echo "  ⚠ Backend not yet scaffolded — skipping"
fi

# ── 3. Landing Page ──────────────────────────────────────────
echo ""
echo "▶ Starting landing page..."
if [ -d "$ROOT_DIR/landing-page" ] && [ -f "$ROOT_DIR/landing-page/package.json" ]; then
  cd "$ROOT_DIR/landing-page"
  [ ! -d "node_modules" ] && npm install -q
  npm run dev &
  LANDING_PID=$!
  echo "  ✓ Landing page starting on http://localhost:3000 (PID $LANDING_PID)"
  cd "$ROOT_DIR"
else
  echo "  ⚠ Landing page not yet scaffolded — skipping"
fi

# ── 4. Dashboard ─────────────────────────────────────────────
echo ""
echo "▶ Starting dashboard..."
if [ -d "$ROOT_DIR/dashboard" ] && [ -f "$ROOT_DIR/dashboard/package.json" ]; then
  cd "$ROOT_DIR/dashboard"
  [ ! -d "node_modules" ] && npm install -q
  npm run dev &
  DASHBOARD_PID=$!
  echo "  ✓ Dashboard starting on http://localhost:5173 (PID $DASHBOARD_PID)"
  cd "$ROOT_DIR"
else
  echo "  ⚠ Dashboard not yet scaffolded — skipping"
fi

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Services running:                        ║"
echo "║  Landing Page  →  http://localhost:3000   ║"
echo "║  Dashboard     →  http://localhost:5173   ║"
echo "║  Backend API   →  http://localhost:8000   ║"
echo "║  API Docs      →  http://localhost:8000/docs ║"
echo "╚═══════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop, or run: bash scripts/stop.sh"
echo ""

# Keep script alive so Ctrl+C kills children
wait
