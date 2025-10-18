import express from 'express';
import CustomTemplate from '../models/CustomTemplate.js';

const router = express.Router();

// Get all custom templates
router.get('/', async (req, res) => {
  try {
    const templates = await CustomTemplate.find();
    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get template by control ID
router.get('/:controlId', async (req, res) => {
  try {
    const template = await CustomTemplate.findOne({ controlId: req.params.controlId });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Check if template exists
router.get('/:controlId/exists', async (req, res) => {
  try {
    const template = await CustomTemplate.findOne({ controlId: req.params.controlId });
    res.json({ exists: !!template });
  } catch (error) {
    console.error('Check template error:', error);
    res.status(500).json({ error: 'Failed to check template' });
  }
});

// Save or update custom template
router.post('/', async (req, res) => {
  try {
    const { controlId, content, modifiedBy } = req.body;

    let template = await CustomTemplate.findOne({ controlId });

    if (template) {
      // Update existing template
      template.content = content;
      template.version += 1;
      template.modifiedBy = modifiedBy;
    } else {
      // Create new template
      template = new CustomTemplate({
        controlId,
        content,
        version: 1,
        modifiedBy
      });
    }

    await template.save();
    res.json(template);
  } catch (error) {
    console.error('Save template error:', error);
    res.status(500).json({ error: 'Failed to save template' });
  }
});

// Delete custom template
router.delete('/:controlId', async (req, res) => {
  try {
    const template = await CustomTemplate.findOneAndDelete({ controlId: req.params.controlId });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

export default router;
