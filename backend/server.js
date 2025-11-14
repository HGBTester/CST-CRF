import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import templateRoutes from './routes/templates.js';
import evidenceRoutes from './routes/evidence.js';
import evidenceFormsRoutes from './routes/evidenceForms.js';
import evidenceChecklistRoutes from './routes/evidenceChecklist.js';
import configRoutes from './routes/config.js';
import activityLogRoutes from './routes/activityLog.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://cst-audit-frontend.onrender.com',
        'https://cst-audit-frontend.up.railway.app'
      ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cst-audit';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Avoid logging the full URI if it contains credentials
    const safeURI = MONGODB_URI.includes('@') ? `mongodb+srv://${MONGODB_URI.split('@')[1]}` : MONGODB_URI;
    console.log(`Connecting to: ${safeURI}`);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (error.reason) {
      console.error('Reason:', error.reason.toString());
    }
    process.exit(1);
  }
};

connectDB();

mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
});

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/evidence-forms', evidenceFormsRoutes);
app.use('/api/evidence-checklist', evidenceChecklistRoutes);
app.use('/api/config', configRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CST Audit Backend is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
