# MongoDB Backend Setup Guide

## Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** - Choose one:
   - **Local MongoDB**: Install from https://www.mongodb.com/try/download/community
   - **MongoDB Atlas** (Cloud): Free tier at https://www.mongodb.com/cloud/atlas

## Quick Start

### Step 1: Install MongoDB Locally (Optional)
If using local MongoDB:
- Download and install MongoDB Community Server
- Start MongoDB service (usually starts automatically)
- Default connection: `mongodb://localhost:27017`

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Configure Environment
The `.env` file is already created with local MongoDB settings.

For **MongoDB Atlas** (Cloud), update `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cst-audit
```

### Step 4: Seed Initial Data
```bash
cd backend
node seed.js
```

This creates the default user:
- Username: `helkhider`
- Password: `demo123`

### Step 5: Start Backend Server
```bash
cd backend
npm run dev
```

Server runs at: http://localhost:5000

### Step 6: Update Frontend (if needed)
Frontend is already configured to use the backend API.

### Step 7: Start Frontend
```bash
cd ..
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/users` - Get all users

### Documents
- `GET /api/documents` - Get all documents
- `GET /api/documents/control/:controlId` - Get by control
- `POST /api/documents` - Create document
- `POST /api/documents/:id/sign` - Sign document
- `POST /api/documents/:id/revoke` - Revoke signature
- `DELETE /api/documents/:id` - Delete document

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:controlId` - Get template
- `POST /api/templates` - Save template
- `DELETE /api/templates/:controlId` - Delete template

## Cloud Deployment

### MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Create database user
5. Whitelist IP: `0.0.0.0/0` (all IPs)
6. Get connection string
7. Update `backend/.env` with connection string

### Backend Deployment (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy!

## Troubleshooting

**MongoDB Connection Failed:**
- Check if MongoDB service is running
- Verify connection string in `.env`
- Check firewall settings

**Port Already in Use:**
- Change PORT in `backend/.env`
- Update frontend API_URL

**Seed Script Fails:**
- Make sure MongoDB is running
- Check connection string
- Delete existing user if re-seeding

## Data Persistence
✅ All data is now stored in MongoDB
✅ Survives page refreshes
✅ Ready for cloud deployment
