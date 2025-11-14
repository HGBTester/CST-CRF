#!/bin/bash

# Quick Development Setup for CST Audit
# This script quickly sets up the development environment

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   CST Audit - Quick Development Setup    ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}\n"

# Step 1: Check Node.js
echo -e "${YELLOW}[1/6] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not installed${NC}"
    echo -e "${YELLOW}Installing Node.js 18...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js installed${NC}"
fi

# Step 2: Check MongoDB
echo -e "\n${YELLOW}[2/6] Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}✓ MongoDB is running${NC}"
    else
        echo -e "${YELLOW}Starting MongoDB...${NC}"
        sudo systemctl start mongod
        echo -e "${GREEN}✓ MongoDB started${NC}"
    fi
else
    echo -e "${YELLOW}MongoDB not installed. Running fix script...${NC}"
    if [ -f "fix-mongodb-ubuntu24.sh" ]; then
        sudo ./fix-mongodb-ubuntu24.sh
    else
        echo -e "${RED}MongoDB fix script not found. Please install MongoDB manually.${NC}"
        exit 1
    fi
fi

# Step 3: Clean install dependencies
echo -e "\n${YELLOW}[3/6] Installing dependencies (clean)...${NC}"

# Remove old node_modules and locks
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Install frontend deps
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install

# Install backend deps
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend && npm install && cd ..

# Fix permissions
chmod +x node_modules/.bin/vite 2>/dev/null || true

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 4: Setup environment files
echo -e "\n${YELLOW}[4/6] Setting up environment files...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    cat > .env <<EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo -e "${GREEN}✓ Frontend .env created${NC}"
else
    echo -e "${GREEN}✓ Frontend .env exists${NC}"
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"

    # Generate JWT secret
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

# Step 5: Initialize database
echo -e "\n${YELLOW}[5/6] Initializing database...${NC}"

# Check if database already has data
if mongosh --quiet --eval "use cst-audit; db.users.countDocuments()" | grep -q "^0$"; then
    echo -e "${YELLOW}Initializing database with sample data...${NC}"
    cd backend && node scripts/init-db.js && cd ..
    echo -e "${GREEN}✓ Database initialized${NC}"
else
    echo -e "${GREEN}✓ Database already contains data${NC}"
fi

# Step 6: Create convenience scripts
echo -e "\n${YELLOW}[6/6] Creating convenience scripts...${NC}"

# Create start script
cat > start.sh <<'EOF'
#!/bin/bash

# Start both frontend and backend
echo "Starting CST Audit servers..."

# Terminal colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Start MongoDB if not running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    sudo systemctl start mongod
fi

# Start backend
echo -e "${YELLOW}Starting backend on http://localhost:5000${NC}"
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend
echo -e "${YELLOW}Starting frontend on http://localhost:5173${NC}"
echo -e "${GREEN}Press Ctrl+C to stop both servers${NC}"
cd .. && npm run dev

# Cleanup
echo -e "${YELLOW}Stopping backend...${NC}"
kill $BACKEND_PID 2>/dev/null
EOF

chmod +x start.sh

# Create build script
cat > build.sh <<'EOF'
#!/bin/bash

echo "Building CST Audit for production..."
npm run build
echo "Build complete! Files in ./dist"
echo "To serve: npx serve -s dist -l 3000"
EOF

chmod +x build.sh

echo -e "${GREEN}✓ Scripts created${NC}"

# Final summary
echo -e "\n${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Setup Complete! 🎉                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}\n"

echo -e "${BLUE}Quick Start Commands:${NC}"
echo -e "  ${GREEN}./start.sh${NC}     - Start both frontend and backend"
echo -e "  ${GREEN}npm run dev${NC}    - Start only frontend dev server"
echo -e "  ${GREEN}npm run backend${NC} - Start only backend server"
echo -e "\n${BLUE}Access Points:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:5000${NC}"
echo -e "\n${BLUE}Login Credentials:${NC}"
echo -e "  Username: ${GREEN}admin${NC}"
echo -e "  Password: ${GREEN}admin123${NC}"

# Test if we can start vite
echo -e "\n${YELLOW}Testing vite...${NC}"
if npx vite --version &>/dev/null; then
    VITE_VERSION=$(npx vite --version)
    echo -e "${GREEN}✓ Vite is working: $VITE_VERSION${NC}"
    echo -e "\n${GREEN}Ready to start development!${NC}"
    echo -e "Run: ${GREEN}./start.sh${NC}"
else
    echo -e "${RED}Vite test failed. Trying to fix...${NC}"
    npm rebuild
    echo -e "${YELLOW}Please try running: npm run dev${NC}"
fi