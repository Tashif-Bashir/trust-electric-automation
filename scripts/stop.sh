#!/usr/bin/env bash
# Trust Electric Heating — Stop All Services
# Usage: bash scripts/stop.sh

echo ""
echo "Stopping Trust Electric services..."

# Stop Node dev servers
echo "▶ Stopping Node processes..."
pkill -f "next dev" 2>/dev/null && echo "  ✓ Landing page stopped" || echo "  — No Next.js process found"
pkill -f "vite" 2>/dev/null && echo "  ✓ Dashboard stopped" || echo "  — No Vite process found"

# Stop Python backend
echo "▶ Stopping backend..."
pkill -f "uvicorn main:app" 2>/dev/null && echo "  ✓ Backend stopped" || echo "  — No uvicorn process found"

# Stop Docker services
echo "▶ Stopping Docker services..."
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
docker-compose stop postgres redis 2>/dev/null && echo "  ✓ PostgreSQL and Redis stopped"

echo ""
echo "All services stopped. Run 'bash scripts/dev.sh' to start again."
echo ""
