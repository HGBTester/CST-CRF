import mongoose from 'mongoose';

const evidenceFileSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  filePath: String,
  fileSize: Number,
  uploadDate: Date,
  isPrimary: Boolean,
  contentSummary: String
}, { _id: false });

const evidenceSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    index: true
  },
  controlName: String,
  category: String,
  subcategory: String,
  files: [evidenceFileSchema],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'existing'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['imported', 'generated', 'uploaded'],
    default: 'generated'
  },
  importDate: Date,
  lastReviewDate: Date,
  reviewedBy: String,
  notes: String,
  complianceLevel: String, // CL 1, CL 2, CL 3
  auditReady: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for quick lookups
evidenceSchema.index({ controlId: 1, status: 1 });
evidenceSchema.index({ category: 1 });

const Evidence = mongoose.model('Evidence', evidenceSchema);

export default Evidence;
