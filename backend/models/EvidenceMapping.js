import mongoose from 'mongoose';

const evidenceMappingSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    unique: true
  },
  applicableCategories: [{
    type: String
  }]
}, {
  timestamps: true
});

const staticEvidenceControlSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const templateOnlyControlSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    unique: true
  },
  reason: {
    type: String,
    default: 'Template-only control (policy/strategy/requirements document)'
  }
}, {
  timestamps: true
});

export const EvidenceMapping = mongoose.model('EvidenceMapping', evidenceMappingSchema);
export const StaticEvidenceControl = mongoose.model('StaticEvidenceControl', staticEvidenceControlSchema);
export const TemplateOnlyControl = mongoose.model('TemplateOnlyControl', templateOnlyControlSchema);
