#!/bin/bash

# CST Audit - Development Server Startup Script
# Starts both backend and frontend servers

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CST Audit - Development Server         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}\n"

# Function to kill processes on exit
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Step 1: Check if ports are free
echo -e "${YELLOW}[1/4] Checking ports...${NC}"

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Port 5000 is already in use!${NC}"
    echo -e "${YELLOW}Run: ./fix-port-conflict.sh to free the port${NC}"
    exit 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Port 5173 is already in use!${NC}"
    echo -e "${YELLOW}Run: ./fix-port-conflict.sh to free the port${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Ports are available${NC}"

# Step 2: Check MongoDB
echo -e "\n${YELLOW}[2/4] Checking MongoDB...${NC}"

if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}MongoDB is not running. Attempting to start...${NC}"
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
        sleep 2
        if pgrep -x "mongod" > /dev/null; then
            echo -e "${GREEN}✓ MongoDB started${NC}"
        else
            echo -e "${RED}Failed to start MongoDB${NC}"
            echo -e "${YELLOW}Please start MongoDB manually or install it${NC}"
            exit 1
        fi
    else
        echo -e "${RED}Cannot start MongoDB (systemctl not found)${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ MongoDB is running${NC}"
fi

# Step 3: Start backend
echo -e "\n${YELLOW}[3/4] Starting backend server...${NC}"

cd "$SCRIPT_DIR/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Backend dependencies not installed!${NC}"
    echo -e "${YELLOW}Run: npm install in backend folder${NC}"
    exit 1
fi

# Start backend in background
npm start > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Backend failed to start!${NC}"
    echo -e "${YELLOW}Check logs: tail -f logs/backend.log${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend running on http://localhost:5000 (PID: $BACKEND_PID)${NC}"

# Step 4: Start frontend
echo -e "\n${YELLOW}[4/4] Starting frontend server...${NC}"

cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Frontend dependencies not installed!${NC}"
    echo -e "${YELLOW}Run: npm install in main folder${NC}"
    cleanup
    exit 1
fi

echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Servers Started Successfully! 🚀       ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Access Points:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"
echo -e "\n${BLUE}Login:${NC}"
echo -e "  Username: ${GREEN}admin${NC}"
echo -e "  Password: ${GREEN}admin123${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Start frontend (runs in foreground)
npm run dev

# If we get here, user stopped frontend, so cleanup backend
cleanup