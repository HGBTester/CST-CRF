#!/bin/bash

# Start only the frontend server
# Usage: ./start-frontend.sh

cd "$(dirname "$0")"

echo "Starting CST Audit Frontend Server..."

# Kill any existing process on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start frontend
echo "Frontend running on http://localhost:5173"
echo "Make sure backend is running on http://localhost:5000"
echo "Press Ctrl+C to stop"
npm run dev