import { useCallback } from 'react';
import { logActivity } from '../services/activityLogAPI';

export const useActivityLog = (currentUser) => {
  const log = useCallback((action, entityType, entityId, entityName, description, metadata = {}) => {
    if (!currentUser) {
      console.warn('Cannot log activity: No current user');
      return;
    }
    
    return logActivity(
      currentUser,
      action,
      entityType,
      entityId,
      entityName,
      description,
      metadata
    );
  }, [currentUser]);

  // Convenience methods for common actions
  const logCreate = useCallback((entityType, entityId, entityName, metadata = {}) => {
    return log('create', entityType, entityId, entityName, `Created ${entityType}: ${entityName}`, metadata);
  }, [log]);

  const logUpdate = useCallback((entityType, entityId, entityName, changes = {}, metadata = {}) => {
    const description = `Updated ${entityType}: ${entityName}`;
    return log('update', entityType, entityId, entityName, description, { ...metadata, changes });
  }, [log]);

  const logDelete = useCallback((entityType, entityId, entityName, metadata = {}) => {
    return log('delete', entityType, entityId, entityName, `Deleted ${entityType}: ${entityName}`, metadata);
  }, [log]);

  const logSign = useCallback((entityType, entityId, entityName, role, metadata = {}) => {
    return log('sign', entityType, entityId, entityName, `Signed ${entityType} as ${role}: ${entityName}`, { ...metadata, role });
  }, [log]);

  const logRevokeSignature = useCallback((entityType, entityId, entityName, role, metadata = {}) => {
    return log('revoke_signature', entityType, entityId, entityName, `Revoked ${role} signature from ${entityType}: ${entityName}`, { ...metadata, role });
  }, [log]);

  const logUpload = useCallback((entityType, entityId, entityName, fileName, metadata = {}) => {
    return log('upload', entityType, entityId, entityName, `Uploaded file to ${entityType}: ${fileName}`, { ...metadata, fileName });
  }, [log]);

  const logDownload = useCallback((entityType, entityId, entityName, fileName, metadata = {}) => {
    return log('download', entityType, entityId, entityName, `Downloaded file from ${entityType}: ${fileName}`, { ...metadata, fileName });
  }, [log]);

  const logApprove = useCallback((entityType, entityId, entityName, metadata = {}) => {
    return log('approve', entityType, entityId, entityName, `Approved ${entityType}: ${entityName}`, metadata);
  }, [log]);

  const logReject = useCallback((entityType, entityId, entityName, reason = '', metadata = {}) => {
    return log('reject', entityType, entityId, entityName, `Rejected ${entityType}: ${entityName}${reason ? ` - ${reason}` : ''}`, { ...metadata, reason });
  }, [log]);

  const logSubmit = useCallback((entityType, entityId, entityName, metadata = {}) => {
    return log('submit', entityType, entityId, entityName, `Submitted ${entityType}: ${entityName}`, metadata);
  }, [log]);

  return {
    log,
    logCreate,
    logUpdate,
    logDelete,
    logSign,
    logRevokeSignature,
    logUpload,
    logDownload,
    logApprove,
    logReject,
    logSubmit
  };
};
