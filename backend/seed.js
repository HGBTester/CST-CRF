import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cst-audit';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingUser = await User.findOne({ username: 'helkhider' });
    if (existingUser) {
      console.log('ℹ️  User already exists');
      process.exit(0);
    }

    const defaultUser = new User({
      username: 'helkhider',
      password: 'demo123',
      fullName: 'Haitham Elkhider',
      position: 'Chief Executive Officer',
      role: 'CEO',
      group: 'Management',
      permissions: ['generate_documents', 'approve_documents', 'view_all', 'sign_as_prepared', 'sign_as_reviewed', 'sign_as_approved'],
      signatureImage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80'%3E%3Ctext x='10' y='50' font-family='cursive' font-size='32' fill='%23000080'%3EHaitham Elkhider%3C/text%3E%3C/svg%3E",
      email: 'h.elkhider@l3company.sa'
    });

    await defaultUser.save();
    console.log('✅ User created: helkhider / demo123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
