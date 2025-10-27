import React, { useState } from 'react';
import { Save, Sparkles, X, Plus, Trash2, Edit2, FileText } from 'lucide-react';
import { hasEvidenceCapability } from '../data/evidenceMapping';

function TemplateEditorNew({ control, onSave, onClose, currentTemplate, onAIEdit, onNewRequest, darkMode, onViewEvidence, evidenceCount }) {
  const showEvidenceTab = hasEvidenceCapability(control.item.id);
  // Parse the template into sections
  const [documentData, setDocumentData] = useState(() => parseTemplate(currentTemplate, control));
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    const newTemplate = generateTemplateHTML(documentData);
    onSave(newTemplate);
    setHasChanges(false);
  };

  const updateSection = (sectionKey, value) => {
    setDocumentData(prev => ({
      ...prev,
      [sectionKey]: value
    }));
    setHasChanges(true);
  };

  const updateTable = (tableKey, newRows) => {
    setDocumentData(prev => ({
      ...prev,
      tables: {
        ...prev.tables,
        [tableKey]: newRows
      }
    }));
    setHasChanges(true);
  };

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';
  const sectionBg = darkMode ? '#262626' : '#f8fafc';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{backgroundColor: bgColor}}>
      {/* Header */}
      <div className="border-b-2 px-6 py-4 flex items-center justify-between" style={{backgroundColor: bgColor, borderColor}}>
        <div>
          <h1 className="font-semibold" style={{fontSize: '24px', color: textColor}}>
            {control.item.id} - {control.item.name}
          </h1>
          <p className="mt-1" style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#64748b'}}>
            {control.category}
          </p>
          {onViewEvidence && showEvidenceTab && (
            <div className="flex items-center gap-2 mt-3">
              <button
                className="px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all"
                style={{
                  borderColor: '#3b82f6',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff'
                }}
              >
                📋 Template
              </button>
              <button
                onClick={onViewEvidence}
                className="px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all hover:border-blue-400"
                style={{
                  borderColor: darkMode ? '#404040' : '#e2e8f0',
                  backgroundColor: 'transparent',
                  color: textColor
                }}
              >
                <span className="flex items-center gap-2">
                  <FileText size={16} />
                  Evidence
                  {evidenceCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{backgroundColor: '#10b981', color: '#ffffff'}}>
                      {evidenceCount}
                    </span>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onNewRequest && (
            <button
              onClick={onNewRequest}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm hover:opacity-90"
              style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontSize: '14px'}}
              title="Create new revision of this policy document"
            >
              <Plus size={18} />
              <span>New Revision</span>
            </button>
          )}
          <button
            onClick={onAIEdit}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm"
            style={{background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', fontSize: '14px'}}
          >
            <Sparkles size={18} />
            <span>AI Edit</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm disabled:opacity-50"
            style={{backgroundColor: '#10b981', fontSize: '14px'}}
          >
            <Save size={18} />
            <span>Save</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{color: darkMode ? '#9ca3af' : '#64748b'}}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Edit Banner */}
      <div className="border-b px-6 py-3" style={{backgroundColor: darkMode ? '#1e40af' : '#eff6ff', borderColor}}>
        <div className="flex items-center gap-2" style={{color: darkMode ? '#dbeafe' : '#1e40af'}}>
          <Edit2 size={16} />
          <span style={{fontSize: '14px', fontWeight: '500'}}>Full Template Edit Mode - Click sections to edit</span>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto" style={{maxWidth: '900px'}}>
          {/* Header Section */}
          <DocumentHeader control={control} darkMode={darkMode} />
          
          {/* Editable Sections */}
          <EditableTextSection
            title="1. Purpose"
            value={documentData.purpose}
            onChange={(val) => updateSection('purpose', val)}
            darkMode={darkMode}
          />

          <EditableTextSection
            title="2. Scope"
            value={documentData.scope}
            onChange={(val) => updateSection('scope', val)}
            darkMode={darkMode}
          />

          <EditableListSection
            title="3. Regulatory Requirements"
            items={documentData.regulations}
            onChange={(val) => updateSection('regulations', val)}
            darkMode={darkMode}
          />

          <EditableTable
            title="4. Responsibilities"
            columns={['Role', 'Responsibility']}
            rows={documentData.tables.responsibilities}
            onChange={(rows) => updateTable('responsibilities', rows)}
            darkMode={darkMode}
          />

          <EditableTextSection
            title="5. Implementation Requirements - Core"
            value={documentData.implementation}
            onChange={(val) => updateSection('implementation', val)}
            darkMode={darkMode}
          />

          <EditableListSection
            title="5.2 Documentation Requirements"
            items={documentData.documentation}
            onChange={(val) => updateSection('documentation', val)}
            darkMode={darkMode}
          />

          <EditableTable
            title="6. Evidence Collection"
            columns={['Evidence Type', 'Description', 'Frequency']}
            rows={documentData.tables.evidence}
            onChange={(rows) => updateTable('evidence', rows)}
            darkMode={darkMode}
          />

          <EditableListSection
            title="7. Monitoring and Review"
            items={documentData.monitoring}
            onChange={(val) => updateSection('monitoring', val)}
            darkMode={darkMode}
          />

          <EditableListSection
            title="8. Continuous Improvement"
            items={documentData.improvement}
            onChange={(val) => updateSection('improvement', val)}
            darkMode={darkMode}
          />

          <EditableListSection
            title="9. Related Documents"
            items={documentData.relatedDocs}
            onChange={(val) => updateSection('relatedDocs', val)}
            darkMode={darkMode}
          />

          <EditableTable
            title="10. Version History"
            columns={['Version', 'Date', 'Changes', 'Author']}
            rows={documentData.tables.versions}
            onChange={(rows) => updateTable('versions', rows)}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function DocumentHeader({ control, darkMode }) {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#3b82f6' : '#2563eb';
  
  return (
    <div style={{paddingBottom: '20px', marginBottom: '30px', borderBottom: `4px solid ${borderColor}`}}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center text-white font-bold shadow-lg" 
             style={{width: '40px', height: '40px', backgroundColor: '#2563eb', borderRadius: '8px', fontSize: '18px'}}>
          L3
        </div>
        <div className="flex-1">
          <h2 className="font-bold" style={{fontSize: '24px', color: textColor}}>L3 Company</h2>
          <p style={{fontSize: '13px', color: darkMode ? '#9ca3af' : '#64748b'}}>Cybersecurity Documentation</p>
        </div>
        <div className="text-right">
          <p style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#64748b'}}>Document No.</p>
          <p className="font-bold" style={{fontSize: '18px', color: textColor}}>{control.item.id}</p>
          <p style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#64748b'}}>Version 1.0</p>
        </div>
      </div>

      <div className="text-white shadow-lg" 
           style={{background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', padding: '25px', borderRadius: '10px', marginBottom: '30px'}}>
        <p style={{fontSize: '13px', fontWeight: '500'}} className="mb-1">CST Control {control.item.id}</p>
        <h1 className="font-bold mb-2" style={{fontSize: '28px'}}>{control.item.name}</h1>
        <p style={{fontSize: '14px', opacity: '0.9'}}>{control.category}</p>
      </div>

      <div style={{backgroundColor: darkMode ? '#262626' : '#f8fafc', borderLeft: '4px solid #2563eb', padding: '20px', borderRadius: '5px'}}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-medium" style={{fontSize: '13px', color: darkMode ? '#9ca3af' : '#64748b'}}>Date Prepared:</p>
            <p style={{fontSize: '14px', color: textColor}}>{currentDate}</p>
          </div>
          <div>
            <p className="font-medium" style={{fontSize: '13px', color: darkMode ? '#9ca3af' : '#64748b'}}>Classification:</p>
            <p style={{fontSize: '14px', color: textColor}}>Confidential - Internal Use</p>
          </div>
          <div>
            <p className="font-medium" style={{fontSize: '13px', color: darkMode ? '#9ca3af' : '#64748b'}}>Compliance Level:</p>
            <p className="font-semibold" style={{fontSize: '14px', color: '#2563eb'}}>{control.item.level}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableTextSection({ title, value, onChange, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  return (
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-3" style={{borderBottom: `2px solid ${borderColor}`, paddingBottom: '8px'}}>
        <h2 className="font-semibold" style={{fontSize: '20px', color: textColor}}>{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded-lg text-sm transition-all"
            style={{backgroundColor: darkMode ? '#3b82f6' : '#dbeafe', color: darkMode ? '#ffffff' : '#1e40af'}}
          >
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            className="w-full p-4 rounded-lg resize-none"
            style={{
              backgroundColor: darkMode ? '#262626' : '#ffffff',
              border: `2px solid #2563eb`,
              color: textColor,
              fontSize: '15px',
              lineHeight: '1.8'
            }}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {onChange(localValue); setIsEditing(false);}}
              className="px-4 py-2 text-white rounded-lg"
              style={{backgroundColor: '#10b981', fontSize: '14px'}}
            >
              Save
            </button>
            <button
              onClick={() => {setLocalValue(value); setIsEditing(false);}}
              className="px-4 py-2 rounded-lg"
              style={{backgroundColor: darkMode ? '#404040' : '#e2e8f0', color: darkMode ? '#e5e7eb' : '#475569', fontSize: '14px'}}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p style={{color: darkMode ? '#d1d5db' : '#475569', fontSize: '15px', lineHeight: '1.8'}}>{value}</p>
      )}
    </div>
  );
}

function EditableListSection({ title, items, onChange, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localItems, setLocalItems] = useState(items);
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  return (
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-3" style={{borderBottom: `2px solid ${borderColor}`, paddingBottom: '8px'}}>
        <h2 className="font-semibold" style={{fontSize: '20px', color: textColor}}>{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded-lg text-sm transition-all"
            style={{backgroundColor: darkMode ? '#3b82f6' : '#dbeafe', color: darkMode ? '#ffffff' : '#1e40af'}}
          >
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          {localItems.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const newItems = [...localItems];
                  newItems[idx] = e.target.value;
                  setLocalItems(newItems);
                }}
                className="flex-1 p-2 rounded"
                style={{backgroundColor: darkMode ? '#262626' : '#ffffff', border: `1px solid ${borderColor}`, color: textColor}}
              />
              <button
                onClick={() => setLocalItems(localItems.filter((_, i) => i !== idx))}
                className="p-2 rounded"
                style={{backgroundColor: '#dc2626', color: '#ffffff'}}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setLocalItems([...localItems, ''])}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{backgroundColor: darkMode ? '#3b82f6' : '#2563eb', color: '#ffffff'}}
          >
            <Plus size={14} /> Add Item
          </button>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {onChange(localItems); setIsEditing(false);}}
              className="px-4 py-2 text-white rounded-lg"
              style={{backgroundColor: '#10b981'}}
            >
              Save
            </button>
            <button
              onClick={() => {setLocalItems(items); setIsEditing(false);}}
              className="px-4 py-2 rounded-lg"
              style={{backgroundColor: darkMode ? '#404040' : '#e2e8f0', color: darkMode ? '#e5e7eb' : '#475569'}}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {items.map((item, idx) => (
            <li key={idx} style={{color: darkMode ? '#d1d5db' : '#475569', fontSize: '15px'}}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditableTable({ title, columns, rows, onChange, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [localRows, setLocalRows] = useState(rows);
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';
  const tableBg = darkMode ? '#262626' : '#ffffff';
  const headerBg = darkMode ? '#1e40af' : '#2563eb';

  const addRow = () => {
    const newRow = columns.reduce((acc, col) => ({...acc, [col.toLowerCase().replace(/\s+/g, '_')]: ''}), {});
    setLocalRows([...localRows, newRow]);
  };

  const deleteRow = (idx) => {
    setLocalRows(localRows.filter((_, i) => i !== idx));
  };

  const updateCell = (rowIdx, key, value) => {
    const newRows = [...localRows];
    newRows[rowIdx][key] = value;
    setLocalRows(newRows);
  };

  return (
    <div className="mb-8 group">
      <div className="flex items-center justify-between mb-3" style={{borderBottom: `2px solid ${borderColor}`, paddingBottom: '8px'}}>
        <h2 className="font-semibold" style={{fontSize: '20px', color: textColor}}>{title}</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded-lg text-sm transition-all"
            style={{backgroundColor: darkMode ? '#3b82f6' : '#dbeafe', color: darkMode ? '#ffffff' : '#1e40af'}}
          >
            Edit
          </button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg" style={{border: `1px solid ${borderColor}`}}>
            <table className="w-full" style={{borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: headerBg}}>
                  {columns.map((col, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-white font-semibold" style={{fontSize: '14px'}}>
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-white" style={{width: '50px'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {localRows.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{borderBottom: `1px solid ${borderColor}`, backgroundColor: tableBg}}>
                    {columns.map((col, colIdx) => {
                      const key = col.toLowerCase().replace(/\s+/g, '_');
                      return (
                        <td key={colIdx} className="px-4 py-2">
                          <input
                            value={row[key] || ''}
                            onChange={(e) => updateCell(rowIdx, key, e.target.value)}
                            className="w-full p-2 rounded"
                            style={{
                              backgroundColor: darkMode ? '#1a1a1a' : '#f9fafb',
                              border: `1px solid ${borderColor}`,
                              color: textColor,
                              fontSize: '14px'
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => deleteRow(rowIdx)}
                        className="p-1.5 rounded"
                        style={{backgroundColor: '#dc2626', color: '#ffffff'}}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
            style={{backgroundColor: darkMode ? '#3b82f6' : '#2563eb', color: '#ffffff'}}
          >
            <Plus size={16} /> Add Row
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {onChange(localRows); setIsEditing(false);}}
              className="px-4 py-2 text-white rounded-lg"
              style={{backgroundColor: '#10b981'}}
            >
              Save
            </button>
            <button
              onClick={() => {setLocalRows(rows); setIsEditing(false);}}
              className="px-4 py-2 rounded-lg"
              style={{backgroundColor: darkMode ? '#404040' : '#e2e8f0', color: darkMode ? '#e5e7eb' : '#475569'}}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg" style={{border: `1px solid ${borderColor}`}}>
          <table className="w-full" style={{borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{backgroundColor: headerBg}}>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-white font-semibold" style={{fontSize: '14px'}}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} style={{borderBottom: `1px solid ${borderColor}`, backgroundColor: tableBg}}>
                  {columns.map((col, colIdx) => {
                    const key = col.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <td key={colIdx} className="px-4 py-3" style={{color: darkMode ? '#d1d5db' : '#475569', fontSize: '14px'}}>
                        {row[key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Parse template HTML into structured data
function parseTemplate(html, control) {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return {
    purpose: `This document outlines the requirements and procedures for ${control.item.name} as part of L3 Company's CST-CRF compliance program.`,
    scope: `This document applies to all information assets, systems, personnel, and processes within L3 Company that are relevant to ${control.subcategory?.toLowerCase() || 'cybersecurity'}.`,
    regulations: [
      'CST-CRF (Communications and Information Technology Commission - Cybersecurity Regulatory Framework)',
      `Compliance Level: ${control.item.level}`,
      'National Cybersecurity Authority (NCA) Essential Controls',
      'Relevant Saudi Arabian cybersecurity regulations'
    ],
    implementation: 'Document and define clear requirements. Obtain top management approval before implementation. Implement appropriate technical and administrative controls. Maintain evidence of implementation and effectiveness. Integrate with existing cybersecurity processes.',
    documentation: [
      'Policies and procedures',
      'Implementation evidence (screenshots, logs, configurations)',
      'Training records and attendance sheets',
      'Audit reports and compliance assessments',
      'Incident reports and lessons learned'
    ],
    monitoring: [
      'Compliance rate with requirements',
      'Number of non-conformities identified',
      'Time to remediate identified gaps',
      'Training completion rates'
    ],
    improvement: [
      'Regular effectiveness assessments',
      'Incorporation of lessons learned from incidents',
      'Updates based on regulatory changes',
      'Feedback from internal and external audits',
      'Industry best practices adoption'
    ],
    relatedDocs: [
      'L3 Cybersecurity Strategy',
      'L3 Information Security Policy',
      'L3 Risk Management Framework',
      'L3 Incident Response Plan',
      'Relevant CST-CRF control documents'
    ],
    tables: {
      responsibilities: [
        {role: 'Chief Executive Officer (CEO)', responsibility: 'Overall accountability and final approval'},
        {role: 'Chief Information Security Officer (CISO)', responsibility: 'Oversight and review of implementation'},
        {role: 'Cybersecurity Manager', responsibility: 'Document preparation and implementation coordination'},
        {role: 'Department Heads', responsibility: 'Ensure compliance within their departments'},
        {role: 'All Personnel', responsibility: 'Adhere to requirements and report non-compliance'}
      ],
      evidence: [
        {evidence_type: 'Approved Documents', description: 'Policies, procedures, and requirements with signatures and stamps', frequency: 'Upon creation/update'},
        {evidence_type: 'Implementation Evidence', description: 'Screenshots, configurations, system logs', frequency: 'Ongoing'},
        {evidence_type: 'Review Records', description: 'Meeting minutes, review reports, audit findings', frequency: 'As per schedule'},
        {evidence_type: 'Training Records', description: 'Attendance sheets, certificates, test results', frequency: 'Per training session'}
      ],
      versions: [
        {version: '1.0', date: currentDate, changes: 'Initial document creation', author: 'Cybersecurity Team'}
      ]
    }
  };
}

// Generate HTML from structured data
function generateTemplateHTML(data) {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `
    <div class="document-content">
      <h2>1. Purpose</h2>
      <p>${data.purpose}</p>

      <h2>2. Scope</h2>
      <p>${data.scope}</p>

      <h2>3. Regulatory Requirements</h2>
      <ul>
        ${data.regulations.map(item => `<li>${item}</li>`).join('\n        ')}
      </ul>

      <h2>4. Responsibilities</h2>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          ${data.tables.responsibilities.map(row => `
          <tr>
            <td>${row.role}</td>
            <td>${row.responsibility}</td>
          </tr>`).join('\n        ')}
        </tbody>
      </table>

      <h2>5. Implementation Requirements</h2>
      <p>${data.implementation}</p>

      <h3>5.2 Documentation Requirements</h3>
      <ul>
        ${data.documentation.map(item => `<li>${item}</li>`).join('\n        ')}
      </ul>

      <h2>6. Evidence Collection</h2>
      <table>
        <thead>
          <tr>
            <th>Evidence Type</th>
            <th>Description</th>
            <th>Frequency</th>
          </tr>
        </thead>
        <tbody>
          ${data.tables.evidence.map(row => `
          <tr>
            <td>${row.evidence_type}</td>
            <td>${row.description}</td>
            <td>${row.frequency}</td>
          </tr>`).join('\n        ')}
        </tbody>
      </table>

      <h2>7. Monitoring and Review</h2>
      <ul>
        ${data.monitoring.map(item => `<li>${item}</li>`).join('\n        ')}
      </ul>

      <h2>8. Continuous Improvement</h2>
      <ul>
        ${data.improvement.map(item => `<li>${item}</li>`).join('\n        ')}
      </ul>

      <h2>9. Related Documents</h2>
      <ul>
        ${data.relatedDocs.map(item => `<li>${item}</li>`).join('\n        ')}
      </ul>

      <h2>10. Version History</h2>
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Date</th>
            <th>Changes</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          ${data.tables.versions.map(row => `
          <tr>
            <td>${row.version}</td>
            <td>${row.date}</td>
            <td>${row.changes}</td>
            <td>${row.author}</td>
          </tr>`).join('\n        ')}
        </tbody>
      </table>
    </div>
  `;
}

export default TemplateEditorNew;
