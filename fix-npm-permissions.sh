#!/bin/bash

# Fix NPM/Vite permission issues on Ubuntu
# This script fixes common permission problems when running Node.js applications

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Fixing NPM/Vite Permission Issues ===${NC}\n"

# Check current user
CURRENT_USER=$(whoami)
echo -e "${YELLOW}Current user: $CURRENT_USER${NC}"

# Function to fix permissions
fix_permissions() {
    echo -e "${YELLOW}Fixing node_modules permissions...${NC}"

    # Remove node_modules and package-lock if they exist
    if [ -d "node_modules" ]; then
        echo -e "${YELLOW}Removing existing node_modules...${NC}"
        rm -rf node_modules
    fi

    if [ -f "package-lock.json" ]; then
        echo -e "${YELLOW}Removing package-lock.json...${NC}"
        rm -f package-lock.json
    fi

    # Clean npm cache
    echo -e "${YELLOW}Cleaning npm cache...${NC}"
    npm cache clean --force

    # Reinstall dependencies
    echo -e "${YELLOW}Reinstalling dependencies...${NC}"
    npm install

    # Make sure vite is executable
    if [ -f "node_modules/.bin/vite" ]; then
        chmod +x node_modules/.bin/vite
        echo -e "${GREEN}✓ Vite permissions fixed${NC}"
    fi

    # Also fix backend dependencies if backend exists
    if [ -d "backend" ]; then
        echo -e "${YELLOW}Fixing backend dependencies...${NC}"
        cd backend
        rm -rf node_modules package-lock.json
        npm install
        cd ..
        echo -e "${GREEN}✓ Backend dependencies fixed${NC}"
    fi
}

# Option 1: Fix as current user (recommended for root)
if [ "$CURRENT_USER" = "root" ]; then
    echo -e "${YELLOW}Running as root. Fixing permissions...${NC}"
    fix_permissions

    echo -e "\n${GREEN}✓ Permissions fixed!${NC}"
    echo -e "${BLUE}You can now run the application with:${NC}"
    echo -e "  ${GREEN}npm run dev${NC} - Start frontend dev server"
    echo -e "  ${GREEN}cd backend && npm start${NC} - Start backend server"
    echo -e "\n${YELLOW}Note: Running as root is not recommended for production.${NC}"

# Option 2: Create proper user and fix permissions
else
    echo -e "${GREEN}Running as non-root user: $CURRENT_USER${NC}"
    fix_permissions

    echo -e "\n${GREEN}✓ Permissions fixed!${NC}"
    echo -e "${BLUE}You can now run:${NC}"
    echo -e "  ${GREEN}npm run dev${NC} - Start frontend dev server"
fi

# Create start script for easy launching
cat > start-dev.sh <<'EOF'
#!/bin/bash

# Start CST Audit in development mode

echo "Starting CST Audit Development Servers..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongod
fi

# Start backend in background
echo "Starting backend server on port 5000..."
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting frontend dev server on port 5173..."
cd .. && npm run dev

# When frontend is stopped, also stop backend
kill $BACKEND_PID 2>/dev/null
EOF

chmod +x start-dev.sh

echo -e "\n${GREEN}Created start-dev.sh script for easy launching${NC}"
echo -e "${BLUE}To start both frontend and backend:${NC}"
echo -e "  ${GREEN}./start-dev.sh${NC}"

# Check if MongoDB is installed and running
if command -v mongod &> /dev/null; then
    if systemctl is-active --quiet mongod; then
        echo -e "\n${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "\n${YELLOW}MongoDB is installed but not running${NC}"
        echo -e "Start it with: ${GREEN}sudo systemctl start mongod${NC}"
    fi
else
    echo -e "\n${RED}MongoDB is not installed${NC}"
    echo -e "Install it with: ${GREEN}sudo ./fix-mongodb-ubuntu24.sh${NC}"
fi

# Final instructions
echo -e "\n${BLUE}=== Next Steps ===${NC}"
echo -e "1. Start the development server: ${GREEN}npm run dev${NC}"
echo -e "2. In another terminal, start the backend: ${GREEN}cd backend && npm start${NC}"
echo -e "3. Access the application at: ${GREEN}http://localhost:5173${NC}"
echo -e "\n${YELLOW}For production deployment, use: ${GREEN}sudo ./deploy.sh${NC}"