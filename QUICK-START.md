# CST Audit - Quick Start Guide

## 🚀 Quick Commands

### Fix Port Conflicts
```bash
chmod +x fix-port-conflict.sh
./fix-port-conflict.sh
```

### Start Both Servers
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Start Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
chmod +x start-backend.sh
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

---

## 📋 Complete Setup (First Time)

### 1. Fix MongoDB (Ubuntu 24.04 only)
```bash
chmod +x fix-mongodb-ubuntu24.sh
sudo ./fix-mongodb-ubuntu24.sh
```

### 2. Quick Development Setup
```bash
chmod +x quick-dev-setup.sh
./quick-dev-setup.sh
```

### 3. Fix Port Conflicts (if needed)
```bash
./fix-port-conflict.sh
```

### 4. Start Application
```bash
./start-dev.sh
```

---

## 🔧 Manual Commands

### Kill Process on Port 5000
```bash
lsof -ti:5000 | xargs kill -9
```

### Kill Process on Port 5173
```bash
lsof -ti:5173 | xargs kill -9
```

### Start Backend Manually
```bash
cd backend
npm start
```

### Start Frontend Manually
```bash
npm run dev
```

### Check MongoDB Status
```bash
sudo systemctl status mongod
```

### Start MongoDB
```bash
sudo systemctl start mongod
```

---

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health

---

## 🔐 Default Login

- **Username**: `admin`
- **Password**: `admin123`

Additional test accounts:
- Auditor: `auditor` / `auditor123`
- Viewer: `viewer` / `viewer123`

---

## 🐛 Common Issues

### Issue: "Permission denied" when running vite
**Fix:**
```bash
./fix-npm-permissions.sh
```

### Issue: "Port 5000 already in use"
**Fix:**
```bash
./fix-port-conflict.sh
```

### Issue: "Cannot connect to MongoDB"
**Fix:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### Issue: MongoDB repo error (Ubuntu 24.04)
**Fix:**
```bash
sudo ./fix-mongodb-ubuntu24.sh
```

### Issue: Missing dependencies
**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

## 📁 Script Reference

### Deployment Scripts

| Script | Purpose |
|--------|---------|
| `deploy.sh` | Full production deployment on Linux |
| `fix-mongodb-ubuntu24.sh` | Fix MongoDB repo for Ubuntu 24.04 |
| `quick-dev-setup.sh` | Quick development environment setup |

### Development Scripts

| Script | Purpose |
|--------|---------|
| `start-dev.sh` | Start both frontend and backend |
| `start-backend.sh` | Start only backend server |
| `start-frontend.sh` | Start only frontend server |
| `fix-port-conflict.sh` | Kill processes on ports 5000/5173 |
| `fix-npm-permissions.sh` | Fix vite permission issues |

---

## 🏗️ Project Structure

```
CST-CRF/
├── backend/              # Express.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── scripts/         # Database initialization
│   └── server.js        # Main server file
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── services/        # API services
│   └── App.jsx          # Main app component
├── deploy/              # Deployment configs
│   ├── nginx-cst-audit.conf
│   ├── cst-audit-backend.service
│   └── cst-audit-frontend.service
├── dist/                # Production build output
└── uploads/             # Uploaded files
```

---

## 📝 Development Workflow

### Daily Development
```bash
# Terminal 1: Start backend
./start-backend.sh

# Terminal 2: Start frontend
./start-frontend.sh

# Open browser: http://localhost:5173
```

### Making Changes
- Frontend changes auto-reload (Vite HMR)
- Backend changes require restart (Ctrl+C and restart)

### Building for Production
```bash
# Build frontend
npm run build

# Serve production build
npx serve -s dist -l 3000
```

---

## 🚢 Production Deployment

### Full Automated Deployment
```bash
sudo ./deploy.sh
```

### Manual Production Setup
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🆘 Getting Help

### View Logs
```bash
# Backend logs (if running with start-dev.sh)
tail -f logs/backend.log

# Frontend output is in the terminal
```

### Check Service Status
```bash
# MongoDB
sudo systemctl status mongod

# If using systemd services
sudo systemctl status cst-audit-backend
sudo systemctl status cst-audit-frontend
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# Use CST database
use cst-audit

# View collections
show collections

# Count users
db.users.countDocuments()
```

---

## 📚 Documentation

- **Full Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Logging System**: [LOGGING_SYSTEM.md](LOGGING_SYSTEM.md)
- **GitHub Repository**: https://github.com/HGBTester/CST-CRF

---

## 🎯 Next Steps

1. ✅ Install dependencies and setup environment
2. ✅ Start development servers
3. 📝 Login and explore the application
4. 🔧 Start developing features
5. 🚀 Deploy to production when ready

---

**Need help?** Check the troubleshooting section or create an issue on GitHub.