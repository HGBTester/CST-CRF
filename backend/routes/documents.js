import express from 'express';
import Document from '../models/Document.js';

const router = express.Router();

// Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get documents by control ID
router.get('/control/:controlId', async (req, res) => {
  try {
    const documents = await Document.find({ controlId: req.params.controlId }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error('Get documents by control error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get single document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findOne({ docId: req.params.id });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Create new document
router.post('/', async (req, res) => {
  try {
    const { category, subcategory, item, createdBy } = req.body;

    // Generate document ID
    const count = await Document.countDocuments();
    const docId = `DOC-${String(count + 1).padStart(5, '0')}`;

    const document = new Document({
      docId,
      controlId: item.id,
      controlName: item.name,
      category,
      subcategory,
      level: item.level,
      createdBy,
      status: 'pending',
      signatures: {
        prepared: null,
        reviewed: null,
        approved: null
      },
      stamped: false,
      version: '1.0'
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Sign document
router.post('/:id/sign', async (req, res) => {
  try {
    const { role, userInfo } = req.body;
    const document = await Document.findOne({ docId: req.params.id });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const signatureData = {
      userId: userInfo.id,
      userName: userInfo.fullName,
      position: userInfo.position,
      signedAt: new Date(),
      signature: userInfo.signatureImage
    };

    // Update signature
    if (role === 'prepared') {
      document.signatures.prepared = signatureData;
    } else if (role === 'reviewed') {
      document.signatures.reviewed = signatureData;
    } else if (role === 'approved') {
      document.signatures.approved = signatureData;
    }

    // Update status
    const { prepared, reviewed, approved } = document.signatures;
    if (!prepared && !reviewed && !approved) {
      document.status = 'pending';
    } else if (prepared && reviewed && approved) {
      document.status = 'completed';
      document.stamped = true;
    } else {
      document.status = 'in_progress';
    }

    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Sign document error:', error);
    res.status(500).json({ error: 'Failed to sign document' });
  }
});

// Revoke signature
router.post('/:id/revoke', async (req, res) => {
  try {
    const { role } = req.body;
    const document = await Document.findOne({ docId: req.params.id });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Revoke signature and subsequent ones
    if (role === 'prepared') {
      document.signatures.prepared = null;
      document.signatures.reviewed = null;
      document.signatures.approved = null;
    } else if (role === 'reviewed') {
      document.signatures.reviewed = null;
      document.signatures.approved = null;
    } else if (role === 'approved') {
      document.signatures.approved = null;
    }

    // Update status
    const { prepared, reviewed, approved } = document.signatures;
    if (!prepared && !reviewed && !approved) {
      document.status = 'pending';
    } else if (prepared && reviewed && approved) {
      document.status = 'completed';
      document.stamped = true;
    } else {
      document.status = 'in_progress';
    }
    document.stamped = false;

    await document.save();
    res.json(document);
  } catch (error) {
    console.error('Revoke signature error:', error);
    res.status(500).json({ error: 'Failed to revoke signature' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({ docId: req.params.id });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
