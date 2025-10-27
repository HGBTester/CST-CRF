import mongoose from 'mongoose';

const requirementItemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const evidenceRequirementSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    unique: true
  },
  requirements: [requirementItemSchema]
}, {
  timestamps: true
});

const EvidenceRequirement = mongoose.model('EvidenceRequirement', evidenceRequirementSchema);

export default EvidenceRequirement;
