import express from 'express';
import EvidenceForm from '../models/EvidenceForm.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/evidence/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|docx|xlsx|doc|xls/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and Office documents allowed.'));
    }
  }
});

// Get all evidence forms
router.get('/', async (req, res) => {
  try {
    const { formType, status, controlId } = req.query;
    const filter = {};
    
    if (formType) filter.formType = formType;
    if (status) filter.status = status;
    if (controlId) filter.controlId = controlId;
    
    const forms = await EvidenceForm.find(filter).sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Get evidence forms error:', error);
    res.status(500).json({ error: 'Failed to fetch evidence forms' });
  }
});

// Get single evidence form
router.get('/:id', async (req, res) => {
  try {
    const form = await EvidenceForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Evidence form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Get evidence form error:', error);
    res.status(500).json({ error: 'Failed to fetch evidence form' });
  }
});

// Create new evidence form
router.post('/', async (req, res) => {
  try {
    const formCount = await EvidenceForm.countDocuments({ formType: req.body.formType });
    const formId = `${req.body.formType.toUpperCase()}-${String(formCount + 1).padStart(5, '0')}`;
    
    const form = new EvidenceForm({
      ...req.body,
      formId,
      history: [{
        action: 'Form created',
        performedBy: req.body.createdBy.userName,
        performedAt: new Date(),
        details: 'Evidence form created'
      }]
    });
    
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error('Create evidence form error:', error);
    res.status(500).json({ error: 'Failed to create evidence form' });
  }
});

// Update evidence form
router.put('/:id', async (req, res) => {
  try {
    const form = await EvidenceForm.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Evidence form not found' });
    }
    
    // Update form data
    Object.assign(form, req.body);
    
    form.history.push({
      action: 'Form updated',
      performedBy: req.body.updatedBy || 'System',
      performedAt: new Date(),
      details: 'Evidence form data updated'
    });
    
    await form.save();
    res.json(form);
  } catch (error) {
    console.error('Update evidence form error:', error);
    res.status(500).json({ error: 'Failed to update evidence form' });
  }
});

// Sign evidence form
router.post('/:id/sign', async (req, res) => {
  try {
    const { role, userInfo, comments } = req.body;
    const form = await EvidenceForm.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: 'Evidence form not found' });
    }
    
    form.addSignature(role, userInfo, comments);
    await form.save();
    
    res.json(form);
  } catch (error) {
    console.error('Sign evidence form error:', error);
    res.status(500).json({ error: 'Failed to sign evidence form' });
  }
});

// Upload attachment to evidence form
router.post('/:id/attachments', upload.single('file'), async (req, res) => {
  try {
    const form = await EvidenceForm.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: 'Evidence form not found' });
    }
    
    const attachmentData = {
      fileName: req.file.originalname,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      fileSize: req.file.size,
      filePath: req.file.path,
      uploadedBy: req.body.uploadedBy,
      description: req.body.description,
      category: req.body.category || 'other'
    };
    
    form.addAttachment(attachmentData);
    await form.save();
    
    res.json({
      message: 'Attachment uploaded successfully',
      attachment: attachmentData,
      form: form
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
});

// Delete attachment from evidence form
router.delete('/:id/attachments/:attachmentId', async (req, res) => {
  try {
    const form = await EvidenceForm.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ error: 'Evidence form not found' });
    }
    
    form.attachments = form.attachments.filter(
      att => att._id.toString() !== req.params.attachmentId
    );
    
    form.history.push({
      action: 'Attachment removed',
      performedBy: req.body.performedBy || 'System',
      performedAt: new Date(),
      details: 'Attachment deleted from form'
    });
    
    await form.save();
    res.json({ message: 'Attachment deleted successfully', form });
  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

// Get forms by control ID
router.get('/control/:controlId', async (req, res) => {
  try {
    const forms = await EvidenceForm.find({ controlId: req.params.controlId })
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Get forms by control error:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get evidence statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await EvidenceForm.aggregate([
      {
        $group: {
          _id: '$formType',
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [
              { $in: ['$status', ['pending_review', 'pending_approval', 'draft']] }, 
              1, 0
            ] }
          }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
