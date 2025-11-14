import React, { useState, useEffect } from 'react';
import { Activity, User, FileText, Upload, Download, CheckCircle, XCircle, Edit, Trash2, Clock, Filter, RefreshCw } from 'lucide-react';
import { activityLogAPI } from '../services/activityLogAPI';

function ActivityLogViewer({ darkMode, entityType = null, entityId = null, userId = null, limit = 50 }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';
  const hoverBg = darkMode ? '#2a2a2a' : '#f8fafc';

  useEffect(() => {
    loadLogs();
    
    if (autoRefresh) {
      const interval = setInterval(loadLogs, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [entityType, entityId, userId, filter, autoRefresh]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      let data;
      
      if (entityType && entityId) {
        data = await activityLogAPI.getEntityActivity(entityType, entityId);
      } else if (userId) {
        data = await activityLogAPI.getUserActivity(userId, limit);
      } else {
        data = await activityLogAPI.getRecent(limit);
      }
      
      // Filter logs if needed
      let filteredLogs = Array.isArray(data) ? data : data.logs || [];
      
      if (filter !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.action === filter);
      }
      
      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create': return <FileText size={16} style={{color: '#10b981'}} />;
      case 'update': return <Edit size={16} style={{color: '#3b82f6'}} />;
      case 'delete': return <Trash2 size={16} style={{color: '#ef4444'}} />;
      case 'sign': return <CheckCircle size={16} style={{color: '#10b981'}} />;
      case 'revoke_signature': return <XCircle size={16} style={{color: '#ef4444'}} />;
      case 'upload': return <Upload size={16} style={{color: '#8b5cf6'}} />;
      case 'download': return <Download size={16} style={{color: '#06b6d4'}} />;
      case 'approve': return <CheckCircle size={16} style={{color: '#10b981'}} />;
      case 'reject': return <XCircle size={16} style={{color: '#ef4444'}} />;
      case 'submit': return <FileText size={16} style={{color: '#f59e0b'}} />;
      case 'login': return <User size={16} style={{color: '#3b82f6'}} />;
      case 'logout': return <User size={16} style={{color: '#6b7280'}} />;
      default: return <Activity size={16} style={{color: '#6b7280'}} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create': return darkMode ? '#10b981' : '#059669';
      case 'update': return darkMode ? '#3b82f6' : '#2563eb';
      case 'delete': return darkMode ? '#ef4444' : '#dc2626';
      case 'sign': case 'approve': return darkMode ? '#10b981' : '#059669';
      case 'revoke_signature': case 'reject': return darkMode ? '#ef4444' : '#dc2626';
      case 'upload': return darkMode ? '#8b5cf6' : '#7c3aed';
      case 'download': return darkMode ? '#06b6d4' : '#0891b2';
      case 'submit': return darkMode ? '#f59e0b' : '#d97706';
      default: return darkMode ? '#9ca3af' : '#6b7280';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8" style={{color: textColor}}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: darkMode ? '#3b82f6' : '#2563eb'}}></div>
        <span className="ml-3">Loading activity logs...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{backgroundColor: bgColor}}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{borderColor}}>
        <div className="flex items-center gap-2">
          <Activity size={20} style={{color: darkMode ? '#3b82f6' : '#2563eb'}} />
          <h3 className="font-semibold" style={{color: textColor}}>Activity Log</h3>
          <span className="text-sm px-2 py-0.5 rounded" style={{
            backgroundColor: darkMode ? '#374151' : '#f3f4f6',
            color: darkMode ? '#9ca3af' : '#6b7280'
          }}>
            {logs.length} entries
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 rounded text-sm border"
            style={{
              backgroundColor: darkMode ? '#2a2a2a' : '#ffffff',
              color: textColor,
              borderColor
            }}
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="sign">Sign</option>
            <option value="upload">Upload</option>
            <option value="download">Download</option>
            <option value="approve">Approve</option>
            <option value="submit">Submit</option>
          </select>
          
          {/* Auto Refresh */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="px-3 py-1 rounded text-sm flex items-center gap-1"
            style={{
              backgroundColor: autoRefresh ? (darkMode ? '#1e40af' : '#3b82f6') : (darkMode ? '#374151' : '#f3f4f6'),
              color: autoRefresh ? '#ffffff' : textColor
            }}
          >
            <RefreshCw size={14} className={autoRefresh ? 'animate-spin' : ''} />
            Auto
          </button>
          
          {/* Manual Refresh */}
          <button
            onClick={loadLogs}
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              color: textColor
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
            <Activity size={48} className="mb-4" style={{opacity: 0.3}} />
            <p className="text-lg font-medium">No activity logs</p>
            <p className="text-sm mt-1">Activity will appear here as actions are performed</p>
          </div>
        ) : (
          <div className="divide-y" style={{borderColor}}>
            {logs.map((log, index) => (
              <div
                key={log._id || index}
                className="p-4 hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  ':hover': { backgroundColor: hoverBg }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium" style={{color: textColor}}>
                        {log.userName}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: getActionColor(log.action) + '20',
                          color: getActionColor(log.action)
                        }}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded" style={{
                        backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }}>
                        {log.entityType}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-1" style={{color: textColor}}>
                      {log.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                      <Clock size={12} />
                      <span>{formatTimestamp(log.timestamp)}</span>
                      {log.entityName && (
                        <>
                          <span>•</span>
                          <span className="truncate">{log.entityName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityLogViewer;
