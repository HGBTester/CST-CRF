import mongoose from 'mongoose';

// Evidence Form Templates - These are the operational documents
const evidenceFormSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    enum: [
      'change_request',
      'meeting_minutes',
      'training_record',
      'audit_report',
      'risk_assessment',
      'incident_report',
      'background_verification',
      'compliance_checklist',
      'vendor_assessment',
      'penetration_test_report',
      'access_review',
      'backup_verification',
      'custom'
    ]
  },
  formId: {
    type: String,
    required: true,
    unique: true
  },
  controlId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  
  // Form data (flexible structure for different form types)
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  
  // Digital signatures workflow
  signatures: {
    requester: {
      userId: String,
      userName: String,
      position: String,
      signedAt: Date,
      signature: String,
      comments: String
    },
    reviewer: {
      userId: String,
      userName: String,
      position: String,
      signedAt: Date,
      signature: String,
      comments: String
    },
    approver: {
      userId: String,
      userName: String,
      position: String,
      signedAt: Date,
      signature: String,
      comments: String
    }
  },
  
  // File attachments (photos, screenshots, documents)
  attachments: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    filePath: String,
    uploadedBy: String,
    uploadedAt: Date,
    description: String,
    category: {
      type: String,
      enum: ['photo', 'screenshot', 'document', 'log', 'report', 'other']
    }
  }],
  
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'pending_approval', 'approved', 'rejected'],
    default: 'draft'
  },
  
  createdBy: {
    userId: String,
    userName: String
  },
  
  // Audit trail
  history: [{
    action: String,
    performedBy: String,
    performedAt: Date,
    details: String
  }],
  
  // Link to related documents
  relatedForms: [String],
  relatedDocuments: [String],
  
  // Audit and compliance
  auditReady: {
    type: Boolean,
    default: false
  },
  isEvidence: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
evidenceFormSchema.index({ formType: 1, status: 1 });
evidenceFormSchema.index({ createdBy: 1 });
evidenceFormSchema.index({ 'signatures.requester.userId': 1 });

// Method to add signature
evidenceFormSchema.methods.addSignature = function(role, userInfo, comments) {
  this.signatures[role] = {
    userId: userInfo.id,
    userName: userInfo.fullName,
    position: userInfo.position,
    signedAt: new Date(),
    signature: userInfo.signatureImage,
    comments: comments || ''
  };
  
  // Update status based on signatures
  if (role === 'requester') {
    this.status = 'pending_review';
  } else if (role === 'reviewer') {
    this.status = 'pending_approval';
  } else if (role === 'approver') {
    this.status = 'approved';
    this.auditReady = true;
  }
  
  // Add to history
  this.history.push({
    action: `Signed by ${role}`,
    performedBy: userInfo.fullName,
    performedAt: new Date(),
    details: comments || `Document signed as ${role}`
  });
};

// Method to add attachment
evidenceFormSchema.methods.addAttachment = function(attachmentData) {
  this.attachments.push({
    ...attachmentData,
    uploadedAt: new Date()
  });
  
  this.history.push({
    action: 'Attachment added',
    performedBy: attachmentData.uploadedBy,
    performedAt: new Date(),
    details: `Added ${attachmentData.category}: ${attachmentData.fileName}`
  });
};

const EvidenceForm = mongoose.model('EvidenceForm', evidenceFormSchema);

export default EvidenceForm;
