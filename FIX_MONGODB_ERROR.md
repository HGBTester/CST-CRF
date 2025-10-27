# 🔧 Fix MongoDB Connection Error

## ❌ Current Error:
```
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```

**This means:** MongoDB database is not running/installed.

---

## ✅ QUICK FIX (5 minutes) - MongoDB Atlas (Cloud)

### **Step 1: Create Free MongoDB Atlas Account**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (it's FREE - no credit card required)
3. Choose **FREE M0 Shared** tier
4. Select **AWS** as provider
5. Pick closest region (e.g., Frankfurt for Middle East)
6. Cluster Name: `Cluster0` (default is fine)
7. Click **Create Deployment**

### **Step 2: Create Database User**

1. Click **Security → Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `cstaudit`
5. Password: `CSTaudit2025` (or choose your own)
6. User Privileges: **Atlas Admin**
7. Click **Add User**

### **Step 3: Allow Network Access**

1. Click **Security → Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

### **Step 4: Get Connection String**

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Drivers**
4. Select **Node.js** and version **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://cstaudit:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### **Step 5: Update .env File**

1. Open: `backend\.env`
2. Replace the `MONGODB_URI` line with your connection string
3. **Replace `<password>` with your actual password** (`CSTaudit2025`)
4. Add database name after `.net/`:

**Example:**
```env
MONGODB_URI=mongodb+srv://cstaudit:CSTaudit2025@cluster0.xxxxx.mongodb.net/cst-audit?retryWrites=true&w=majority
```

**Important:** Replace `xxxxx` with your actual cluster ID from Atlas!

### **Step 6: Restart Backend**

```powershell
# In backend terminal, press Ctrl+C to stop
# Then restart:
npm run dev
```

**You should see:**
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

---

## 🖥️ ALTERNATIVE: Install MongoDB Locally

If you prefer local installation:

### **Windows Installation:**

1. Download: https://www.mongodb.com/try/download/community
2. Choose **Windows** → **MSI Installer**
3. Run installer → Choose **Complete** installation
4. Check **Install MongoDB as a Service**
5. Check **Install MongoDB Compass** (GUI tool)

### **Start MongoDB Service:**

```powershell
# Start MongoDB service
net start MongoDB

# Check if running
mongo --version
```

### **Update .env File:**

```env
# Comment out Atlas URI (add # at start)
# MONGODB_URI=mongodb+srv://...

# Uncomment local URI (remove #)
MONGODB_URI=mongodb://localhost:27017/cst-audit
```

### **Restart Backend:**

```powershell
npm run dev
```

---

## 🔍 Verify Connection Working

### **Check Backend Terminal:**

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
Database: Connected
```

### **Test API:**

Open browser: http://localhost:5000/api/health

Should return:
```json
{
  "status": "OK",
  "message": "CST Audit Backend is running",
  "database": "Connected"
}
```

### **Test Frontend:**

1. Go to http://localhost:3000
2. Login (helkhider / demo123)
3. Click "Evidence Forms"
4. Create a form - should work now! ✅

---

## 💡 Recommended: MongoDB Atlas

**Why use Atlas (Cloud)?**
- ✅ No installation needed
- ✅ Free tier (512MB storage)
- ✅ Automatic backups
- ✅ Access from anywhere
- ✅ No maintenance
- ✅ Always running

**Why install locally?**
- ✅ Works offline
- ✅ Faster (no network latency)
- ✅ Full control
- ❌ Requires installation & maintenance
- ❌ Must manually start service

---

## 🎯 Quick Recap

### **For Atlas (Recommended):**
1. Create free account at mongodb.com/cloud/atlas
2. Create cluster (M0 Free)
3. Create database user
4. Allow network access
5. Copy connection string
6. Paste in `backend\.env` file
7. Restart backend → ✅ Connected!

### **For Local:**
1. Download & install MongoDB
2. Start MongoDB service
3. Update `backend\.env` to use `localhost:27017`
4. Restart backend → ✅ Connected!

---

**After MongoDB is connected, the backend will work and you can create evidence forms!** 🚀
