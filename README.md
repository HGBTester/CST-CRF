# CST Audit System

Enterprise documentation and compliance management for CST L3 Certification.

## Quick Start

### Run Locally
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Start (opens 2 CMD windows)
start-all.bat
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Login: `admin` / `admin123`

### Deploy to Cloud
See **DEPLOY.md** for 15-minute deployment guide.

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
