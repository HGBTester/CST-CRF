const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const ACTIVITY_LOG_URL = `${API_URL}/api/activity-logs`;

export const activityLogAPI = {
  // Create a new activity log
  async log(userId, userName, action, entityType, entityId, entityName, description, metadata = {}) {
    try {
      const response = await fetch(ACTIVITY_LOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userName,
          action,
          entityType,
          entityId,
          entityName,
          description,
          metadata
        })
      });
      
      if (!response.ok) throw new Error('Failed to create activity log');
      return await response.json();
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw - logging should not break the app
      return null;
    }
  },

  // Get all activity logs with filters
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${ACTIVITY_LOG_URL}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch activity logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  },

  // Get recent activity
  async getRecent(limit = 100) {
    try {
      const response = await fetch(`${ACTIVITY_LOG_URL}/recent?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch recent activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  },

  // Get activity for a specific entity
  async getEntityActivity(entityType, entityId) {
    try {
      const response = await fetch(`${ACTIVITY_LOG_URL}/entity/${entityType}/${entityId}`);
      if (!response.ok) throw new Error('Failed to fetch entity activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching entity activity:', error);
      throw error;
    }
  },

  // Get activity for a specific user
  async getUserActivity(userId, limit = 100) {
    try {
      const response = await fetch(`${ACTIVITY_LOG_URL}/user/${userId}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch user activity');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  },

  // Get activity statistics
  async getStats(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`${ACTIVITY_LOG_URL}/stats?${params}`);
      if (!response.ok) throw new Error('Failed to fetch activity stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      throw error;
    }
  }
};

// Helper function to create log entries easily
export const logActivity = (currentUser, action, entityType, entityId, entityName, description, metadata = {}) => {
  if (!currentUser) return;
  
  return activityLogAPI.log(
    currentUser.id,
    currentUser.fullName,
    action,
    entityType,
    entityId,
    entityName,
    description,
    metadata
  );
};
