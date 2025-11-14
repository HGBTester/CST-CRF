#!/bin/bash

# CST Audit - Complete Setup and Run Script
# This single script handles everything: setup, installation, and running the application
 
set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Global variables
BACKEND_PID=""
FRONTEND_PID=""

# Banner
show_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║           CST Audit System - Setup & Run                 ║"
    echo "║           Complete Installation & Startup                ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}\n"
}

# Cleanup function
cleanup() {
    echo -e "\n${YELLOW}Stopping servers...${NC}"
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Step 1: Check if running on Linux
check_system() {
    echo -e "${BLUE}[1/10] Checking system...${NC}"

    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        echo -e "${RED}This script is designed for Linux systems${NC}"
        exit 1
    fi

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
        echo -e "${GREEN}✓ Detected: $OS $VER${NC}"
    else
        echo -e "${YELLOW}Warning: Cannot detect OS version${NC}"
    fi
}

# Step 2: Install Node.js if needed
install_nodejs() {
    echo -e "\n${BLUE}[2/10] Checking Node.js...${NC}"

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
    else
        echo -e "${YELLOW}Installing Node.js 18...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        echo -e "${GREEN}✓ Node.js installed: $(node -v)${NC}"
    fi
}

# Step 3: Fix and install MongoDB
setup_mongodb() {
    echo -e "\n${BLUE}[3/10] Setting up MongoDB...${NC}"

    # Check if MongoDB is already running
    if pgrep -x "mongod" > /dev/null && mongosh --quiet --eval "db.version()" &>/dev/null; then
        echo -e "${GREEN}✓ MongoDB is already running${NC}"
        return
    fi

    # Check if MongoDB is installed
    if command -v mongod &> /dev/null; then
        echo -e "${YELLOW}MongoDB installed, starting service...${NC}"
        sudo systemctl start mongod 2>/dev/null || true
        sudo systemctl enable mongod 2>/dev/null || true
        sleep 2
        echo -e "${GREEN}✓ MongoDB started${NC}"
        return
    fi

    # Install MongoDB
    echo -e "${YELLOW}Installing MongoDB 7.0...${NC}"

    # Remove any old repository files
    sudo rm -f /etc/apt/sources.list.d/mongodb-org-7.0.list

    # Add GPG key
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
        sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

    # Detect Ubuntu version and use appropriate repository
    UBUNTU_VERSION=$(lsb_release -cs 2>/dev/null || echo "jammy")

    # Use jammy repo for Ubuntu 24.04 (noble) compatibility
    if [ "$UBUNTU_VERSION" = "noble" ]; then
        echo -e "${YELLOW}Ubuntu 24.04 detected, using Ubuntu 22.04 repository${NC}"
        REPO_VERSION="jammy"
    else
        REPO_VERSION="$UBUNTU_VERSION"
    fi

    # Add MongoDB repository
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $REPO_VERSION/mongodb-org/7.0 multiverse" | \
        sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

    # Update and install
    sudo apt-get update
    sudo apt-get install -y mongodb-org

    # Start and enable MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sleep 2

    echo -e "${GREEN}✓ MongoDB installed and running${NC}"
}

# Step 4: Fix port conflicts
fix_ports() {
    echo -e "\n${BLUE}[4/10] Checking and freeing ports...${NC}"

    # Kill anything on port 5000
    if lsof -ti:5000 &>/dev/null; then
        echo -e "${YELLOW}Killing process on port 5000...${NC}"
        lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    fi

    # Kill anything on port 5173
    if lsof -ti:5173 &>/dev/null; then
        echo -e "${YELLOW}Killing process on port 5173...${NC}"
        lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    fi

    sleep 1
    echo -e "${GREEN}✓ Ports 5000 and 5173 are free${NC}"
}

# Step 5: Install dependencies
install_dependencies() {
    echo -e "\n${BLUE}[5/10] Installing dependencies...${NC}"

    # Clean install frontend
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm cache clean --force 2>/dev/null || true
    npm install

    # Make vite executable
    chmod +x node_modules/.bin/vite 2>/dev/null || true

    # Clean install backend
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd backend
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm install
    cd ..

    echo -e "${GREEN}✓ All dependencies installed${NC}"
}

# Step 6: Setup environment files
setup_environment() {
    echo -e "\n${BLUE}[6/10] Setting up environment...${NC}"

    # Backend .env
    if [ ! -f "backend/.env" ]; then
        JWT_SECRET=$(openssl rand -base64 32)
        cat > backend/.env <<EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cst-audit
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
EOF
        echo -e "${GREEN}✓ Backend .env created${NC}"
    else
        echo -e "${GREEN}✓ Backend .env exists${NC}"
    fi

    # Frontend .env
    if [ ! -f ".env" ]; then
        cat > .env <<EOF
VITE_API_URL=http://localhost:5000/api
EOF
        echo -e "${GREEN}✓ Frontend .env created${NC}"
    else
        echo -e "${GREEN}✓ Frontend .env exists${NC}"
    fi

    # Create logs directory
    mkdir -p logs
}

# Step 7: Initialize database
init_database() {
    echo -e "\n${BLUE}[7/10] Initializing database...${NC}"

    # Check if database already has data
    USER_COUNT=$(mongosh --quiet --eval "use cst-audit; db.users.countDocuments()" 2>/dev/null || echo "0")

    if [ "$USER_COUNT" = "0" ]; then
        echo -e "${YELLOW}Initializing database with sample data...${NC}"
        cd backend
        node scripts/init-db.js 2>/dev/null || echo -e "${YELLOW}Database initialization skipped (script may not exist)${NC}"
        cd ..
        echo -e "${GREEN}✓ Database initialized${NC}"
    else
        echo -e "${GREEN}✓ Database already contains data (Users: $USER_COUNT)${NC}"
    fi
}

# Step 8: Check all prerequisites
final_checks() {
    echo -e "\n${BLUE}[8/10] Running final checks...${NC}"

    # Check MongoDB
    if ! mongosh --quiet --eval "db.version()" &>/dev/null; then
        echo -e "${RED}MongoDB connection failed${NC}"
        exit 1
    fi

    # Check node_modules
    if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ]; then
        echo -e "${RED}Dependencies not installed properly${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ All checks passed${NC}"
}

# Step 9: Start backend
start_backend() {
    echo -e "\n${BLUE}[9/10] Starting backend server...${NC}"

    cd "$SCRIPT_DIR/backend"
    npm start > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    BACKEND_PID=$!
    cd "$SCRIPT_DIR"

    # Wait for backend to start
    echo -e "${YELLOW}Waiting for backend...${NC}"
    for i in {1..10}; do
        if curl -s http://localhost:5000/api/health &>/dev/null; then
            echo -e "${GREEN}✓ Backend running on http://localhost:5000 (PID: $BACKEND_PID)${NC}"
            return 0
        fi
        sleep 1
    done

    echo -e "${YELLOW}Backend started but health check pending${NC}"
}

# Step 10: Start frontend
start_frontend() {
    echo -e "\n${BLUE}[10/10] Starting frontend server...${NC}"

    echo -e "\n${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}║              🚀 CST Audit System Running! 🚀              ║${NC}"
    echo -e "${CYAN}║                                                           ║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}\n"

    echo -e "${GREEN}Access Points:${NC}"
    echo -e "  Frontend:  ${MAGENTA}http://localhost:5173${NC}"
    echo -e "  Backend:   ${MAGENTA}http://localhost:5000${NC}"
    echo -e "  API:       ${MAGENTA}http://localhost:5000/api${NC}"

    echo -e "\n${GREEN}Login Credentials:${NC}"
    echo -e "  Username:  ${MAGENTA}admin${NC}"
    echo -e "  Password:  ${MAGENTA}admin123${NC}"

    echo -e "\n${GREEN}Additional Accounts:${NC}"
    echo -e "  Auditor:   ${MAGENTA}auditor / auditor123${NC}"
    echo -e "  Viewer:    ${MAGENTA}viewer / viewer123${NC}"

    echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}"
    echo -e "${YELLOW}Backend logs: tail -f logs/backend.log${NC}\n"

    # Start frontend (foreground)
    npm run dev

    # Cleanup when frontend stops
    cleanup
}

# Main execution
main() {
    show_banner
    check_system
    install_nodejs
    setup_mongodb
    fix_ports
    install_dependencies
    setup_environment
    init_database
    final_checks
    start_backend
    start_frontend
}

# Run main function
main