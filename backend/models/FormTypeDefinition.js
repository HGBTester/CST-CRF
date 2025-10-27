import mongoose from 'mongoose';

const formTypeDefinitionSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const FormTypeDefinition = mongoose.model('FormTypeDefinition', formTypeDefinitionSchema);

export default FormTypeDefinition;
