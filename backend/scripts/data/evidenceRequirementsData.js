// Evidence requirements data for database migration
// Only includes controls that need evidence (not template-only controls)
export const evidenceRequirementsData = [
  // GOVERNANCE (1.x)
  { controlId: '1.1.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports (Quarterly/Annual)', required: true },
    { id: 2, name: 'KPIs or Metrics Tracking', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.2.2', requirements: [{ id: 1, name: 'Implementation Evidence', required: true }]},
  { controlId: '1.2.3', requirements: [{ id: 1, name: 'Action Plan Implementation Evidence', required: true }]},
  { controlId: '1.2.4', requirements: [
    { id: 1, name: 'Committee Meeting Minutes', required: true },
    { id: 2, name: 'Follow-up Actions Documentation', required: true },
    { id: 3, name: 'Escalation Records (if any)', required: false }
  ]},
  { controlId: '1.2.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.3.2', requirements: [
    { id: 1, name: 'Compliance Process Document', required: true },
    { id: 2, name: 'Implementation Evidence', required: true }
  ]},
  { controlId: '1.3.3', requirements: [{ id: 1, name: 'Embedded Compliance Requirements Evidence', required: true }]},
  { controlId: '1.3.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.4.3', requirements: [
    { id: 1, name: 'Approved Audit Plan', required: true },
    { id: 2, name: 'Auditor Independence Evidence', required: true },
    { id: 3, name: 'Audit Reports', required: true }
  ]},
  { controlId: '1.4.4', requirements: [
    { id: 1, name: 'Audit Reports', required: true },
    { id: 2, name: 'Presentation to Management Evidence', required: true },
    { id: 3, name: 'Corrective Action Plans', required: true }
  ]},
  { controlId: '1.4.5', requirements: [
    { id: 1, name: 'Secure Storage System Evidence', required: true },
    { id: 2, name: 'Access Control Screenshots', required: true },
    { id: 3, name: 'Tamper-proof Evidence', required: true }
  ]},
  { controlId: '1.4.6', requirements: [{ id: 1, name: 'Audit Records Retention Evidence', required: true }]},
  { controlId: '1.4.7', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.5.2', requirements: [
    { id: 1, name: 'Training Materials (Slides, LMS Content)', required: true },
    { id: 2, name: 'Training Schedule', required: true },
    { id: 3, name: 'Attendance Sheets/LMS Logs', required: true }
  ]},
  { controlId: '1.5.3', requirements: [
    { id: 1, name: 'Effectiveness Testing Evidence (Phishing, Quizzes)', required: true },
    { id: 2, name: 'Test Results Reports', required: true },
    { id: 3, name: 'Improvement Evidence', required: true }
  ]},
  { controlId: '1.5.4', requirements: [
    { id: 1, name: 'New Hire Training Evidence', required: true },
    { id: 2, name: 'System Change Training Evidence', required: true },
    { id: 3, name: 'Role Change Training Evidence', required: true }
  ]},
  { controlId: '1.5.5', requirements: [
    { id: 1, name: 'Specialized Training Program', required: true },
    { id: 2, name: 'Training Certificates', required: true },
    { id: 3, name: 'Attendance Records', required: true }
  ]},
  { controlId: '1.5.6', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.6.2', requirements: [
    { id: 1, name: 'Training Materials (Posters, Videos, Infographics)', required: true },
    { id: 2, name: 'Execution Records', required: true }
  ]},
  { controlId: '1.6.3', requirements: [
    { id: 1, name: 'Periodic Execution Reports', required: true },
    { id: 2, name: 'Delivery Evidence (Emails, SMS)', required: true }
  ]},
  { controlId: '1.6.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.7.2', requirements: [
    { id: 1, name: 'Risk Assessment Reports (Initiation & Milestones)', required: true },
    { id: 2, name: 'Risk Treatment Actions', required: true }
  ]},
  { controlId: '1.7.3', requirements: [
    { id: 1, name: 'Risk Register', required: true },
    { id: 2, name: 'Status Updates', required: true },
    { id: 3, name: 'Closure Evidence', required: false }
  ]},
  { controlId: '1.7.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '1.8.2', requirements: [
    { id: 1, name: 'Access Rights Update Evidence (IAM Logs)', required: true },
    { id: 2, name: 'Role Change Process Evidence', required: true }
  ]},
  { controlId: '1.8.3', requirements: [{ id: 1, name: 'Disciplinary Action Process Evidence', required: true }]},
  { controlId: '1.8.4', requirements: [
    { id: 1, name: 'Termination Checklist/Exit Clearance', required: true },
    { id: 2, name: 'Account Deactivation Evidence (IAM Logs)', required: true },
    { id: 3, name: 'Asset Recovery Records', required: true },
    { id: 4, name: 'Data Retention Evidence', required: true }
  ]},
  { controlId: '1.8.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},

  // ASSET MANAGEMENT (2.x)
  { controlId: '2.1.2', requirements: [
    { id: 1, name: 'Asset Discovery Process Document', required: true },
    { id: 2, name: 'Asset Inventory Register', required: true },
    { id: 3, name: 'Discovery Tool Logs/Screenshots', required: true }
  ]},
  { controlId: '2.1.3', requirements: [
    { id: 1, name: 'Inventory Review Evidence', required: true },
    { id: 2, name: 'Updated Inventory Versions', required: true }
  ]},
  { controlId: '2.1.4', requirements: [
    { id: 1, name: 'Tool Deployment Evidence', required: true },
    { id: 2, name: 'Tool Reports/Screenshots', required: true }
  ]},
  { controlId: '2.1.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '2.2.2', requirements: [
    { id: 1, name: 'Classification Process Document', required: true },
    { id: 2, name: 'Classified Assets Evidence', required: true },
    { id: 3, name: 'Protection Measures Implementation', required: true }
  ]},
  { controlId: '2.2.3', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '2.3.2', requirements: [
    { id: 1, name: 'Policy Enforcement Evidence', required: true },
    { id: 2, name: 'Configuration Screenshots', required: true },
    { id: 3, name: 'Employee Communication Evidence', required: true }
  ]},
  { controlId: '2.3.3', requirements: [{ id: 1, name: 'Remote Wipe/Secure Deletion Evidence', required: true }]},
  { controlId: '2.3.4', requirements: [{ id: 1, name: 'Encryption Enforcement Screenshots', required: true }]},
  { controlId: '2.3.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '2.4.2', requirements: [
    { id: 1, name: 'GPO/Endpoint Protection Configuration', required: true },
    { id: 2, name: 'Firewall Configuration', required: true },
    { id: 3, name: 'Device Control Policies', required: true },
    { id: 4, name: 'Enforcement Reports', required: true }
  ]},
  { controlId: '2.4.3', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '2.5.2', requirements: [
    { id: 1, name: 'Maintenance Process Document', required: true },
    { id: 2, name: 'Maintenance Records (Patching, Repairs)', required: true },
    { id: 3, name: 'ITSM Tool Records', required: true }
  ]},
  { controlId: '2.5.3', requirements: [
    { id: 1, name: 'Asset Recovery Plan', required: true },
    { id: 2, name: 'Recovery Execution Logs', required: true },
    { id: 3, name: 'System Restoration Evidence', required: true }
  ]},
  { controlId: '2.5.4', requirements: [
    { id: 1, name: 'Monitoring Tool Evidence (SIEM/Dashboard)', required: true },
    { id: 2, name: 'Asset Classification Monitoring', required: true },
    { id: 3, name: 'Periodic Monitoring Reports', required: true }
  ]},
  { controlId: '2.5.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '2.6.2', requirements: [
    { id: 1, name: 'Secure Disposal Process', required: true },
    { id: 2, name: 'Disposal Records/Certificates', required: true },
    { id: 3, name: 'Training Evidence', required: true }
  ]},
  { controlId: '2.6.3', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},

  // CYBERSECURITY RISK MANAGEMENT (3.x)
  { controlId: '3.1.2', requirements: [
    { id: 1, name: 'Risk Assessment Execution Evidence', required: true },
    { id: 2, name: 'Risk Register (Complete)', required: true }
  ]},
  { controlId: '3.1.3', requirements: [{ id: 1, name: 'Risk Assessment Integration Evidence', required: true }]},
  { controlId: '3.1.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '3.2.2', requirements: [{ id: 1, name: 'Risk Treatment Plan (Approved)', required: true }]},
  { controlId: '3.2.3', requirements: [
    { id: 1, name: 'Risk Register with Status Tracking', required: true },
    { id: 2, name: 'Treatment Plan Tracking', required: true },
    { id: 3, name: 'Residual Risk Review Evidence', required: true }
  ]},
  { controlId: '3.2.4', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},

  // LOGICAL SECURITY (4.x)
  { controlId: '4.1.2', requirements: [{ id: 1, name: 'Cryptographic Solutions List (Approved)', required: true }]},
  { controlId: '4.1.3', requirements: [{ id: 1, name: 'Implementation Evidence (In Transit, At Rest, In Use)', required: true }]},
  { controlId: '4.1.4', requirements: [
    { id: 1, name: 'Key Lifecycle Management Process', required: true },
    { id: 2, name: 'Implementation Evidence', required: true }
  ]},
  { controlId: '4.1.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '4.2.2', requirements: [{ id: 1, name: 'Change Management Process Implementation Evidence', required: true }]},
  { controlId: '4.2.3', requirements: [
    { id: 1, name: 'Test Results Samples', required: true },
    { id: 2, name: 'Risk Assessment Samples', required: true }
  ]},
  { controlId: '4.2.4', requirements: [{ id: 1, name: 'Emergency Change Procedure Implementation Evidence', required: true }]},
  { controlId: '4.2.5', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '4.3.2', requirements: [{ id: 1, name: 'Vulnerability Management Process Implementation Evidence', required: true }]},
  { controlId: '4.3.3', requirements: [
    { id: 1, name: 'Event-Triggered Scan Reports', required: true },
    { id: 2, name: 'Remediation Evidence', required: true }
  ]},
  { controlId: '4.3.4', requirements: [
    { id: 1, name: 'Vulnerability Scanning Tools List', required: true },
    { id: 2, name: 'Tool Configuration', required: true },
    { id: 3, name: 'Automated Scan Evidence', required: true },
    { id: 4, name: 'Scan Reports', required: true }
  ]},
  { controlId: '4.3.5', requirements: [
    { id: 1, name: 'Enhanced Classification Process Document', required: true },
    { id: 2, name: 'Threat Intelligence Integration Evidence', required: true },
    { id: 3, name: 'Reprioritization Examples', required: true }
  ]},
  { controlId: '4.3.6', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]},
  { controlId: '4.4.2', requirements: [
    { id: 1, name: 'Vulnerability/Risk Assessment Report', required: true },
    { id: 2, name: 'Testing Evidence', required: true },
    { id: 3, name: 'Change Request', required: true },
    { id: 4, name: 'Remediation Plan', required: true }
  ]},
  { controlId: '4.4.3', requirements: [
    { id: 1, name: 'Patch Installation Logs', required: true },
    { id: 2, name: 'Vulnerability Rescan Reports', required: true }
  ]},
  { controlId: '4.4.4', requirements: [{ id: 1, name: 'Emergency Patch Process Implementation Evidence', required: true }]},
  { controlId: '4.4.5', requirements: [
    { id: 1, name: 'Approved Patch Schedule', required: true },
    { id: 2, name: 'Schedule Execution Evidence', required: true }
  ]},
  { controlId: '4.4.6', requirements: [
    { id: 1, name: 'Patch Management Tool Screenshots', required: true },
    { id: 2, name: 'Automated Enforcement Reports', required: true },
    { id: 3, name: 'Deployment Logs', required: true }
  ]},
  { controlId: '4.4.7', requirements: [{ id: 1, name: 'Enhanced Remediation Plan Implementation Evidence', required: true }]},
  { controlId: '4.4.8', requirements: [
    { id: 1, name: 'Scheduled Review Reports', required: true },
    { id: 2, name: 'KPIs or Metrics', required: true },
    { id: 3, name: 'Version History/Updated Documents', required: true }
  ]}
];
