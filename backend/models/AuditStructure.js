import mongoose from 'mongoose';

const controlSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true
  }
}, { _id: false });

const auditStructureSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  },
  subcategories: [{
    name: {
      type: String,
      required: true
    },
    controls: [controlSchema]
  }]
}, {
  timestamps: true
});

const AuditStructure = mongoose.model('AuditStructure', auditStructureSchema);

export default AuditStructure;
