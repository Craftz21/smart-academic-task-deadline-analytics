#!/usr/bin/env bash
# AcademiQ — Smart Academic Task System
# ONE-COMMAND startup for Linux/macOS
# Usage: bash run.sh

set -e
GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AcademiQ — Smart Academic Task System      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check Python
if ! command -v python3 &>/dev/null; then
    echo -e "${RED}✗ Python 3 not found. Please install Python 3.9+${NC}"; exit 1
fi
echo -e "${GREEN}✓ Python: $(python3 --version)${NC}"

# Check Node
if ! command -v node &>/dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node: $(node --version)${NC}"

# Backend venv + deps
echo -e "\n${YELLOW}[Backend] Setting up virtual environment...${NC}"
cd "$SCRIPT_DIR/backend"
[ ! -d "venv" ] && python3 -m venv venv
source venv/bin/activate
pip install -q -r requirements.txt
echo -e "${GREEN}  ✓ Backend ready${NC}"

# Frontend deps
echo -e "\n${YELLOW}[Frontend] Installing Node packages...${NC}"
cd "$SCRIPT_DIR/frontend"
[ ! -d "node_modules" ] && npm install --silent
echo -e "${GREEN}  ✓ Frontend ready${NC}"

# Start backend
echo -e "\n${YELLOW}[Backend] Starting Flask on :5000...${NC}"
cd "$SCRIPT_DIR/backend"
source venv/bin/activate
python3 app.py &
BACKEND_PID=$!
sleep 2
echo -e "${GREEN}  ✓ Backend PID: $BACKEND_PID${NC}"

# Start frontend
echo -e "\n${YELLOW}[Frontend] Starting Vite on :5173...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
sleep 2
echo -e "${GREEN}  ✓ Frontend PID: $FRONTEND_PID${NC}"

# Open browser
command -v xdg-open &>/dev/null && xdg-open http://localhost:5173 &>/dev/null &
command -v open      &>/dev/null && open http://localhost:5173      &>/dev/null &

echo ""
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  AcademiQ is running!${NC}"
echo ""
echo -e "  🌐 Frontend  →  ${BLUE}http://localhost:5173${NC}"
echo -e "  ⚙️  Backend   →  ${BLUE}http://localhost:5000${NC}"
echo ""
echo -e "  Demo logins:"
echo -e "  admin / admin123   |   prof_alex / prof123   |   student1 / student123"
echo ""
echo -e "  Press ${RED}Ctrl+C${NC} to stop all servers"
echo -e "${BLUE}══════════════════════════════════════════════${NC}"

trap "echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Done.'" EXIT INT TERM
wait $BACKEND_PID $FRONTEND_PID
