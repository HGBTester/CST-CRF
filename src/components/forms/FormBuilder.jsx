// Universal Form Builder for all evidence types
import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { evidenceFormsAPI } from '../../services/evidenceFormsAPI';
import { useAuditStructure } from '../../hooks/useConfig';

// Form templates for each evidence type
const formTemplates = {
  change_request: {
    title: 'Change Request',
    icon: '🔄',
    defaultControl: '4.2.1',
    controlFilter: (id) => id.startsWith('4.2'),
    fields: [
      { name: 'title', label: 'Change Title', type: 'text', required: true },
      { name: 'changeType', label: 'Change Type', type: 'select', required: true, options: [
        'Firewall Configuration', 'Network Configuration', 'Server Configuration', 'Software Installation', 'Database Schema', 'Security Policy', 'Other'
      ]},
      { name: 'priority', label: 'Priority', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'description', label: 'Description', type: 'textarea', required: true, rows: 3 },
      { name: 'systemsAffected', label: 'Systems/Services Affected', type: 'text', required: true },
      { name: 'riskLevel', label: 'Risk Level', type: 'select', required: true, options: ['Low Risk', 'Medium Risk', 'High Risk'] },
      { name: 'implementationDate', label: 'Implementation Date', type: 'datetime-local', required: true },
      { name: 'riskAssessment', label: 'Risk Assessment & Mitigation', type: 'textarea', rows: 2 },
      { name: 'implementationPlan', label: 'Implementation Plan', type: 'textarea', required: true, rows: 3 },
      { name: 'rollbackPlan', label: 'Rollback Plan', type: 'textarea', required: true, rows: 2 }
    ]
  },
  
  meeting_minutes: {
    title: 'Meeting Minutes',
    icon: '📅',
    defaultControl: '1.2.2',
    controlFilter: (id) => id.startsWith('1.'),
    fields: [
      { name: 'title', label: 'Meeting Title', type: 'text', required: true },
      { name: 'meetingDate', label: 'Meeting Date', type: 'datetime-local', required: true },
      { name: 'meetingType', label: 'Meeting Type', type: 'select', required: true, options: [
        'Committee Meeting', 'Review Meeting', 'Planning Session', 'Emergency Meeting', 'Other'
      ]},
      { name: 'attendees', label: 'Attendees (one per line)', type: 'textarea', required: true, rows: 4 },
      { name: 'agenda', label: 'Agenda Items', type: 'textarea', required: true, rows: 3 },
      { name: 'discussions', label: 'Key Discussions', type: 'textarea', required: true, rows: 4 },
      { name: 'decisions', label: 'Decisions Made', type: 'textarea', required: true, rows: 3 },
      { name: 'actionItems', label: 'Action Items', type: 'textarea', required: true, rows: 3 },
      { name: 'nextMeeting', label: 'Next Meeting Date', type: 'date' }
    ]
  },
  
  training_record: {
    title: 'Training Record',
    icon: '🎓',
    defaultControl: '1.5.1',
    controlFilter: (id) => id.startsWith('1.5'),
    fields: [
      { name: 'title', label: 'Training Title', type: 'text', required: true },
      { name: 'trainingDate', label: 'Training Date', type: 'date', required: true },
      { name: 'trainer', label: 'Trainer Name', type: 'text', required: true },
      { name: 'trainingType', label: 'Training Type', type: 'select', required: true, options: [
        'Cybersecurity Awareness', 'Technical Training', 'Compliance Training', 'Security Tools', 'Incident Response', 'Other'
      ]},
      { name: 'duration', label: 'Duration (hours)', type: 'number', required: true },
      { name: 'attendees', label: 'Attendees List (one per line)', type: 'textarea', required: true, rows: 5 },
      { name: 'topics', label: 'Topics Covered', type: 'textarea', required: true, rows: 3 },
      { name: 'materials', label: 'Training Materials Used', type: 'textarea', rows: 2 },
      { name: 'assessment', label: 'Assessment Results', type: 'textarea', rows: 2 },
      { name: 'feedback', label: 'Participant Feedback', type: 'textarea', rows: 2 }
    ]
  },
  
  audit_report: {
    title: 'Audit Report',
    icon: '🔍',
    defaultControl: '1.4.1',
    controlFilter: (id) => id.startsWith('1.4'),
    fields: [
      { name: 'title', label: 'Audit Title', type: 'text', required: true },
      { name: 'auditDate', label: 'Audit Date', type: 'date', required: true },
      { name: 'auditor', label: 'Auditor Name', type: 'text', required: true },
      { name: 'auditType', label: 'Audit Type', type: 'select', required: true, options: [
        'Internal Audit', 'External Audit', 'Compliance Audit', 'Technical Audit', 'Follow-up Audit'
      ]},
      { name: 'scope', label: 'Audit Scope', type: 'textarea', required: true, rows: 3 },
      { name: 'methodology', label: 'Methodology', type: 'textarea', rows: 2 },
      { name: 'findings', label: 'Key Findings', type: 'textarea', required: true, rows: 4 },
      { name: 'nonConformities', label: 'Non-Conformities', type: 'textarea', rows: 3 },
      { name: 'recommendations', label: 'Recommendations', type: 'textarea', required: true, rows: 3 },
      { name: 'actionPlan', label: 'Corrective Action Plan', type: 'textarea', rows: 3 },
      { name: 'targetDate', label: 'Target Completion Date', type: 'date' }
    ]
  },
  
  incident_report: {
    title: 'Incident Report',
    icon: '⚠️',
    defaultControl: '4.9.1',
    controlFilter: (id) => id.startsWith('4.9'),
    fields: [
      { name: 'title', label: 'Incident Title', type: 'text', required: true },
      { name: 'incidentDate', label: 'Incident Date/Time', type: 'datetime-local', required: true },
      { name: 'discoveredDate', label: 'Discovery Date/Time', type: 'datetime-local', required: true },
      { name: 'severity', label: 'Severity', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'incidentType', label: 'Incident Type', type: 'select', required: true, options: [
        'Malware', 'Unauthorized Access', 'Data Breach', 'DoS/DDoS', 'Phishing', 'Insider Threat', 'System Failure', 'Other'
      ]},
      { name: 'description', label: 'Incident Description', type: 'textarea', required: true, rows: 4 },
      { name: 'affectedSystems', label: 'Affected Systems/Data', type: 'textarea', required: true, rows: 2 },
      { name: 'impact', label: 'Impact Assessment', type: 'textarea', required: true, rows: 3 },
      { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', rows: 3 },
      { name: 'containment', label: 'Containment Actions', type: 'textarea', required: true, rows: 3 },
      { name: 'resolution', label: 'Resolution Steps', type: 'textarea', rows: 3 },
      { name: 'lessonsLearned', label: 'Lessons Learned', type: 'textarea', rows: 2 }
    ]
  },
  
  risk_assessment: {
    title: 'Risk Assessment',
    icon: '🎯',
    defaultControl: '3.1.1',
    controlFilter: (id) => id.startsWith('3.'),
    fields: [
      { name: 'title', label: 'Assessment Title', type: 'text', required: true },
      { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
      { name: 'assessor', label: 'Assessor Name', type: 'text', required: true },
      { name: 'assetSystem', label: 'Asset/System Being Assessed', type: 'text', required: true },
      { name: 'threats', label: 'Threats Identified', type: 'textarea', required: true, rows: 3 },
      { name: 'vulnerabilities', label: 'Vulnerabilities', type: 'textarea', required: true, rows: 3 },
      { name: 'likelihood', label: 'Likelihood', type: 'select', required: true, options: ['Low', 'Medium', 'High'] },
      { name: 'impact', label: 'Impact', type: 'select', required: true, options: ['Low', 'Medium', 'High'] },
      { name: 'riskLevel', label: 'Overall Risk Level', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'existingControls', label: 'Existing Controls', type: 'textarea', rows: 2 },
      { name: 'mitigation', label: 'Mitigation Plan', type: 'textarea', required: true, rows: 3 },
      { name: 'residualRisk', label: 'Residual Risk Level', type: 'select', options: ['Low', 'Medium', 'High'] },
      { name: 'reviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  access_review: {
    title: 'Access Review',
    icon: '✅',
    defaultControl: '4.7.6',
    controlFilter: (id) => id.startsWith('4.7'),
    fields: [
      { name: 'title', label: 'Review Title', type: 'text', required: true },
      { name: 'reviewDate', label: 'Review Date', type: 'date', required: true },
      { name: 'reviewer', label: 'Reviewer Name', type: 'text', required: true },
      { name: 'systemsReviewed', label: 'Systems/Applications Reviewed', type: 'textarea', required: true, rows: 3 },
      { name: 'usersReviewed', label: 'Number of Users Reviewed', type: 'number', required: true },
      { name: 'reviewScope', label: 'Review Scope', type: 'textarea', required: true, rows: 2 },
      { name: 'accessRightsVerified', label: 'Access Rights Verified', type: 'textarea', required: true, rows: 3 },
      { name: 'exceptionsFound', label: 'Exceptions/Issues Found', type: 'textarea', rows: 3 },
      { name: 'actionsTaken', label: 'Corrective Actions Taken', type: 'textarea', required: true, rows: 3 },
      { name: 'usersRemoved', label: 'Users/Access Removed', type: 'textarea', rows: 2 },
      { name: 'recommendations', label: 'Recommendations', type: 'textarea', rows: 2 },
      { name: 'nextReviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  vendor_assessment: {
    title: 'Vendor Assessment',
    icon: '🏢',
    defaultControl: '6.2.1',
    controlFilter: (id) => id.startsWith('6.'),
    fields: [
      { name: 'title', label: 'Assessment Title', type: 'text', required: true },
      { name: 'assessmentDate', label: 'Assessment Date', type: 'date', required: true },
      { name: 'vendorName', label: 'Vendor Name', type: 'text', required: true },
      { name: 'servicesProvided', label: 'Services/Products Provided', type: 'textarea', required: true, rows: 2 },
      { name: 'assessmentType', label: 'Assessment Type', type: 'select', required: true, options: [
        'Initial Assessment', 'Annual Review', 'Contract Renewal', 'Incident-Based', 'Other'
      ]},
      { name: 'securityRequirements', label: 'Security Requirements', type: 'textarea', required: true, rows: 3 },
      { name: 'complianceCertifications', label: 'Compliance Certifications', type: 'textarea', rows: 2 },
      { name: 'assessmentResults', label: 'Assessment Results', type: 'textarea', required: true, rows: 3 },
      { name: 'riskRating', label: 'Risk Rating', type: 'select', required: true, options: ['Low', 'Medium', 'High'] },
      { name: 'gaps', label: 'Gaps Identified', type: 'textarea', rows: 2 },
      { name: 'recommendations', label: 'Recommendations', type: 'textarea', rows: 2 },
      { name: 'contractTerms', label: 'Key Contract Terms', type: 'textarea', rows: 2 },
      { name: 'reviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  // NEW: Review Report
  review_report: {
    title: 'Review Report',
    icon: '📊',
    defaultControl: '1.1.4',
    controlFilter: (id) => true, // Applies to many controls
    fields: [
      { name: 'title', label: 'Review Title', type: 'text', required: true },
      { name: 'reviewDate', label: 'Review Date', type: 'date', required: true },
      { name: 'reviewPeriod', label: 'Review Period', type: 'text', required: true, placeholder: 'e.g., Q1 2025, January 2025' },
      { name: 'reviewer', label: 'Reviewer Name', type: 'text', required: true },
      { name: 'reviewType', label: 'Review Type', type: 'select', required: true, options: [
        'Quarterly Review', 'Annual Review', 'Monthly Review', 'Ad-hoc Review', 'Post-Incident Review'
      ]},
      { name: 'kpis', label: 'KPIs / Metrics Measured', type: 'textarea', required: true, rows: 3 },
      { name: 'findings', label: 'Key Findings', type: 'textarea', required: true, rows: 3 },
      { name: 'gaps', label: 'Gaps Identified', type: 'textarea', rows: 2 },
      { name: 'improvements', label: 'Improvements Made', type: 'textarea', rows: 2 },
      { name: 'versionChanges', label: 'Version Changes / Updates', type: 'textarea', rows: 2 },
      { name: 'recommendations', label: 'Recommendations', type: 'textarea', rows: 2 },
      { name: 'nextReviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  // NEW: Implementation Evidence
  implementation_evidence: {
    title: 'Implementation Evidence',
    icon: '📝',
    defaultControl: '1.2.2',
    controlFilter: (id) => true,
    fields: [
      { name: 'title', label: 'Implementation Title', type: 'text', required: true },
      { name: 'implementationDate', label: 'Implementation Date', type: 'date', required: true },
      { name: 'processOrPolicy', label: 'Process/Policy Implemented', type: 'text', required: true },
      { name: 'implementedBy', label: 'Implemented By', type: 'text', required: true },
      { name: 'description', label: 'Implementation Description', type: 'textarea', required: true, rows: 3 },
      { name: 'scope', label: 'Scope / Coverage', type: 'textarea', rows: 2 },
      { name: 'evidenceDescription', label: 'Evidence Description', type: 'textarea', required: true, rows: 3, placeholder: 'Describe the evidence files/screenshots attached' },
      { name: 'status', label: 'Implementation Status', type: 'select', required: true, options: [
        'Fully Implemented', 'Partially Implemented', 'In Progress', 'Pilot Phase', 'Completed'
      ]},
      { name: 'challenges', label: 'Challenges Faced', type: 'textarea', rows: 2 },
      { name: 'lessonsLearned', label: 'Lessons Learned', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Technical Log/Screenshot
  technical_log: {
    title: 'Technical Log/Screenshot',
    icon: '💻',
    defaultControl: '4.6.2',
    controlFilter: (id) => id.startsWith('4.'),
    fields: [
      { name: 'title', label: 'Log Title', type: 'text', required: true },
      { name: 'logDate', label: 'Log Date/Time', type: 'datetime-local', required: true },
      { name: 'logType', label: 'Log Type', type: 'select', required: true, options: [
        'System Log', 'IAM Log', 'Access Log', 'Firewall Log', 'Security Log', 'Audit Log', 'Application Log', 'Screenshot'
      ]},
      { name: 'systemSource', label: 'System/Source', type: 'text', required: true },
      { name: 'eventCount', label: 'Number of Events', type: 'number', placeholder: 'Total events in log' },
      { name: 'logContent', label: 'Log Content / Summary', type: 'textarea', required: true, rows: 4, placeholder: 'Paste key log entries or describe what the log shows' },
      { name: 'relevantEvents', label: 'Relevant Security Events', type: 'textarea', rows: 3 },
      { name: 'screenshotDescription', label: 'Screenshot Description', type: 'textarea', rows: 2, placeholder: 'If attaching screenshots, describe what they show' },
      { name: 'analysis', label: 'Analysis / Notes', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Inventory/Register
  inventory_register: {
    title: 'Inventory/Register',
    icon: '📋',
    defaultControl: '2.1.2',
    controlFilter: (id) => id.startsWith('2.') || id.startsWith('3.'),
    fields: [
      { name: 'title', label: 'Inventory Title', type: 'text', required: true },
      { name: 'inventoryDate', label: 'Inventory Date', type: 'date', required: true },
      { name: 'inventoryType', label: 'Inventory Type', type: 'select', required: true, options: [
        'Asset Inventory', 'Risk Register', 'Software Inventory', 'Hardware Inventory', 'Configuration Inventory'
      ]},
      { name: 'totalItems', label: 'Total Items', type: 'number', required: true },
      { name: 'owner', label: 'Inventory Owner', type: 'text', required: true },
      { name: 'scope', label: 'Scope / Coverage', type: 'textarea', required: true, rows: 2 },
      { name: 'lastUpdated', label: 'Last Updated', type: 'date', required: true },
      { name: 'reviewFrequency', label: 'Review Frequency', type: 'select', required: true, options: [
        'Weekly', 'Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'As Needed'
      ]},
      { name: 'description', label: 'Inventory Description', type: 'textarea', required: true, rows: 3, placeholder: 'Describe what is included in this inventory' },
      { name: 'updateProcess', label: 'Update Process', type: 'textarea', rows: 2 },
      { name: 'nextReviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  // NEW: Test Report
  test_report: {
    title: 'Test Report',
    icon: '🧪',
    defaultControl: '4.5.2',
    controlFilter: (id) => id.startsWith('4.') || id.startsWith('5.'),
    fields: [
      { name: 'title', label: 'Test Title', type: 'text', required: true },
      { name: 'testDate', label: 'Test Date', type: 'date', required: true },
      { name: 'tester', label: 'Tester Name', type: 'text', required: true },
      { name: 'testType', label: 'Test Type', type: 'select', required: true, options: [
        'Vulnerability Scan', 'Penetration Test', 'Effectiveness Test', 'Security Test', 'Compliance Test', 'Recovery Test', 'Performance Test'
      ]},
      { name: 'scope', label: 'Test Scope', type: 'textarea', required: true, rows: 2 },
      { name: 'toolsUsed', label: 'Tools Used', type: 'textarea', rows: 2 },
      { name: 'methodology', label: 'Methodology', type: 'textarea', rows: 2 },
      { name: 'findings', label: 'Findings / Results', type: 'textarea', required: true, rows: 4 },
      { name: 'criticalCount', label: 'Critical Issues', type: 'number' },
      { name: 'highCount', label: 'High Severity Issues', type: 'number' },
      { name: 'mediumCount', label: 'Medium Severity Issues', type: 'number' },
      { name: 'lowCount', label: 'Low Severity Issues', type: 'number' },
      { name: 'remediation', label: 'Remediation Recommendations', type: 'textarea', rows: 3 },
      { name: 'retestDate', label: 'Re-test Date', type: 'date' }
    ]
  },
  
  // NEW: Patch/Update Report
  patch_report: {
    title: 'Patch/Update Report',
    icon: '🔧',
    defaultControl: '4.6.2',
    controlFilter: (id) => id.startsWith('4.'),
    fields: [
      { name: 'title', label: 'Patch Report Title', type: 'text', required: true },
      { name: 'patchDate', label: 'Patch Date', type: 'date', required: true },
      { name: 'patchType', label: 'Patch Type', type: 'select', required: true, options: [
        'Security Patch', 'Critical Update', 'Feature Update', 'Bug Fix', 'Firmware Update', 'Hotfix'
      ]},
      { name: 'systemsUpdated', label: 'Systems Updated', type: 'textarea', required: true, rows: 3 },
      { name: 'totalSystems', label: 'Total Systems Patched', type: 'number', required: true },
      { name: 'patchList', label: 'Patch List / KB Numbers', type: 'textarea', required: true, rows: 3 },
      { name: 'successRate', label: 'Success Rate (%)', type: 'number', required: true },
      { name: 'failedSystems', label: 'Failed Systems', type: 'textarea', rows: 2 },
      { name: 'rebootRequired', label: 'Reboot Required?', type: 'select', required: true, options: ['Yes', 'No'] },
      { name: 'downtime', label: 'Downtime (minutes)', type: 'number' },
      { name: 'issues', label: 'Issues Encountered', type: 'textarea', rows: 2 },
      { name: 'verification', label: 'Verification Steps', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Configuration Document
  configuration_document: {
    title: 'Configuration Document',
    icon: '⚙️',
    defaultControl: '4.13.2',
    controlFilter: (id) => id.startsWith('4.'),
    fields: [
      { name: 'title', label: 'Configuration Title', type: 'text', required: true },
      { name: 'configDate', label: 'Configuration Date', type: 'date', required: true },
      { name: 'systemDevice', label: 'System/Device', type: 'text', required: true },
      { name: 'configurationType', label: 'Configuration Type', type: 'select', required: true, options: [
        'Firewall Configuration', 'Network Configuration', 'Server Configuration', 'Security Hardening', 'Baseline Configuration', 'Application Configuration'
      ]},
      { name: 'configVersion', label: 'Configuration Version', type: 'text', required: true },
      { name: 'baseline', label: 'Baseline Used', type: 'textarea', rows: 2, placeholder: 'e.g., CIS Benchmark, Vendor Baseline' },
      { name: 'configChanges', label: 'Configuration Changes', type: 'textarea', required: true, rows: 4 },
      { name: 'securitySettings', label: 'Security Settings', type: 'textarea', required: true, rows: 3 },
      { name: 'approvedBy', label: 'Approved By', type: 'text', required: true },
      { name: 'implementedBy', label: 'Implemented By', type: 'text', required: true },
      { name: 'verification', label: 'Verification Steps', type: 'textarea', rows: 2 },
      { name: 'reviewDate', label: 'Next Review Date', type: 'date' }
    ]
  },
  
  // NEW: Corrective Action Plan
  corrective_action: {
    title: 'Corrective Action Plan',
    icon: '🔄',
    defaultControl: '1.4.4',
    controlFilter: (id) => true,
    fields: [
      { name: 'title', label: 'Issue Title', type: 'text', required: true },
      { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
      { name: 'severity', label: 'Severity', type: 'select', required: true, options: ['Critical', 'High', 'Medium', 'Low'] },
      { name: 'issueDescription', label: 'Issue Description', type: 'textarea', required: true, rows: 3 },
      { name: 'rootCause', label: 'Root Cause Analysis', type: 'textarea', required: true, rows: 3 },
      { name: 'impact', label: 'Impact Assessment', type: 'textarea', required: true, rows: 2 },
      { name: 'actionPlan', label: 'Corrective Action Plan', type: 'textarea', required: true, rows: 4 },
      { name: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true },
      { name: 'targetDate', label: 'Target Completion Date', type: 'date', required: true },
      { name: 'timeline', label: 'Implementation Timeline', type: 'textarea', rows: 2 },
      { name: 'resources', label: 'Resources Required', type: 'textarea', rows: 2 },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        'Open', 'In Progress', 'Pending Review', 'Completed', 'Closed'
      ]},
      { name: 'verification', label: 'Verification Method', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Backup/Recovery Log
  backup_log: {
    title: 'Backup/Recovery Log',
    icon: '💾',
    defaultControl: '4.12.2',
    controlFilter: (id) => id.startsWith('4.12'),
    fields: [
      { name: 'title', label: 'Backup Log Title', type: 'text', required: true },
      { name: 'backupDate', label: 'Backup Date/Time', type: 'datetime-local', required: true },
      { name: 'backupType', label: 'Backup Type', type: 'select', required: true, options: [
        'Full Backup', 'Incremental Backup', 'Differential Backup', 'Recovery Test', 'Disaster Recovery Test'
      ]},
      { name: 'systems', label: 'Systems Backed Up', type: 'textarea', required: true, rows: 2 },
      { name: 'dataSize', label: 'Data Size (GB)', type: 'number', required: true },
      { name: 'duration', label: 'Duration (hours)', type: 'number', required: true },
      { name: 'backupLocation', label: 'Backup Location', type: 'text', required: true },
      { name: 'status', label: 'Backup Status', type: 'select', required: true, options: ['Success', 'Partial Success', 'Failed'] },
      { name: 'successDetails', label: 'Success/Failure Details', type: 'textarea', rows: 3 },
      { name: 'recoveryTestDate', label: 'Recovery Test Date', type: 'date' },
      { name: 'recoveryTestResult', label: 'Recovery Test Result', type: 'textarea', rows: 2 },
      { name: 'rto', label: 'RTO (Recovery Time Objective)', type: 'text', placeholder: 'e.g., 4 hours' },
      { name: 'rpo', label: 'RPO (Recovery Point Objective)', type: 'text', placeholder: 'e.g., 24 hours' },
      { name: 'verification', label: 'Verification Steps', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Exit/Termination Record
  termination_record: {
    title: 'Exit/Termination Record',
    icon: '🚪',
    defaultControl: '1.8.4',
    controlFilter: (id) => id.startsWith('1.8'),
    fields: [
      { name: 'title', label: 'Exit Record Title', type: 'text', required: true },
      { name: 'terminationDate', label: 'Termination Date', type: 'date', required: true },
      { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
      { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
      { name: 'department', label: 'Department', type: 'text', required: true },
      { name: 'terminationType', label: 'Termination Type', type: 'select', required: true, options: [
        'Voluntary Resignation', 'Retirement', 'Contract End', 'Termination', 'Transfer'
      ]},
      { name: 'accountsDisabled', label: 'Accounts Disabled', type: 'textarea', required: true, rows: 3, placeholder: 'List all accounts disabled (AD, email, VPN, applications, etc.)' },
      { name: 'disabledDate', label: 'Accounts Disabled Date/Time', type: 'datetime-local', required: true },
      { name: 'assetsReturned', label: 'Assets Returned', type: 'textarea', required: true, rows: 3, placeholder: 'List all assets returned (laptop, phone, badge, keys, etc.)' },
      { name: 'dataRetention', label: 'Data Retention', type: 'textarea', rows: 2, placeholder: 'Email archive, file retention, etc.' },
      { name: 'accessRevoked', label: 'Physical Access Revoked', type: 'textarea', rows: 2 },
      { name: 'exitInterview', label: 'Exit Interview Conducted', type: 'select', required: true, options: ['Yes', 'No', 'N/A'] },
      { name: 'clearanceDate', label: 'Final Clearance Date', type: 'date', required: true },
      { name: 'notes', label: 'Additional Notes', type: 'textarea', rows: 2 }
    ]
  },
  
  // NEW: Awareness Material
  awareness_material: {
    title: 'Awareness Material',
    icon: '📢',
    defaultControl: '1.6.2',
    controlFilter: (id) => id.startsWith('1.5') || id.startsWith('1.6'),
    fields: [
      { name: 'title', label: 'Material Title', type: 'text', required: true },
      { name: 'distributionDate', label: 'Distribution Date', type: 'date', required: true },
      { name: 'materialType', label: 'Material Type', type: 'select', required: true, options: [
        'Poster', 'Video', 'Infographic', 'Email Campaign', 'Newsletter', 'Training Slides', 'Interactive Module', 'Quiz'
      ]},
      { name: 'topic', label: 'Topic / Theme', type: 'text', required: true },
      { name: 'targetAudience', label: 'Target Audience', type: 'select', required: true, options: [
        'All Employees', 'IT Staff', 'Management', 'Customers', 'Partners', 'New Hires', 'Specific Department'
      ]},
      { name: 'description', label: 'Content Description', type: 'textarea', required: true, rows: 3 },
      { name: 'channel', label: 'Distribution Channel', type: 'select', required: true, options: [
        'Email', 'Intranet', 'Posters/Digital Screens', 'Social Media', 'LMS', 'Teams/Slack', 'SMS'
      ]},
      { name: 'reach', label: 'Reach / Recipients', type: 'number', placeholder: 'Number of people reached' },
      { name: 'engagement', label: 'Engagement Metrics', type: 'textarea', rows: 2, placeholder: 'Views, clicks, completion rate, etc.' },
      { name: 'feedback', label: 'Feedback / Results', type: 'textarea', rows: 2 },
      { name: 'nextCampaign', label: 'Next Campaign Date', type: 'date' }
    ]
  },
  
  // NEW: Compliance Document
  compliance_document: {
    title: 'Compliance Document',
    icon: '📜',
    defaultControl: '1.3.2',
    controlFilter: (id) => id.startsWith('1.3') || id.startsWith('1.4'),
    fields: [
      { name: 'title', label: 'Document Title', type: 'text', required: true },
      { name: 'documentDate', label: 'Document Date', type: 'date', required: true },
      { name: 'documentType', label: 'Document Type', type: 'select', required: true, options: [
        'Compliance Report', 'Regulatory Submission', 'Certification', 'Attestation', 'Declaration of Conformity', 'Compliance Assessment'
      ]},
      { name: 'regulation', label: 'Regulation / Framework', type: 'select', required: true, options: [
        'CST-CRF', 'NCA ECC-1:2018', 'PDPL', 'CITC', 'ISO 27001', 'NIST', 'PCI-DSS', 'GDPR', 'Other'
      ]},
      { name: 'regulationOther', label: 'Other Regulation (if selected)', type: 'text' },
      { name: 'submittedTo', label: 'Submitted To', type: 'text', required: true },
      { name: 'submissionDate', label: 'Submission Date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', required: true, options: [
        'Draft', 'Submitted', 'Under Review', 'Approved', 'Certified', 'Rejected', 'Renewal Required'
      ]},
      { name: 'validUntil', label: 'Valid Until', type: 'date' },
      { name: 'certificationBody', label: 'Certification Body', type: 'text' },
      { name: 'scope', label: 'Scope / Coverage', type: 'textarea', required: true, rows: 2 },
      { name: 'complianceLevel', label: 'Compliance Level Achieved', type: 'textarea', rows: 2 },
      { name: 'gaps', label: 'Gaps / Non-Compliance', type: 'textarea', rows: 2 },
      { name: 'remediation', label: 'Remediation Plan', type: 'textarea', rows: 2 },
      { name: 'nextReview', label: 'Next Review Date', type: 'date' }
    ]
  }
};

function FormBuilder({ formType, currentUser, darkMode, onClose, onSuccess, preSelectedControl }) {
  const template = formTemplates[formType];
  const { auditStructure } = useAuditStructure();
  
  // Error handling: Prevent white page if template is missing
  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen" style={{backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'}}>
        <div className="text-center p-6">
          <p className="text-xl font-bold mb-4" style={{color: darkMode ? '#e5e7eb' : '#1e293b'}}>
            ⚠️ Form Template Not Found
          </p>
          <p className="mb-4" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
            The form type "<strong>{formType}</strong>" is not yet implemented.
          </p>
          <p className="text-sm mb-6" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
            Available form types: change_request, meeting_minutes, training_record, audit_report, incident_report, risk_assessment, access_review, vendor_assessment, review_report, implementation_evidence, technical_log, inventory_register, test_report, patch_report, configuration_document, corrective_action, backup_log, termination_record, awareness_material, compliance_document
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-white"
            style={{backgroundColor: '#3b82f6'}}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    controlId: preSelectedControl || template.defaultControl,
    ...template.fields.reduce((acc, field) => ({...acc, [field.name]: ''}), {})
  });

  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  const getAllControls = () => {
    const controls = [];
    if (!auditStructure) return controls;
    Object.entries(auditStructure).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        items.forEach(item => {
          if (template.controlFilter(item.id)) {
            controls.push({
              id: item.id,
              name: item.name,
              category,
              subcategory
            });
          }
        });
      });
    });
    return controls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Check if backend is reachable
      const healthCheck = await fetch('http://localhost:5000/api/health').catch(() => null);
      if (!healthCheck) {
        alert('❌ Backend server is not running!\n\nPlease start the backend:\n1. Open terminal\n2. cd backend\n3. npm run dev\n\nSee START_SYSTEM.md for details.');
        setUploading(false);
        return;
      }

      const form = await evidenceFormsAPI.create({
        formType,
        controlId: formData.controlId,
        title: formData.title,
        description: formData.description || formData.title,
        formData,
        createdBy: {
          userId: currentUser.id,
          userName: currentUser.fullName
        },
        status: 'draft'
      });

      for (const file of attachments) {
        await evidenceFormsAPI.uploadAttachment(
          form._id,
          file,
          currentUser.fullName,
          file.description || 'Attachment',
          file.category || 'document'
        );
      }

      await evidenceFormsAPI.sign(form._id, 'requester', currentUser, 'Initial submission');

      alert('✅ Evidence form created successfully!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create form:', error);
      
      let errorMessage = 'Failed to create form: ';
      if (error.message.includes('fetch')) {
        errorMessage += '\n\n❌ Cannot connect to backend server!\n\nMake sure backend is running:\n1. Open terminal\n2. cd backend\n3. npm run dev';
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      category: 'document',
      description: ''
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const renderField = (field) => {
    const commonStyle = {
      backgroundColor: darkMode ? '#262626' : '#ffffff',
      borderColor,
      color: textColor
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            required={field.required}
            value={formData[field.name]}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            rows={field.rows || 3}
            placeholder={field.placeholder}
            className="w-full p-3 rounded-lg border resize-none"
            style={commonStyle}
          />
        );
      
      case 'select':
        return (
          <select
            required={field.required}
            value={formData[field.name]}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            className="w-full p-3 rounded-lg border"
            style={commonStyle}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(opt => (
              <option key={opt} value={opt.toLowerCase().replace(/\s+/g, '_')}>{opt}</option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            type={field.type}
            required={field.required}
            value={formData[field.name]}
            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
            placeholder={field.placeholder}
            className="w-full p-3 rounded-lg border"
            style={commonStyle}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className="rounded-lg p-6 max-w-4xl w-full my-auto max-h-[90vh] overflow-y-auto"
        style={{backgroundColor: bgColor}}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold" style={{color: textColor}}>
              {template.icon} {template.title}
            </h2>
            <p className="text-sm mt-1" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              Create evidence form linked to control
            </p>
          </div>
          <button onClick={onClose} disabled={uploading}>
            <X size={24} style={{color: darkMode ? '#9ca3af' : '#64748b'}} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Control Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Linked Control *
            </label>
            <select
              required
              value={formData.controlId}
              onChange={(e) => setFormData({...formData, controlId: e.target.value})}
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            >
              <option value="">Select Control</option>
              {getAllControls().map(control => (
                <option key={control.id} value={control.id}>
                  {control.id} - {control.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Fields */}
          {template.fields.map((field, idx) => (
            <div key={idx} className={field.cols ? `grid grid-cols-${field.cols} gap-4` : ''}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
                  {field.label} {field.required && '*'}
                </label>
                {renderField(field)}
              </div>
            </div>
          ))}

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Attachments (Photos, Documents, Evidence)
            </label>
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center"
              style={{borderColor}}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.xlsx,.xls"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={32} className="mx-auto mb-2" style={{color: darkMode ? '#9ca3af' : '#6b7280'}} />
                <p style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  Click to upload files
                </p>
                <p className="text-xs mt-1" style={{color: darkMode ? '#6b7280' : '#9ca3af'}}>
                  Images, PDFs, Documents (max 10MB each)
                </p>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((att, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded border"
                    style={{borderColor, backgroundColor: darkMode ? '#262626' : '#f9fafb'}}
                  >
                    <span className="text-sm" style={{color: textColor}}>{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{backgroundColor: '#10b981'}}
            >
              {uploading ? 'Creating...' : 'Create & Submit for Review'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: darkMode ? '#404040' : '#e5e7eb',
                color: textColor
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormBuilder;
export { formTemplates };
