// Maps which evidence form types apply to which control categories
// Controls not listed here will show "Static Evidence Upload" instead

export const evidenceFormMapping = {
  // Operational forms for specific control areas
  'change_request': [
    '4.2', // Change Management
    '4.6', // System Acquisition, Development and Maintenance
    '4.13', // Configuration Management and Hardening
  ],
  
  'incident_report': [
    '4.9', // Incident Management
    '4.10', // Malware Handling
  ],
  
  'risk_assessment': [
    '3.1', // Cybersecurity Risk Assessment
    '3.2', // Cybersecurity Risk Treatment & Monitoring
  ],
  
  'access_review': [
    '4.3', // Access Control
    '4.4', // Privileged Access Management
  ],
  
  'training_record': [
    '1.5', // Cybersecurity Awareness and Training
  ],
  
  'audit_report': [
    '1.3', // Cybersecurity Compliance
    '1.4', // Cybersecurity Audit
    '4.6', // Logging and Monitoring
  ],
  
  'meeting_minutes': [
    '1.1', // Information Security Policies
    '1.2', // Governance Structure
  ],
  
  'vendor_assessment': [
    '6.1', // Cloud Services
    '6.2', // Outsourcing Services
  ]
};

// Controls that need static evidence (photos, documents, certificates)
// These get "Upload Evidence Files" button instead of form creation
export const staticEvidenceControls = [
  '1.2', // Organization Structure (org charts, committee rosters)
  '3.2', // Asset Management (inventory photos, purchase receipts)
  '4.1', // Policies and Procedures (signed policy documents)
  '4.5', // Network Security (network diagrams, firewall configs)
  '4.7', // Cryptography (certificates, key management docs)
  '4.12', // Backup and Recovery (backup logs, test results)
  '5.1', // Physical Protection (photos, perimeter security, storage)
  '5.2', // Physical Access Management (badge readers, cameras, access logs)
];

// Get applicable form types for a control
export const getApplicableFormTypes = (controlId) => {
  const applicable = [];
  
  // Extract category prefix (e.g., "4.2" from "4.2.1")
  const category = controlId.match(/^\d+\.\d+/)?.[0];
  
  if (!category) return applicable;
  
  // Check each form type
  for (const [formType, categories] of Object.entries(evidenceFormMapping)) {
    if (categories.includes(category)) {
      applicable.push(formType);
    }
  }
  
  return applicable;
};

// Check if control needs static evidence only
export const needsStaticEvidence = (controlId) => {
  const category = controlId.match(/^\d+\.\d+/)?.[0];
  return staticEvidenceControls.includes(category);
};

// Check if control has any evidence capability
export const hasEvidenceCapability = (controlId) => {
  const hasFormTypes = getApplicableFormTypes(controlId).length > 0;
  const hasStaticEvidence = needsStaticEvidence(controlId);
  return hasFormTypes || hasStaticEvidence;
};

// Get evidence type description for control
export const getEvidenceTypeDescription = (controlId) => {
  const hasFormTypes = getApplicableFormTypes(controlId).length > 0;
  const hasStaticEvidence = needsStaticEvidence(controlId);
  
  if (hasFormTypes && hasStaticEvidence) {
    return 'operational_and_static';
  } else if (hasFormTypes) {
    return 'operational';
  } else if (hasStaticEvidence) {
    return 'static';
  } else {
    return 'none';
  }
};

// Control categories that typically need static evidence
export const staticEvidenceDescriptions = {
  '1.2': 'Upload organizational charts, committee rosters, role descriptions',
  '3.2': 'Upload asset inventory photos, purchase receipts, equipment labels',
  '4.1': 'Upload signed policy documents, acknowledgment forms, distribution records',
  '4.5': 'Upload network diagrams, firewall configurations, security zone maps',
  '4.7': 'Upload encryption certificates, key management documentation, crypto policies',
  '4.12': 'Upload backup logs, recovery test results, backup schedules',
  '5.1': 'Upload photos of security perimeters, storage areas, environmental controls, delivery zones',
  '5.2': 'Upload photos of badge readers, cameras, biometric systems, access logs, visitor logs',
};
