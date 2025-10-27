import mongoose from 'mongoose';

const evidenceChecklistItemSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    index: true
  },
  requirementId: {
    type: Number,
    required: true
  },
  requirementName: {
    type: String,
    required: true
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  evidenceType: {
    type: String,
    enum: ['file', 'form'],
    default: null
  },
  file: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    path: String,
    uploadedAt: Date,
    uploadedBy: {
      userId: String,
      userName: String
    }
  },
  form: {
    formId: String,  // Reference to EvidenceForm._id
    formType: String,
    formTitle: String,
    linkedAt: Date,
    linkedBy: {
      userId: String,
      userName: String
    }
  },
  notes: String,
  completedAt: Date,
  completedBy: {
    userId: String,
    userName: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
evidenceChecklistItemSchema.index({ controlId: 1, requirementId: 1 }, { unique: true });

export default mongoose.model('EvidenceChecklistItem', evidenceChecklistItemSchema);
