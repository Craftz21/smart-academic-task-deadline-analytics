#!/usr/bin/env bash
# AcademiQ — Docker startup script

set -e

GREEN='\033[0;32m'; BLUE='\033[0;34m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AcademiQ — Docker Startup                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Check Docker
if ! command -v docker &>/dev/null; then
    echo -e "${RED}✗ Docker not found. Install Docker Desktop${NC}"
    exit 1
fi

# Detect compose
if docker compose version &>/dev/null 2>&1; then
    DC="docker compose"
elif command -v docker-compose &>/dev/null; then
    DC="docker-compose"
else
    echo -e "${RED}✗ Docker Compose not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker: $(docker --version)${NC}"
echo -e "${GREEN}✓ Compose: $DC${NC}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Build + run
echo -e "\n${YELLOW}Building and starting containers...${NC}"
if ! $DC up --build -d; then
    echo -e "${RED}✗ Failed to start containers${NC}"
    exit 1
fi

# Wait for backend
echo -e "\n${YELLOW}Waiting for backend to be ready...${NC}"
for i in {1..15}; do
    if curl -s http://localhost:5000 >/dev/null; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    sleep 1
done

echo ""
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  AcademiQ Docker is running!${NC}"
echo ""
echo -e "  🌐 Frontend  →  ${BLUE}http://localhost:3000${NC}"
echo -e "  ⚙️  Backend   →  ${BLUE}http://localhost:5000${NC}"
echo ""
echo -e "  Demo logins:"
echo -e "  admin/admin123  |  prof_alex/prof123  |  student1/student123"
echo ""
echo -e "  To stop:   ${YELLOW}$DC down${NC}"
echo -e "  To logs:   ${YELLOW}$DC logs -f${NC}"
echo -e "${BLUE}══════════════════════════════════════════════${NC}"

# Open browser
command -v xdg-open &>/dev/null && xdg-open http://localhost:3000 &
command -v open &>/dev/null && open http://localhost:3000 &