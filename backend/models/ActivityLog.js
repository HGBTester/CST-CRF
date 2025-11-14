import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'update',
      'delete',
      'sign',
      'revoke_signature',
      'upload',
      'download',
      'approve',
      'reject',
      'submit',
      'login',
      'logout'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: [
      'document',
      'template',
      'evidence_form',
      'evidence_checklist',
      'user',
      'system'
    ]
  },
  entityId: {
    type: String,
    required: true,
    index: true
  },
  entityName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
activityLogSchema.index({ timestamp: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1, timestamp: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
