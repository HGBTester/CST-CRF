import express from 'express';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

// Create a new activity log entry
router.post('/', async (req, res) => {
  try {
    const { userId, userName, action, entityType, entityId, entityName, description, metadata } = req.body;
    
    const log = new ActivityLog({
      userId,
      userName,
      action,
      entityType,
      entityId,
      entityName,
      description,
      metadata: metadata || {},
      ipAddress: req.ip || req.connection.remoteAddress
    });
    
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    console.error('Error creating activity log:', error);
    res.status(500).json({ error: 'Failed to create activity log' });
  }
});

// Get all activity logs (with pagination and filters)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      userId, 
      entityType, 
      entityId,
      action,
      startDate,
      endDate
    } = req.query;
    
    const query = {};
    
    if (userId) query.userId = userId;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await ActivityLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments(query);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Get recent activity (last 100 entries)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const logs = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Get activity logs for a specific entity
router.get('/entity/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    const logs = await ActivityLog.find({ entityType, entityId })
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching entity activity:', error);
    res.status(500).json({ error: 'Failed to fetch entity activity' });
  }
});

// Get activity logs for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;
    
    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// Get activity statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const stats = await ActivityLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            action: '$action',
            entityType: '$entityType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.action',
          total: { $sum: '$count' },
          byEntityType: {
            $push: {
              entityType: '$_id.entityType',
              count: '$count'
            }
          }
        }
      }
    ]);
    
    const totalLogs = await ActivityLog.countDocuments(query);
    const uniqueUsers = await ActivityLog.distinct('userId', query);
    
    res.json({
      totalLogs,
      uniqueUsers: uniqueUsers.length,
      actionStats: stats
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ error: 'Failed to fetch activity stats' });
  }
});

// Delete old logs (cleanup)
router.delete('/cleanup', async (req, res) => {
  try {
    const { daysOld = 90 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));
    
    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
    
    res.json({
      message: `Deleted ${result.deletedCount} logs older than ${daysOld} days`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    res.status(500).json({ error: 'Failed to cleanup logs' });
  }
});

export default router;
