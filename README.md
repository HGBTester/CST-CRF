# CST Audit System

Enterprise documentation and compliance management for CST L3 Certification.

## Quick Start

### Run on Linux
```bash
# One command does everything: setup, install, and run
chmod +x setup-and-run.sh
./setup-and-run.sh
```

This script will:
- ✅ Install Node.js and MongoDB (if needed)
- ✅ Fix port conflicts automatically
- ✅ Install all dependencies
- ✅ Initialize database
- ✅ Start both frontend and backend servers

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Login: `admin` / `admin123`

### Run on Windows
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start (opens 2 CMD windows)
start-all.bat
```

### Production Deployment
```bash
# Full automated deployment on Linux servers
sudo ./deploy.sh
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production deployment guide.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas

## Features
- Document management with templates
- Evidence tracking (20 form types)
- Audit structure (6 categories, 200+ controls)
- User roles: Admin, Auditor, Viewer
- File uploads & workflow management
