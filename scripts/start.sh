#!/usr/bin/env bash
set -euo pipefail

# ── Colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

# ── Initialize PIDs so the trap never hits unbound variables ───────────────────
SERVER_PID=""
CLIENT_PID=""

# ── Cleanup on exit ────────────────────────────────────────────────────────────
cleanup() {
  echo -e "\n${YELLOW}Shutting down...${NC}"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null || true
  [ -n "$CLIENT_PID" ] && kill "$CLIENT_PID" 2>/dev/null || true
  echo -e "${GREEN}Done.${NC}"
}
trap cleanup EXIT INT TERM

# ── Repo root ──────────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

# ── Check Docker is running ────────────────────────────────────────────────────
if ! docker info &>/dev/null; then
  echo -e "${RED}Docker is not running. Start Docker and try again.${NC}"
  exit 1
fi

# ── Start infrastructure ───────────────────────────────────────────────────────
echo -e "${GREEN}Starting PostgreSQL and Redis...${NC}"
docker compose -f "$ROOT/docker-compose.yml" up -d
echo -e "${GREEN}PostgreSQL → localhost:5432  |  Redis → localhost:6379${NC}"

# ── Auto-setup if venv or node_modules are missing ────────────────────────────
if [ ! -f "$ROOT/server/.venv/bin/activate" ]; then
  echo -e "${YELLOW}Python venv not found — running setup...${NC}"
  cd "$ROOT/server" && python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
fi

if [ ! -d "$ROOT/client/node_modules" ]; then
  echo -e "${YELLOW}node_modules not found — running npm install...${NC}"
  cd "$ROOT/client" && npm install
fi

# ── Run migrations ─────────────────────────────────────────────────────────────
echo -e "${GREEN}Running database migrations...${NC}"
(cd "$ROOT/server" && . .venv/bin/activate && alembic upgrade head)

# ── Start FastAPI server ───────────────────────────────────────────────────────
echo -e "${GREEN}Starting FastAPI server on http://localhost:8000${NC}"
(cd "$ROOT/server" && . .venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000) &
SERVER_PID=$!

# ── Start Vite client ──────────────────────────────────────────────────────────
echo -e "${GREEN}Starting Vite dev server on http://localhost:5173${NC}"
(cd "$ROOT/client" && npm run dev) &
CLIENT_PID=$!

# ── Wait ───────────────────────────────────────────────────────────────────────
echo -e "${GREEN}All services running. Press Ctrl+C to stop.${NC}"
wait
