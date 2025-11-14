#!/bin/bash

# Fix port conflicts and kill existing processes
# This script stops any processes using ports 5000 and 5173

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Fixing Port Conflicts ===${NC}\n"

# Function to kill process on a port
kill_port() {
    local PORT=$1
    echo -e "${YELLOW}Checking port $PORT...${NC}"

    # Find PID using the port
    PID=$(lsof -ti:$PORT 2>/dev/null)

    if [ ! -z "$PID" ]; then
        echo -e "${YELLOW}Found process $PID using port $PORT${NC}"
        echo -e "${YELLOW}Killing process...${NC}"
        kill -9 $PID 2>/dev/null
        sleep 1
        echo -e "${GREEN}✓ Port $PORT freed${NC}"
    else
        echo -e "${GREEN}✓ Port $PORT is available${NC}"
    fi
}

# Kill processes on backend port (5000)
kill_port 5000

# Kill processes on frontend port (5173)
kill_port 5173

# Also kill any node processes that might be stuck
echo -e "\n${YELLOW}Checking for stuck Node.js processes...${NC}"
STUCK_PROCESSES=$(ps aux | grep -E "node.*server.js|vite" | grep -v grep | awk '{print $2}')

if [ ! -z "$STUCK_PROCESSES" ]; then
    echo -e "${YELLOW}Found stuck processes: $STUCK_PROCESSES${NC}"
    echo "$STUCK_PROCESSES" | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ Cleaned up stuck processes${NC}"
else
    echo -e "${GREEN}✓ No stuck processes found${NC}"
fi

echo -e "\n${GREEN}All ports are now free!${NC}"
echo -e "${BLUE}You can now start the application.${NC}"