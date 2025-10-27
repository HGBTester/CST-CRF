import express from 'express';
import Evidence from '../models/Evidence.js';

const router = express.Router();

// Get all evidence
router.get('/', async (req, res) => {
  try {
    const { category, status, controlId } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (controlId) filter.controlId = controlId;
    
    const evidence = await Evidence.find(filter).sort({ controlId: 1 });
    res.json(evidence);
  } catch (error) {
    console.error('Get evidence error:', error);
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

// Get evidence by control ID
router.get('/control/:controlId', async (req, res) => {
  try {
    const evidence = await Evidence.find({ controlId: req.params.controlId });
    res.json(evidence);
  } catch (error) {
    console.error('Get evidence by control error:', error);
    res.status(500).json({ error: 'Failed to fetch evidence' });
  }
});

// Create/Upload new evidence
router.post('/', async (req, res) => {
  try {
    const evidenceData = req.body;
    const evidence = new Evidence(evidenceData);
    await evidence.save();
    res.status(201).json(evidence);
  } catch (error) {
    console.error('Create evidence error:', error);
    res.status(500).json({ error: 'Failed to create evidence' });
  }
});

// Update evidence status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, reviewedBy, notes } = req.body;
    const evidence = await Evidence.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        reviewedBy, 
        notes,
        lastReviewDate: new Date()
      },
      { new: true }
    );
    res.json(evidence);
  } catch (error) {
    console.error('Update evidence status error:', error);
    res.status(500).json({ error: 'Failed to update evidence status' });
  }
});

// Bulk import evidence (for importing old evidence)
router.post('/bulk-import', async (req, res) => {
  try {
    const { evidenceList } = req.body;
    const results = await Evidence.insertMany(evidenceList);
    res.json({ 
      message: 'Evidence imported successfully',
      count: results.length,
      evidence: results
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import evidence' });
  }
});

// Get compliance statistics
router.get('/stats/compliance', async (req, res) => {
  try {
    const stats = await Evidence.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          existing: {
            $sum: { $cond: [{ $eq: ['$source', 'imported'] }, 1, 0] }
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
