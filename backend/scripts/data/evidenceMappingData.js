// Evidence mapping data for database migration
export const evidenceMappingData = [
  { formType: 'change_request', applicableCategories: ['4.2', '4.6', '4.13'] },
  { formType: 'incident_report', applicableCategories: ['4.9', '4.10'] },
  { formType: 'risk_assessment', applicableCategories: ['3.1', '3.2', '1.7'] },
  { formType: 'access_review', applicableCategories: ['4.3', '4.4', '1.8'] },
  { formType: 'training_record', applicableCategories: ['1.5', '1.6'] },
  { formType: 'audit_report', applicableCategories: ['1.3', '1.4', '4.6'] },
  { formType: 'meeting_minutes', applicableCategories: ['1.1', '1.2'] },
  { formType: 'vendor_assessment', applicableCategories: ['6.1', '6.2'] },
  { formType: 'review_report', applicableCategories: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '3.1', '3.2', '4.1', '4.2', '4.3', '4.4', '4.5'] },
  { formType: 'implementation_evidence', applicableCategories: ['1.1', '1.2', '1.3', '1.5', '2.1', '2.2', '2.3', '2.4', '4.1', '4.7'] },
  { formType: 'technical_log', applicableCategories: ['1.8', '4.3', '4.4', '4.5', '4.6', '4.8', '4.9', '4.11', '4.14'] },
  { formType: 'inventory_register', applicableCategories: ['2.1', '2.2', '3.1', '3.2', '4.6', '4.13'] },
  { formType: 'test_report', applicableCategories: ['1.5', '4.3', '4.5', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12', '5.2'] },
  { formType: 'patch_report', applicableCategories: ['4.6', '4.8', '4.10'] },
  { formType: 'configuration_document', applicableCategories: ['4.1', '4.5', '4.7', '4.13', '4.14'] },
  { formType: 'corrective_action', applicableCategories: ['1.4', '4.9', '4.10'] },
  { formType: 'backup_log', applicableCategories: ['4.12'] },
  { formType: 'termination_record', applicableCategories: ['1.8'] },
  { formType: 'awareness_material', applicableCategories: ['1.5', '1.6'] },
  { formType: 'compliance_document', applicableCategories: ['1.3', '1.4'] }
];

export const staticEvidenceControlsData = [
  { category: '1.2', description: 'Upload organizational charts, committee rosters, role descriptions' },
  { category: '3.2', description: 'Upload asset inventory photos, purchase receipts, equipment labels' },
  { category: '4.1', description: 'Upload signed policy documents, acknowledgment forms, distribution records' },
  { category: '4.5', description: 'Upload network diagrams, firewall configurations, security zone maps' },
  { category: '4.7', description: 'Upload encryption certificates, key management documentation, crypto policies' },
  { category: '4.12', description: 'Upload backup logs, recovery test results, backup schedules' },
  { category: '5.1', description: 'Upload photos of security perimeters, storage areas, environmental controls, delivery zones' },
  { category: '5.2', description: 'Upload photos of badge readers, cameras, biometric systems, access logs, visitor logs' }
];

export const templateOnlyControlsData = [
  { controlId: '1.1.1', reason: 'Strategy Requirements - Template-only control' },
  { controlId: '1.1.2', reason: 'Top Management Approval - Template-only control' },
  { controlId: '1.1.3', reason: 'Action Plan Implementation - Template-only control' },
  { controlId: '1.2.1', reason: 'Organization Requirements - Template-only control' },
  { controlId: '1.3.1', reason: 'Compliance Requirements - Template-only control' },
  { controlId: '1.4.1', reason: 'Audit Requirements - Template-only control' },
  { controlId: '1.4.2', reason: 'Audit Process - Template-only control' },
  { controlId: '1.5.1', reason: 'Training Requirements - Template-only control' },
  { controlId: '1.6.1', reason: 'Awareness Policy - Template-only control' },
  { controlId: '1.7.1', reason: 'Project Management Policy - Template-only control' },
  { controlId: '1.8.1', reason: 'HR Requirements - Template-only control' },
  { controlId: '2.1.1', reason: 'Asset Discovery Requirements - Template-only control' },
  { controlId: '2.2.1', reason: 'Asset Classification Requirements - Template-only control' },
  { controlId: '2.3.1', reason: 'BYOD Requirements - Template-only control' },
  { controlId: '2.4.1', reason: 'Acceptable Use Requirements - Template-only control' },
  { controlId: '2.5.1', reason: 'Asset Maintenance Requirements - Template-only control' },
  { controlId: '2.6.1', reason: 'Secure Disposal Requirements - Template-only control' },
  { controlId: '3.1.1', reason: 'Risk Assessment Requirements - Template-only control' },
  { controlId: '3.2.1', reason: 'Risk Treatment Requirements - Template-only control' },
  { controlId: '4.1.1', reason: 'Cryptography Requirements - Template-only control' },
  { controlId: '4.2.1', reason: 'Change Management Requirements - Template-only control' },
  { controlId: '4.3.1', reason: 'Vulnerability Management Requirements - Template-only control' },
  { controlId: '4.4.1', reason: 'Patch Management Requirements - Template-only control' }
];
