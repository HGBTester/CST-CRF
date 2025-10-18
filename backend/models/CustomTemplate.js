import mongoose from 'mongoose';

const customTemplateSchema = new mongoose.Schema({
  controlId: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1
  },
  modifiedBy: {
    type: String
  }
}, {
  timestamps: true
});

const CustomTemplate = mongoose.model('CustomTemplate', customTemplateSchema);

export default CustomTemplate;
