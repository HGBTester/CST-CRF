import mongoose from 'mongoose';

const signatureSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  position: String,
  signedAt: Date,
  signature: String
}, { _id: false });

const documentSchema = new mongoose.Schema({
  docId: {
    type: String,
    required: true,
    unique: true
  },
  controlId: {
    type: String,
    required: true
  },
  controlName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  signatures: {
    prepared: signatureSchema,
    reviewed: signatureSchema,
    approved: signatureSchema
  },
  stamped: {
    type: Boolean,
    default: false
  },
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
