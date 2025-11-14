#!/bin/bash

# CST Audit - Environment Setup Script
# This script helps configure environment variables for the application

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Default values
DEFAULT_PORT=5000
DEFAULT_FRONTEND_PORT=3000
DEFAULT_JWT_EXPIRY="30d"
DEFAULT_LOG_LEVEL="info"

echo -e "${BLUE}CST Audit Environment Configuration${NC}"
echo -e "${BLUE}====================================${NC}\n"

# Function to generate random string
generate_secret() {
    openssl rand -base64 32
}

# Check if running in correct directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo -e "${RED}Error: This script must be run from the CST Audit root directory${NC}"
    exit 1
fi

# Gather configuration
echo -e "${YELLOW}Please provide the following configuration:${NC}\n"

# MongoDB Configuration
read -p "MongoDB URI (leave empty for local): " MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
    read -p "MongoDB Database Name [cst-audit]: " DB_NAME
    DB_NAME=${DB_NAME:-cst-audit}
    MONGODB_URI="mongodb://localhost:27017/$DB_NAME"
fi

# JWT Secret
JWT_SECRET=$(generate_secret)
echo -e "${GREEN}Generated JWT Secret: $JWT_SECRET${NC}"
read -p "Use generated JWT secret? (y/n) [y]: " use_generated
if [[ $use_generated == "n" || $use_generated == "N" ]]; then
    read -p "Enter JWT Secret: " JWT_SECRET
fi

# Port Configuration
read -p "Backend Port [$DEFAULT_PORT]: " PORT
PORT=${PORT:-$DEFAULT_PORT}

read -p "Frontend Port [$DEFAULT_FRONTEND_PORT]: " FRONTEND_PORT
FRONTEND_PORT=${FRONTEND_PORT:-$DEFAULT_FRONTEND_PORT}

# CORS Configuration
read -p "Frontend URL for CORS [http://localhost:$FRONTEND_PORT]: " CORS_ORIGIN
CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:$FRONTEND_PORT}

# Admin Configuration
read -p "Admin Password [admin123]: " ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}

read -p "Admin Email [admin@cst-audit.local]: " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@cst-audit.local}

# JWT Configuration
read -p "JWT Expiry [$DEFAULT_JWT_EXPIRY]: " JWT_EXPIRES_IN
JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-$DEFAULT_JWT_EXPIRY}

# Node Environment
read -p "Node Environment (development/production) [production]: " NODE_ENV
NODE_ENV=${NODE_ENV:-production}

# Logging
read -p "Log Level (error/warn/info/debug) [$DEFAULT_LOG_LEVEL]: " LOG_LEVEL
LOG_LEVEL=${LOG_LEVEL:-$DEFAULT_LOG_LEVEL}

# File Upload Configuration
read -p "Maximum file upload size in MB [50]: " MAX_FILE_SIZE
MAX_FILE_SIZE=${MAX_FILE_SIZE:-50}

# Session Configuration
SESSION_SECRET=$(generate_secret)

# Create backend .env file
cat > backend/.env <<EOF
# Server Configuration
PORT=$PORT
NODE_ENV=$NODE_ENV

# Database Configuration
MONGODB_URI=$MONGODB_URI

# Authentication
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=$JWT_EXPIRES_IN
SESSION_SECRET=$SESSION_SECRET

# CORS Configuration
CORS_ORIGIN=$CORS_ORIGIN

# Admin Account
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_EMAIL=$ADMIN_EMAIL

# File Upload
MAX_FILE_SIZE=${MAX_FILE_SIZE}MB
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=$LOG_LEVEL
LOG_DIR=./logs

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=CST Audit <noreply@cst-audit.com>
EOF

# Create frontend .env file
cat > .env <<EOF
# Frontend Configuration
VITE_API_URL=http://localhost:$PORT/api
VITE_APP_NAME=CST Audit System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
EOF

# Create .env.production for frontend
cat > .env.production <<EOF
# Production Frontend Configuration
VITE_API_URL=$CORS_ORIGIN/api
VITE_APP_NAME=CST Audit System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
EOF

# Create .env.example files
cat > backend/.env.example <<EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cst-audit

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=30d
SESSION_SECRET=your-session-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Admin Account
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@cst-audit.local

# File Upload
MAX_FILE_SIZE=50MB
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=info
LOG_DIR=./logs

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# EMAIL_FROM=CST Audit <noreply@cst-audit.com>
EOF

cat > .env.example <<EOF
# Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CST Audit System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
EOF

# Set appropriate permissions
chmod 600 backend/.env
chmod 644 backend/.env.example
chmod 644 .env
chmod 644 .env.example
chmod 644 .env.production

# Create necessary directories
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p logs

echo -e "\n${GREEN}Environment configuration completed!${NC}"
echo -e "${BLUE}Files created:${NC}"
echo "  - backend/.env (sensitive - keep secure)"
echo "  - backend/.env.example"
echo "  - .env"
echo "  - .env.example"
echo "  - .env.production"
echo ""
echo -e "${YELLOW}Important Security Notes:${NC}"
echo "1. Keep .env files out of version control"
echo "2. Change the JWT_SECRET in production"
echo "3. Use strong passwords for admin account"
echo "4. Configure SSL/TLS in production"
echo "5. Set up proper firewall rules"
echo ""
echo -e "${GREEN}Configuration Summary:${NC}"
echo "MongoDB URI: $MONGODB_URI"
echo "Backend Port: $PORT"
echo "Frontend Port: $FRONTEND_PORT"
echo "Node Environment: $NODE_ENV"
echo "Admin Username: admin"
echo "Admin Password: [hidden]"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Install dependencies: npm install && cd backend && npm install"
echo "2. Initialize database: cd backend && node scripts/init-db.js"
echo "3. Build frontend: npm run build"
echo "4. Start services: npm run start-all"