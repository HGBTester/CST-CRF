# 📊 Universal Logging System

## Overview
A comprehensive activity logging system that tracks all user actions across the CST Audit application.

## Features
- ✅ **Real-time logging** of all user actions
- ✅ **Universal tracking** across all modules
- ✅ **Auto-refresh** option (updates every 5 seconds)
- ✅ **Filtering** by action type
- ✅ **User-specific** activity views
- ✅ **Entity-specific** activity tracking
- ✅ **Timestamp** with relative time display
- ✅ **Metadata** support for detailed context

## Logged Actions
- **create** - Document/form/template creation
- **update** - Modifications to existing items
- **delete** - Deletion of items
- **sign** - Document signatures
- **revoke_signature** - Signature revocations
- **upload** - File uploads
- **download** - File downloads
- **approve** - Approvals
- **reject** - Rejections
- **submit** - Form submissions
- **login/logout** - Authentication events

## Usage

### 1. Access Activity Log
Click the **"Activity Log"** button in the top header (next to Evidence Forms)

### 2. View Options
- **All Activity** - System-wide activity log
- **User Activity** - Filter by specific user
- **Entity Activity** - Filter by specific document/form
- **Action Filter** - Filter by action type (create, update, delete, etc.)

### 3. Auto-Refresh
Toggle the "Auto" button to enable/disable automatic refresh every 5 seconds

## For Developers

### Backend API Endpoints
```
POST   /api/activity-logs              - Create log entry
GET    /api/activity-logs              - Get all logs (with filters)
GET    /api/activity-logs/recent       - Get recent activity
GET    /api/activity-logs/entity/:type/:id  - Get entity activity
GET    /api/activity-logs/user/:userId - Get user activity
GET    /api/activity-logs/stats        - Get statistics
DELETE /api/activity-logs/cleanup     - Cleanup old logs
```

### Frontend Hook Usage
```javascript
import { useActivityLog } from './hooks/useActivityLog';

function MyComponent({ currentUser }) {
  const activityLog = useActivityLog(currentUser);
  
  // Log actions
  activityLog.logCreate('document', docId, docName);
  activityLog.logUpdate('template', templateId, templateName, changes);
  activityLog.logSign('document', docId, docName, 'prepared');
  activityLog.logUpload('evidence_form', formId, formName, fileName);
}
```

### Direct API Usage
```javascript
import { logActivity } from './services/activityLogAPI';

logActivity(
  currentUser,
  'create',
  'document',
  'DOC-123',
  'Asset Discovery Document',
  'Created new document for control 2.1.2',
  { controlId: '2.1.2', version: 1 }
);
```

## Database Schema
```javascript
{
  userId: String,
  userName: String,
  action: String (enum),
  entityType: String (enum),
  entityId: String,
  entityName: String,
  description: String,
  metadata: Object,
  ipAddress: String,
  timestamp: Date
}
```

## Current Integrations
- ✅ Document creation
- ✅ Document signing
- ✅ Signature revocation
- 🔄 Template updates (ready to add)
- 🔄 Evidence form actions (ready to add)
- 🔄 File uploads/downloads (ready to add)

## Adding Logging to New Features
1. Import the hook: `import { useActivityLog } from './hooks/useActivityLog';`
2. Initialize: `const activityLog = useActivityLog(currentUser);`
3. Call appropriate method: `activityLog.logCreate('entity_type', id, name);`

## Example Log Entry
```json
{
  "userId": "admin",
  "userName": "Admin User",
  "action": "sign",
  "entityType": "document",
  "entityId": "DOC-20251029-001",
  "entityName": "2.1.2 - Implement Asset Discovery Process",
  "description": "Signed document as prepared: 2.1.2 - Implement Asset Discovery Process",
  "metadata": {
    "role": "prepared",
    "controlId": "2.1.2",
    "version": 1
  },
  "ipAddress": "::1",
  "timestamp": "2025-10-29T14:30:00.000Z"
}
```

## Benefits
- **Audit Trail** - Complete history of all system changes
- **Accountability** - Track who did what and when
- **Debugging** - Identify issues by reviewing activity
- **Compliance** - Meet audit requirements for change tracking
- **Analytics** - Understand system usage patterns

## Future Enhancements
- 📧 Email notifications for critical actions
- 📊 Advanced analytics dashboard
- 📁 Export logs to CSV/PDF
- 🔍 Advanced search and filtering
- ⚠️ Alert system for suspicious activity
- 📈 Activity trends and reports
