# 🚀 Deploy to Cloud

## Quick Deploy (15 min)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Deploy CST Audit"
git remote add origin https://github.com/YOUR_USERNAME/cst-audit.git
git push -u origin main
```

### 2. Deploy on Render (Free)

**Backend:**
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://cstaudit:CSTaudit2025@cluster0.gfroid3.mongodb.net/cst-audit?retryWrites=true&w=majority
   JWT_SECRET=cst-audit-secret-key-2025-change-in-production
   NODE_ENV=production
   ```
5. Deploy → Copy backend URL

**Frontend:**
1. New Static Site
2. Settings:
   - Build: `npm install && npm run build`
   - Publish: `dist`
3. Environment Variables:
   ```
   VITE_API_URL=https://YOUR-BACKEND-URL/api
   ```
4. Deploy

### 3. Migrate Database
In Render backend shell:
```bash
node scripts/migrate-to-database.js
```

### 4. Done!
Login: `admin` / `admin123`

---

## Alternative: Railway

1. [railway.app](https://railway.app) → New Project
2. Deploy from GitHub
3. Add same environment variables
4. Generate domains

---

## Troubleshooting

- **CORS Error:** Check `VITE_API_URL` is correct
- **DB Error:** Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- **502 Error:** Wait 2 min for backend startup
