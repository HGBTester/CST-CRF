import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import EvidenceChecklistItem from '../models/EvidenceChecklistItem.js';
import EvidenceForm from '../models/EvidenceForm.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/checklist-evidence/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Get checklist status for a control
router.get('/control/:controlId', async (req, res) => {
  try {
    const { controlId } = req.params;
    const items = await EvidenceChecklistItem.find({ controlId }).sort({ requirementId: 1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching checklist:', error);
    res.status(500).json({ error: 'Failed to fetch checklist' });
  }
});

// Initialize checklist items for a control (if not exist)
router.post('/initialize', async (req, res) => {
  try {
    const { controlId, requirements } = req.body;

    const items = [];
    for (const req of requirements) {
      // Use findOneAndUpdate with upsert to avoid duplicate key errors
      const item = await EvidenceChecklistItem.findOneAndUpdate(
        {
          controlId,
          requirementId: req.id
        },
        {
          $setOnInsert: {
            controlId,
            requirementId: req.id,
            requirementName: req.name,
            isRequired: req.required,
            isComplete: false
          }
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
      items.push(item);
    }

    res.json(items);
  } catch (error) {
    console.error('Error initializing checklist:', error);
    res.status(500).json({ error: 'Failed to initialize checklist' });
  }
});

// Upload evidence for a checklist item
router.post('/upload/:controlId/:requirementId', upload.single('file'), async (req, res) => {
  try {
    const { controlId, requirementId } = req.params;
    const { notes, userId, userName } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Find the checklist item
    let item = await EvidenceChecklistItem.findOne({
      controlId,
      requirementId: parseInt(requirementId)
    });

    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Delete old file if exists
    if (item.file && item.file.path) {
      try {
        fs.unlinkSync(item.file.path);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }

    // Update with new file
    item.evidenceType = 'file';
    item.file = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedAt: new Date(),
      uploadedBy: {
        userId,
        userName
      }
    };
    item.form = undefined; // Clear form if switching to file
    item.notes = notes || '';
    item.isComplete = true;
    item.completedAt = new Date();
    item.completedBy = {
      userId,
      userName
    };

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error uploading evidence:', error);
    res.status(500).json({ error: 'Failed to upload evidence' });
  }
});

// Download evidence file
router.get('/download/:id', async (req, res) => {
  try {
    const item = await EvidenceChecklistItem.findById(req.params.id);
    if (!item || !item.file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.resolve(item.file.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    res.download(filePath, item.file.originalName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Delete evidence for a checklist item
router.delete('/:id', async (req, res) => {
  try {
    const item = await EvidenceChecklistItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Delete file from filesystem
    if (item.file && item.file.path) {
      try {
        fs.unlinkSync(item.file.path);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Reset item
    item.evidenceType = null;
    item.file = undefined;
    item.form = undefined;
    item.notes = '';
    item.isComplete = false;
    item.completedAt = undefined;
    item.completedBy = undefined;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error deleting evidence:', error);
    res.status(500).json({ error: 'Failed to delete evidence' });
  }
});

// Get progress summary for a control
router.get('/progress/:controlId', async (req, res) => {
  try {
    const { controlId } = req.params;
    const items = await EvidenceChecklistItem.find({ controlId });
    
    const total = items.length;
    const completed = items.filter(item => item.isComplete).length;
    const required = items.filter(item => item.isRequired).length;
    const requiredCompleted = items.filter(item => item.isRequired && item.isComplete).length;

    res.json({
      total,
      completed,
      required,
      requiredCompleted,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      requiredPercentage: required > 0 ? Math.round((requiredCompleted / required) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Link an existing form to a checklist item
router.post('/link-form/:controlId/:requirementId', async (req, res) => {
  try {
    const { controlId, requirementId } = req.params;
    const { formId, userId, userName, notes } = req.body;

    // Find the form
    const form = await EvidenceForm.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Find the checklist item
    let item = await EvidenceChecklistItem.findOne({
      controlId,
      requirementId: parseInt(requirementId)
    });

    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Delete old file if switching from file to form
    if (item.file && item.file.path) {
      try {
        fs.unlinkSync(item.file.path);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }

    // Link the form
    item.evidenceType = 'form';
    item.file = undefined; // Clear file if switching to form
    item.form = {
      formId: form._id.toString(),
      formType: form.formType,
      formTitle: form.title,
      linkedAt: new Date(),
      linkedBy: {
        userId,
        userName
      }
    };
    item.notes = notes || '';
    item.isComplete = true;
    item.completedAt = new Date();
    item.completedBy = {
      userId,
      userName
    };

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error linking form:', error);
    res.status(500).json({ error: 'Failed to link form' });
  }
});

// Create a new form and link it to a checklist item
router.post('/create-form/:controlId/:requirementId', async (req, res) => {
  try {
    const { controlId, requirementId } = req.params;
    const { formType, formData, userId, userName } = req.body;

    // Find the checklist item
    let item = await EvidenceChecklistItem.findOne({
      controlId,
      requirementId: parseInt(requirementId)
    });

    if (!item) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Create the form
    const formCount = await EvidenceForm.countDocuments({ formType });
    const formId = `${formType.toUpperCase()}-${String(formCount + 1).padStart(5, '0')}`;
    
    const form = new EvidenceForm({
      ...formData,
      formType,
      formId,
      controlId,
      createdBy: {
        userId,
        userName
      },
      history: [{
        action: 'Form created from checklist',
        performedBy: userName,
        performedAt: new Date(),
        details: `Created for requirement ${requirementId}: ${item.requirementName}`
      }]
    });
    
    await form.save();

    // Delete old file if switching from file to form
    if (item.file && item.file.path) {
      try {
        fs.unlinkSync(item.file.path);
      } catch (err) {
        console.error('Error deleting old file:', err);
      }
    }

    // Link the new form
    item.evidenceType = 'form';
    item.file = undefined;
    item.form = {
      formId: form._id.toString(),
      formType: form.formType,
      formTitle: form.title,
      linkedAt: new Date(),
      linkedBy: {
        userId,
        userName
      }
    };
    item.isComplete = true;
    item.completedAt = new Date();
    item.completedBy = {
      userId,
      userName
    };

    await item.save();
    res.json({ item, form });
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Get available forms for linking (by control)
router.get('/available-forms/:controlId', async (req, res) => {
  try {
    const { controlId } = req.params;
    const forms = await EvidenceForm.find({ 
      controlId,
      status: { $in: ['approved', 'pending_approval', 'pending_review'] }
    }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching available forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

export default router;
