import mongoose from 'mongoose';

const templateContentSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    unique: true
  },
  controlName: {
    type: String,
    required: true
  },
  templateType: {
    type: String,
    enum: ['strategy', 'policy', 'procedure', 'action_plan', 'requirements', 'process'],
    required: true
  },
  htmlContent: {
    type: String,
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TemplateContent = mongoose.model('TemplateContent', templateContentSchema);

export default TemplateContent;
