# 🚀 How to Start the CST Audit System

## ⚠️ IMPORTANT: You Must Start BOTH Backend AND Frontend!

The error **"failed to fetch"** means the backend server is NOT running.

---

## 📋 Quick Start Guide

### **Step 1: Start Backend Server (Port 5000)**

Open **Terminal 1** (PowerShell):

```powershell
# Navigate to backend folder
cd "c:\Users\hgb_m\Downloads\CODING\CST Audit\backend"

# Install dependencies (first time only)
npm install

# Create uploads folder (first time only)
mkdir uploads
mkdir uploads\evidence

# Start backend server
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
🚀 CST Audit Backend running on port 5000
```

**Leave this terminal open!** The backend must keep running.

---

### **Step 2: Start Frontend (Port 3000)**

Open **Terminal 2** (NEW PowerShell window):

```powershell
# Navigate to project root
cd "c:\Users\hgb_m\Downloads\CODING\CST Audit"

# Start frontend
npm run dev
```

**You should see:**
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Browser should open automatically to http://localhost:3000

---

### **Step 3: Verify Both Are Running**

Check that you have **2 terminal windows open**:

1. **Terminal 1**: Backend running on port 5000
2. **Terminal 2**: Frontend running on port 3000

---

## ❌ Common Errors and Fixes

### Error: "failed to fetch"
**Cause:** Backend is not running
**Fix:** Start the backend server (Step 1 above)

### Error: "EADDRINUSE: Port 5000 already in use"
**Cause:** Backend already running or port blocked
**Fix:**
```powershell
# Kill process on port 5000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Then restart backend
npm run dev
```

### Error: "MongoDB connection failed"
**Cause:** MongoDB not running
**Fix:**
```powershell
# Start MongoDB (if installed locally)
mongod

# OR use MongoDB Atlas (cloud) - update .env file
```

### Error: "Cannot find module 'multer'"
**Cause:** Dependencies not installed
**Fix:**
```powershell
cd backend
npm install
```

---

## 🔍 Verify System is Working

### Check Backend API:
Open browser to: http://localhost:5000/api/health

**Should return:**
```json
{
  "status": "OK",
  "message": "CST Audit Backend is running",
  "database": "Connected"
}
```

### Check Frontend:
Open browser to: http://localhost:3000

**Should show login page**

---

## 🎯 Complete Startup Checklist

- [ ] Backend terminal open and running (port 5000)
- [ ] Frontend terminal open and running (port 3000)
- [ ] MongoDB connected (check backend terminal)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health
- [ ] Login works (helkhider / demo123)
- [ ] Can click "Evidence Forms" button
- [ ] Can create a form without "failed to fetch" error

---

## 📝 Quick Test After Starting

1. Go to http://localhost:3000
2. Login (helkhider / demo123)
3. Click **"Evidence Forms"**
4. Click **🔄 Change Request**
5. Fill form and submit

**If you get "failed to fetch"** → Backend is not running! Go back to Step 1.

---

## 💡 Pro Tips

### Keep Both Terminals Visible
Use split screen or two monitor windows so you can see both terminals running.

### Check Terminal Output
- Backend terminal shows API requests
- Frontend terminal shows compilation errors
- Watch for errors in either terminal

### Auto-Restart on Code Changes
- Backend: `npm run dev` (uses nodemon - auto-restarts)
- Frontend: `npm run dev` (Vite - auto-reloads)

---

## 🔄 Restart Everything

If things get stuck:

**Terminal 1 (Backend):**
```powershell
# Press Ctrl+C to stop
# Then restart
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
# Press Ctrl+C to stop
# Then restart
npm run dev
```

---

## ✅ Success Indicators

### Backend Running Successfully:
```
✅ Connected to MongoDB
🚀 CST Audit Backend running on port 5000
```

### Frontend Running Successfully:
```
➜  Local:   http://localhost:3000/
✓ ready in 1234 ms
```

### Form Submission Working:
```
Backend Terminal Shows:
POST /api/evidence-forms 201
POST /api/evidence-forms/:id/attachments 200
POST /api/evidence-forms/:id/sign 200
```

---

**Remember: BOTH servers must be running for the system to work!** 🚀
