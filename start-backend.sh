#!/bin/bash

# Start only the backend server
# Usage: ./start-backend.sh

cd "$(dirname "$0")"

echo "Starting CST Audit Backend Server..."

# Kill any existing process on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Check MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "Starting MongoDB..."
    sudo systemctl start mongod 2>/dev/null || true
    sleep 2
fi

# Start backend
cd backend
echo "Backend running on http://localhost:5000"
echo "Press Ctrl+C to stop"
npm start