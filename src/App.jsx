import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, Menu, X, Printer, Download, Plus, LogOut, User, CheckCircle, Clock, AlertCircle, Trash2, Sparkles, Moon, Sun, Activity } from 'lucide-react';
import { useAuditStructure, useConfig } from './hooks/useConfig';
import { generateDocument } from './utils/documentTemplates';
import { authenticateUser } from './data/users';
import { createDocumentInstance, getDocumentInstances, signDocument, getAllDocumentInstances, revokeSignature, deleteDocumentInstance } from './data/documentStore';
import { saveCustomTemplate, getCustomTemplate, hasCustomTemplate } from './data/customTemplates';
import { editDocumentWithAI } from './utils/aiService';
import Login from './components/Login';
import DocumentViewer from './components/DocumentViewer';
import AIEditor from './components/AIEditor';
import TemplateEditor from './components/TemplateEditorNew';
import EvidenceForms from './components/EvidenceForms';
import ControlEvidenceView from './components/ControlEvidenceView';
import ErrorBoundary from './components/ErrorBoundary';
import ActivityLogViewer from './components/ActivityLogViewer';
import { useEvidenceCounts } from './hooks/useEvidenceCounts';
import { useActivityLog } from './hooks/useActivityLog';
import { hasEvidenceCapability } from './services/configAPI';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [selectedDocInstance, setSelectedDocInstance] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [expandedControls, setExpandedControls] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [documentInstances, setDocumentInstances] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiEditorOpen, setAiEditorOpen] = useState(false);
  const [currentDocumentContent, setCurrentDocumentContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showEvidenceForms, setShowEvidenceForms] = useState(false);
  const [viewMode, setViewMode] = useState('template'); // 'template' or 'evidence'
  const [showActivityLog, setShowActivityLog] = useState(false);
  const { evidenceCounts, refetch: refetchEvidenceCounts } = useEvidenceCounts();
  const activityLog = useActivityLog(currentUser);
  
  // Get audit structure from database
  const { auditStructure, loading: structureLoading, error: structureError } = useAuditStructure();
  const { config, loading: configLoading, error: configError } = useConfig();
  
  // Debug logging
  console.log('App Debug:', {
    auditStructure: auditStructure ? Object.keys(auditStructure).length + ' categories' : 'null',
    structureLoading,
    structureError,
    config: config ? 'loaded' : 'null',
    configLoading,
    configError
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubcategory = (subcategory) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategory]: !prev[subcategory]
    }));
  };

  const toggleControl = (controlId) => {
    setExpandedControls(prev => ({
      ...prev,
      [controlId]: !prev[controlId]
    }));
  };

  const handleLogin = (username, password) => {
    const user = authenticateUser(username, password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedControl(null);
    setSelectedDocInstance(null);
  };

  const handleGenerateDocument = (category, subcategory, item) => {
    if (!currentUser || !currentUser.permissions.includes('generate_documents')) {
      alert('You do not have permission to generate documents');
      return;
    }

    const newDoc = createDocumentInstance(category, subcategory, item, currentUser.id);
    setDocumentInstances(getAllDocumentInstances());
    setSelectedControl({ category, subcategory, item });
    setSelectedDocInstance(newDoc);
    setRefreshKey(prev => prev + 1);
    
    // Log activity
    activityLog.logCreate('document', newDoc.id, `${item.id} - ${item.name}`, {
      category,
      subcategory,
      controlId: item.id,
      version: newDoc.version
    });
    
    // Auto-expand the control to show the new document
    toggleControl(item.id);
  };

  const handleSelectControl = (category, subcategory, item) => {
    setSelectedControl({ category, subcategory, item });
    setSelectedDocInstance(null);
    setEditMode(true); // Open in edit mode
    setShowEvidenceForms(false); // Close evidence forms view
    setViewMode('template'); // Reset to template view
    // Generate document content for editing
    const content = generateDocument(category, subcategory, item);
    setCurrentDocumentContent(content);
  };

  const handleSelectDocInstance = (category, subcategory, item, docInstance) => {
    setSelectedControl({ category, subcategory, item });
    setSelectedDocInstance(docInstance);
    setEditMode(false); // View mode for instances
    setShowEvidenceForms(false); // Close evidence forms view
    setViewMode('template'); // Reset to template view
    // Generate document content for viewing
    const content = generateDocument(category, subcategory, item);
    setCurrentDocumentContent(content);
  };

  const handleCloseEditor = () => {
    setEditMode(false);
    setSelectedControl(null);
    setSelectedDocInstance(null);
  };

  const handleOpenAIEditor = () => {
    if (!selectedControl) return;
    
    // Get the current document content (custom template if exists, otherwise default)
    const customTemplate = getCustomTemplate(selectedControl.item.id);
    const content = customTemplate ? customTemplate.content : generateDocument(
      selectedControl.category,
      selectedControl.subcategory,
      selectedControl.item
    );
    
    setCurrentDocumentContent(content);
    setAiEditorOpen(true);
  };

  const handleSaveTemplate = (modifiedContent) => {
    if (!selectedControl) return;
    
    // Extract content before signature sections (look for "Document Approval" or signature-box)
    let contentOnly = modifiedContent;
    
    // Find where signature section starts
    const signatureStart = modifiedContent.indexOf('<div class="mt-12">');
    if (signatureStart !== -1) {
      contentOnly = modifiedContent.substring(0, signatureStart);
    } else {
      // Fallback: look for "Document Approval" heading
      const approvalIndex = modifiedContent.indexOf('<h2>Document Approval</h2>');
      if (approvalIndex !== -1) {
        contentOnly = modifiedContent.substring(0, approvalIndex);
      }
    }
    
    saveCustomTemplate(selectedControl.item.id, contentOnly);
    setRefreshKey(prev => prev + 1);
    
    // Refresh the current view with new template
    const content = generateDocument(
      selectedControl.category,
      selectedControl.subcategory,
      selectedControl.item
    );
    setCurrentDocumentContent(content);
  };

  const handleModifyWithAI = async (content, instructions, controlInfo) => {
    try {
      // Send FULL document content to AI (it will avoid modifying signature sections)
      const result = await editDocumentWithAI(content, instructions, controlInfo);
      return result;
    } catch (error) {
      return {
        success: false,
        content: content,
        message: error.message
      };
    }
  };

  const handleDeleteDocument = (docId) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    const success = deleteDocumentInstance(docId);
    if (success) {
      // Clear selection if deleted document was selected
      if (selectedDocInstance && selectedDocInstance.id === docId) {
        setSelectedDocInstance(null);
      }
      
      setDocumentInstances(getAllDocumentInstances());
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleSign = (role) => {
    if (!selectedDocInstance || !currentUser) return;

    const updatedDoc = signDocument(selectedDocInstance.id, role, currentUser);
    if (updatedDoc) {
      setSelectedDocInstance(updatedDoc);
      setDocumentInstances(getAllDocumentInstances());
      setRefreshKey(prev => prev + 1);
      
      // Log activity
      activityLog.logSign('document', selectedDocInstance.id, selectedDocInstance.title, role, {
        controlId: selectedDocInstance.controlId,
        version: selectedDocInstance.version
      });
    }
  };

  const handleRevokeSignature = (role) => {
    if (!selectedDocInstance || !currentUser) return;

    if (!confirm(`Are you sure you want to revoke the "${role}" signature? This will also revoke all subsequent signatures.`)) {
      return;
    }

    const updatedDoc = revokeSignature(selectedDocInstance.id, role);
    if (updatedDoc) {
      setSelectedDocInstance(updatedDoc);
      setDocumentInstances(getAllDocumentInstances());
      setRefreshKey(prev => prev + 1);
      
      // Log activity
      activityLog.logRevokeSignature('document', selectedDocInstance.id, selectedDocInstance.title, role, {
        controlId: selectedDocInstance.controlId,
        version: selectedDocInstance.version
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!selectedControl) return;
    
    const doc = generateDocument(selectedControl.category, selectedControl.subcategory, selectedControl.item);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>L3 Company - ${selectedControl.item.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #1e40af; border-bottom: 4px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            h3 { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
            th { background-color: #dbeafe; font-weight: bold; }
            .signature-box { border: 2px solid #ccc; border-radius: 8px; padding: 24px; margin: 20px 0; background-color: #f9fafb; }
            .stamp-box { border: 2px dashed #93c5fd; border-radius: 8px; padding: 32px; text-align: center; background-color: #eff6ff; margin: 20px 0; }
            .document-info { background: linear-gradient(to right, #eff6ff, #dbeafe); padding: 24px; border-radius: 8px; margin: 30px 0; }
          </style>
        </head>
        <body>
          ${doc}
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `L3-${selectedControl.item.id.replace(/\./g, '-')}-${selectedControl.item.name.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={14} style={{color: darkMode ? '#89d185' : '#10b981'}} />;
      case 'in_progress':
        return <Clock size={14} style={{color: darkMode ? '#cca700' : '#f59e0b'}} />;
      default:
        return <AlertCircle size={14} style={{color: darkMode ? '#969696' : '#6b7280'}} />;
    }
  };

  // Filter audit structure based on search term
  const getFilteredStructure = () => {
    // Return empty object if audit structure is still loading
    if (!auditStructure || structureLoading) {
      return {};
    }
    
    if (!searchTerm.trim()) {
      return auditStructure;
    }

    const term = searchTerm.toLowerCase();
    const filtered = {};

    Object.entries(auditStructure).forEach(([category, subcategories]) => {
      const filteredSubcategories = {};
      
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        const filteredItems = items.filter(item => 
          item.id.toLowerCase().includes(term) ||
          item.name.toLowerCase().includes(term) ||
          category.toLowerCase().includes(term) ||
          subcategory.toLowerCase().includes(term)
        );

        if (filteredItems.length > 0) {
          filteredSubcategories[subcategory] = filteredItems;
        }
      });

      if (Object.keys(filteredSubcategories).length > 0) {
        filtered[category] = filteredSubcategories;
      }
    });

    return filtered;
  };

  const filteredStructure = getFilteredStructure();

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Show error if config fails to load
  if (config && config.error) {
    return (
      <div className="flex items-center justify-center h-screen" style={{backgroundColor: darkMode ? '#1e1e1e' : '#f8fafc'}}>
        <div className="text-center p-8 rounded-lg" style={{backgroundColor: darkMode ? '#252526' : '#ffffff', border: '1px solid ' + (darkMode ? '#3e3e42' : '#e2e8f0')}}>
          <AlertCircle size={48} className="mx-auto mb-4" style={{color: '#ef4444'}} />
          <h2 className="text-xl font-bold mb-2" style={{color: darkMode ? '#e5e7eb' : '#1e293b'}}>Configuration Error</h2>
          <p className="text-sm mb-4" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>Failed to load system configuration</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded text-white"
            style={{backgroundColor: '#2563eb'}}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`} style={{backgroundColor: (darkMode ? '#1e1e1e' : '#f8fafc'), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden`} style={{backgroundColor: (darkMode ? '#252526' : '#ffffff'), borderRight: (darkMode ? '1px solid #3e3e42' : '1px solid #e2e8f0'), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-white p-5" style={{background: darkMode ? 'linear-gradient(135deg, #007acc 0%, #005a9e 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center shadow-md" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ffffff',
                borderRadius: '6px'
              }}>
                <span className="font-bold" style={{fontSize: '18px', color: (darkMode ? '#007acc' : '#2563eb')}}>L3</span>
              </div>
              <div className="flex-1">
                <h1 className="font-bold" style={{fontSize: '17px', color: '#ffffff', letterSpacing: '0.3px'}}>CST Audit System</h1>
                <p style={{fontSize: '11px', color: 'rgba(255,255,255,0.85)', fontWeight: '500'}}>Documentation & Compliance Manager</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded transition-colors"
                style={{color: '#ffffff', backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)'}}
                title="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded transition-colors"
                style={{color: '#ffffff'}}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search controls, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 focus:outline-none transition-all"
                style={{
                  fontSize: '13px',
                  backgroundColor: darkMode ? 'rgba(60,60,60,0.8)' : 'rgba(255, 255, 255, 0.25)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.3)',
                  color: darkMode ? '#e5e7eb' : '#ffffff',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>

          {/* Tree Navigation */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {structureLoading ? (
              <div className="flex items-center justify-center p-8" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{borderColor: darkMode ? '#007acc' : '#2563eb'}}></div>
                  <p className="text-sm">Loading audit structure...</p>
                </div>
              </div>
            ) : structureError ? (
              <div className="flex items-center justify-center p-8" style={{color: darkMode ? '#ef4444' : '#dc2626'}}>
                <div className="text-center">
                  <p className="text-sm font-medium">Error loading data</p>
                  <p className="text-xs mt-1">{structureError}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-3 py-1 text-xs rounded"
                    style={{backgroundColor: darkMode ? '#374151' : '#f3f4f6', color: darkMode ? '#f3f4f6' : '#374151'}}
                  >
                    Reload
                  </button>
                </div>
              </div>
            ) : (!auditStructure || Object.keys(auditStructure).length === 0) ? (
              <div className="flex items-center justify-center p-8" style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                <div className="text-center">
                  <p className="text-sm font-medium">No data available</p>
                  <p className="text-xs mt-1">Database may need migration</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-3 py-1 text-xs rounded"
                    style={{backgroundColor: darkMode ? '#374151' : '#f3f4f6', color: darkMode ? '#f3f4f6' : '#374151'}}
                  >
                    Reload
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(filteredStructure).map(([category, subcategories]) => (
                <div key={category} className="border overflow-hidden" style={{borderColor: (darkMode ? '#3e3e42' : '#e5e7eb'), borderRadius: '2px'}}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 p-3 transition-colors hover:opacity-90"
                    style={{backgroundColor: (darkMode ? '#094771' : '#eff6ff'), color: (darkMode ? '#cccccc' : '#1e3a8a')}}
                  >
                    <span className="font-bold" style={{fontSize: '14px', color: (darkMode ? '#cccccc' : '#2563eb')}}>
                      {expandedCategories[category] ? '−' : '+'}
                    </span>
                    <span className="font-semibold text-sm flex-1 text-left">{category}</span>
                  </button>

                  {expandedCategories[category] && (
                    <div style={{backgroundColor: (darkMode ? '#252526' : '#ffffff')}}>
                      {Object.entries(subcategories).map(([subcategory, items]) => (
                        <div key={subcategory} style={{borderTop: (darkMode ? '1px solid #3e3e42' : '1px solid #e5e7eb')}}>
                          <button
                            onClick={() => toggleSubcategory(`${category}-${subcategory}`)}
                            className="w-full flex items-center gap-2 p-2.5 pl-8 transition-colors hover:opacity-90"
                            style={{backgroundColor: (darkMode ? '#2a2d2e' : '#f9fafb'), color: (darkMode ? '#cccccc' : '#374151')}}
                          >
                            <span style={{color: (darkMode ? '#969696' : '#4b5563'), fontSize: '13px', fontWeight: 'bold'}}>
                              {expandedSubcategories[`${category}-${subcategory}`] ? '−' : '+'}
                            </span>
                            <span className="font-medium text-sm flex-1 text-left">{subcategory}</span>
                          </button>

                          {expandedSubcategories[`${category}-${subcategory}`] && (
                            <div style={{backgroundColor: (darkMode ? '#1e1e1e' : '#f9fafb')}}>
                              {items.map((item) => {
                                const instances = getDocumentInstances(item.id);
                                const isExpanded = expandedControls[item.id];
                                const hasDocuments = instances.length > 0;
                                const customTemplate = hasCustomTemplate(item.id);
                                const hasPending = instances.some(doc => doc.status !== 'completed');
                                const hasCompleted = instances.some(doc => doc.status === 'completed');
                                const evidenceCount = evidenceCounts[item.id] || 0;
                                const needsEvidence = config ? hasEvidenceCapability(
                                  config.templateOnlyControls,
                                  config.evidenceMappings,
                                  config.staticEvidenceControls,
                                  item.id
                                ) : false;
                                
                                let titleColor = darkMode ? '#cccccc' : '#374151';
                                if (hasCompleted) titleColor = darkMode ? '#89d185' : '#10b981';
                                else if (hasPending) titleColor = darkMode ? '#cca700' : '#f59e0b';
                                
                                const itemBorderColor = darkMode ? '#3e3e42' : '#f3f4f6';
                                const itemBgColor = darkMode ? '#252526' : '#ffffff';
                                const itemHoverBg = darkMode ? '#2a2d2e' : '#f9fafb';
                                
                                return (
                                  <div key={item.id} style={{borderBottom: '1px solid ' + itemBorderColor}}>
                                    {/* Control Header */}
                                    <div className="flex items-center pl-12 pr-3 py-2 transition-colors group" style={{backgroundColor: itemBgColor}}>
                                      <button
                                        onClick={() => toggleControl(item.id)}
                                        className="flex items-center gap-1 min-w-0 mr-2 hover:opacity-70 transition-opacity"
                                      >
                                        <span style={{fontSize: '12px', fontWeight: 'bold', color: (darkMode ? '#969696' : '#6b7280')}}>
                                          {isExpanded ? '−' : '+'}
                                        </span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleSelectControl(category, subcategory, item)}
                                        className="flex-1 min-w-0 text-left flex items-center gap-2 p-1.5 transition-colors"
                                        style={{backgroundColor: 'transparent'}}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = itemHoverBg}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        title="Click to edit template"
                                      >
                                        <FileText size={13} className="flex-shrink-0" style={{color: hasDocuments ? (darkMode ? '#89d185' : '#10b981') : (darkMode ? '#007acc' : '#2563eb')}} />
                                        <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                          <span className="font-semibold" style={{fontSize: '11px', color: (darkMode ? '#cccccc' : '#111827')}}>{item.id}</span>
                                          {customTemplate && (
                                            <Sparkles size={9} style={{color: darkMode ? '#c586c0' : '#9333ea'}} title="Custom AI-modified template" />
                                          )}
                                          <span style={{fontSize: '10px', color: (darkMode ? '#6a6a6a' : '#9ca3af')}}>•</span>
                                          <span className="font-normal break-words text-left" style={{fontSize: '11px', color: titleColor}}>{item.name}</span>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                                          {instances.length > 0 && (
                                            <span className="font-medium" style={{fontSize: '10px', color: (darkMode ? '#9ca3af' : '#6b7280')}} title="Document instances">
                                              📄 {instances.length}
                                            </span>
                                          )}
                                          {needsEvidence && (
                                            <span 
                                              className="font-medium px-2 py-0.5 rounded-full" 
                                              style={{
                                                fontSize: '10px', 
                                                backgroundColor: evidenceCount > 0 ? (darkMode ? '#89d185' : '#10b981') : (darkMode ? '#f48771' : '#ef4444'),
                                                color: darkMode ? '#1e1e1e' : '#ffffff'
                                              }}
                                              title={evidenceCount > 0 
                                                ? `${evidenceCount} evidence form${evidenceCount > 1 ? 's' : ''} submitted` 
                                                : 'No evidence submitted - Click to add'}
                                            >
                                              {evidenceCount > 0 ? `✓ ${evidenceCount}` : '!'} 📎
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    </div>

                                    {/* Document Instances */}
                                    {isExpanded && instances.length > 0 && (
                                      <div className="pl-16 pr-2 py-1" style={{backgroundColor: (darkMode ? '#1e1e1e' : '#f3f4f6')}}>
                                        {instances.map((docInstance) => {
                                          const isSelected = selectedDocInstance?.id === docInstance.id;
                                          return (
                                          <div
                                            key={docInstance.id}
                                            className="flex items-center gap-1 mb-1"
                                          >
                                            <button
                                              onClick={() => handleSelectDocInstance(category, subcategory, item, docInstance)}
                                              className="flex-1 flex items-center justify-between p-2 text-left transition-colors"
                                              style={{
                                                backgroundColor: isSelected ? (darkMode ? '#094771' : '#dbeafe') : (darkMode ? '#252526' : '#ffffff'),
                                                border: `1px solid ${isSelected ? (darkMode ? '#007acc' : '#3b82f6') : (darkMode ? '#3e3e42' : '#e5e7eb')}`,
                                                borderLeft: `4px solid ${
                                                  docInstance.status === 'completed' ? (darkMode ? '#89d185' : '#10b981') :
                                                  docInstance.status === 'in_progress' ? (darkMode ? '#cca700' : '#f59e0b') :
                                                  (darkMode ? '#6a6a6a' : '#9ca3af')
                                                }`,
                                                borderRadius: '2px'
                                              }}
                                            >
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                  {getStatusIcon(docInstance.status)}
                                                  <span className="text-xs font-medium" style={{color: darkMode ? '#cccccc' : '#111827'}}>{docInstance.id}</span>
                                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                                                    backgroundColor: darkMode ? '#094771' : '#dbeafe',
                                                    color: darkMode ? '#cccccc' : '#1e40af'
                                                  }}>
                                                    v{docInstance.version}
                                                  </span>
                                                </div>
                                                <div className="text-xs mt-0.5" style={{color: darkMode ? '#969696' : '#6b7280'}}>
                                                  {new Date(docInstance.createdAt).toLocaleDateString()}
                                                  {docInstance.revisionNote && ` • ${docInstance.revisionNote}`}
                                                </div>
                                              </div>
                                              <div className="text-xs">
                                                {docInstance.status === 'completed' && (
                                                  <span className="px-2 py-0.5 rounded-full font-medium" style={{
                                                    backgroundColor: darkMode ? '#2d4a2d' : '#d1fae5',
                                                    color: darkMode ? '#89d185' : '#065f46'
                                                  }}>
                                                    ✓
                                                  </span>
                                                )}
                                                {docInstance.status === 'in_progress' && (
                                                  <span className="px-2 py-0.5 rounded-full font-medium" style={{
                                                    backgroundColor: darkMode ? '#4a3d2d' : '#fef3c7',
                                                    color: darkMode ? '#cca700' : '#92400e'
                                                  }}>
                                                    ●
                                                  </span>
                                                )}
                                                {docInstance.status === 'pending' && (
                                                  <span className="px-2 py-0.5 rounded-full font-medium" style={{
                                                    backgroundColor: darkMode ? '#3c3c3c' : '#f3f4f6',
                                                    color: darkMode ? '#969696' : '#374151'
                                                  }}>
                                                    ○
                                                  </span>
                                                )}
                                              </div>
                                            </button>
                                            
                                            {/* Delete Button */}
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteDocument(docInstance.id);
                                              }}
                                              className="p-1.5 rounded transition-colors flex-shrink-0"
                                              style={{backgroundColor: darkMode ? '#f48771' : '#dc2626', color: darkMode ? '#1e1e1e' : '#ffffff'}}
                                              title="Delete Document"
                                            >
                                              <Trash2 size={12} />
                                            </button>
                                          </div>
                                        );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Only show for document instances (view mode) */}
        {!editMode && (
          <div className="shadow-sm p-4 flex items-center justify-between no-print" style={{
            backgroundColor: darkMode ? '#252526' : '#ffffff',
            borderBottom: `1px solid ${darkMode ? '#3e3e42' : '#e5e7eb'}`
          }}>
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded transition-colors"
                  style={{
                    color: darkMode ? '#cccccc' : '#6b7280',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#2a2d2e' : '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Menu size={24} />
                </button>
              )}
              {selectedControl && selectedDocInstance && (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold" style={{color: darkMode ? '#cccccc' : '#111827'}}>
                      {selectedControl.item.id} - {selectedControl.item.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm" style={{color: darkMode ? '#969696' : '#6b7280'}}>
                      {selectedControl.category}
                    </p>
                    <span style={{color: darkMode ? '#6a6a6a' : '#d1d5db'}}>•</span>
                    <p className="text-sm font-medium flex items-center gap-1" style={{color: darkMode ? '#007acc' : '#2563eb'}}>
                      Document No. {selectedDocInstance.id}
                    </p>
                    <span style={{color: darkMode ? '#6a6a6a' : '#d1d5db'}}>•</span>
                    <p className="text-sm" style={{color: darkMode ? '#969696' : '#6b7280'}}>
                      Version {selectedDocInstance.version}
                    </p>
                    {selectedDocInstance.status === 'completed' && (
                      <>
                        <span style={{color: darkMode ? '#6a6a6a' : '#d1d5db'}}>•</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                          backgroundColor: darkMode ? '#2d4a2d' : '#d1fae5',
                          color: darkMode ? '#89d185' : '#065f46'
                        }}>
                          ✓ Approved
                        </span>
                      </>
                    )}
                    {selectedDocInstance.status === 'in_progress' && (
                      <>
                        <span style={{color: darkMode ? '#6a6a6a' : '#d1d5db'}}>•</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                          backgroundColor: darkMode ? '#4a3d2d' : '#fef3c7',
                          color: darkMode ? '#cca700' : '#92400e'
                        }}>
                          ● In Progress
                        </span>
                      </>
                    )}
                    {selectedDocInstance.status === 'pending' && (
                      <>
                        <span style={{color: darkMode ? '#6a6a6a' : '#d1d5db'}}>•</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                          backgroundColor: darkMode ? '#3c3c3c' : '#f3f4f6',
                          color: darkMode ? '#969696' : '#374151'
                        }}>
                          ○ Pending
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {selectedControl && selectedDocInstance && (
                <>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                    style={{
                      backgroundColor: darkMode ? '#0e639c' : '#2563eb',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1177bb' : '#1e40af'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#0e639c' : '#2563eb'}
                  >
                    <Printer size={18} />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                    style={{
                      backgroundColor: darkMode ? '#0e639c' : '#2563eb',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#1177bb' : '#1e40af'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#0e639c' : '#2563eb'}
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Export PDF</span>
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setShowEvidenceForms(!showEvidenceForms);
                  setShowActivityLog(false);
                  if (!showEvidenceForms) {
                    setSelectedControl(null);
                    setSelectedDocInstance(null);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                style={{
                  backgroundColor: showEvidenceForms ? (darkMode ? '#0e639c' : '#2563eb') : (darkMode ? '#3c3c3c' : '#f3f4f6'),
                  color: showEvidenceForms ? '#ffffff' : (darkMode ? '#cccccc' : '#374151')
                }}
              >
                <FileText size={18} />
                <span className="hidden sm:inline">Evidence Forms</span>
              </button>
              <button
                onClick={() => {
                  setShowActivityLog(!showActivityLog);
                  setShowEvidenceForms(false);
                  if (!showActivityLog) {
                    setSelectedControl(null);
                    setSelectedDocInstance(null);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded transition-all"
                style={{
                  backgroundColor: showActivityLog ? (darkMode ? '#0e639c' : '#2563eb') : (darkMode ? '#3c3c3c' : '#f3f4f6'),
                  color: showActivityLog ? '#ffffff' : (darkMode ? '#cccccc' : '#374151')
                }}
              >
                <Activity size={18} />
                <span className="hidden sm:inline">Activity Log</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded transition-colors"
                style={{
                  color: darkMode ? '#cccccc' : '#374151',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#2a2d2e' : '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden" style={{backgroundColor: (darkMode ? '#1e1e1e' : '#f9fafb')}}>
          {showActivityLog ? (
            <ActivityLogViewer 
              darkMode={darkMode}
              userId={currentUser?.id}
            />
          ) : showEvidenceForms ? (
            <EvidenceForms 
              currentUser={currentUser} 
              darkMode={darkMode}
              onClose={() => setShowEvidenceForms(false)}
            />
          ) : selectedControl && viewMode === 'evidence' ? (
            <ErrorBoundary darkMode={darkMode}>
              <ControlEvidenceView 
                control={selectedControl} 
                currentUser={currentUser} 
                darkMode={darkMode}
                onBackToTemplate={() => setViewMode('template')}
              />
            </ErrorBoundary>
          ) : selectedControl && editMode ? (
            <TemplateEditor
              control={selectedControl}
              onSave={handleSaveTemplate}
              onClose={handleCloseEditor}
              currentTemplate={currentDocumentContent}
              onAIEdit={handleOpenAIEditor}
              onNewRequest={currentUser?.permissions.includes('generate_documents') ? () => handleGenerateDocument(selectedControl.category, selectedControl.subcategory, selectedControl.item) : null}
              darkMode={darkMode}
              onViewEvidence={() => setViewMode('evidence')}
              evidenceCount={evidenceCounts[selectedControl.item.id] || 0}
            />
          ) : selectedControl && selectedDocInstance ? (
            <div className="flex-1 overflow-y-auto h-full" style={{backgroundColor: (darkMode ? '#1a1a1a' : '#ffffff')}}>
              <DocumentViewer
                document={selectedControl}
                docInstance={selectedDocInstance}
                onSign={handleSign}
                onRevokeSignature={handleRevokeSignature}
                currentUser={currentUser}
                baseContent={generateDocument(selectedControl.category, selectedControl.subcategory, selectedControl.item)}
                darkMode={darkMode}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full" style={{backgroundColor: (darkMode ? '#1a1a1a' : '#ffffff')}}>
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4" style={{color: (darkMode ? '#4b5563' : '#d1d5db')}} />
                <h3 className="text-xl font-semibold mb-2" style={{color: (darkMode ? '#e5e7eb' : '#4b5563')}}>No Document Selected</h3>
                <p className="mb-6" style={{color: (darkMode ? '#9ca3af' : '#6b7280')}}>Select a control to edit its template, or select a document instance to view</p>
                
                <div className="mt-8 p-6 rounded-lg max-w-md mx-auto" style={{backgroundColor: (darkMode ? '#1e40af' : '#eff6ff')}}>
                  <h4 className="font-semibold mb-3" style={{color: (darkMode ? '#ffffff' : '#1e3a8a')}}>How to use:</h4>
                  <ol className="text-left text-sm space-y-2" style={{color: (darkMode ? '#dbeafe' : '#374151')}}>
                    <li>1. <strong>Click control title</strong> to edit template with AI and direct editing</li>
                    <li>2. <strong>Click "New Request" button</strong> in template editor to generate a new document instance</li>
                    <li>3. <strong>Click document instance</strong> to view and sign</li>
                    <li>4. Documents get signed by 3 parties: Prepared, Reviewed, Approved</li>
                    <li>5. After all signatures, document is stamped and completed</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Editor Modal */}
      <AIEditor
        isOpen={aiEditorOpen}
        onClose={() => setAiEditorOpen(false)}
        currentContent={currentDocumentContent}
        onSave={handleSaveTemplate}
        controlInfo={selectedControl ? {
          id: selectedControl.item.id,
          name: selectedControl.item.name,
          category: selectedControl.category
        } : {}}
        onModify={handleModifyWithAI}
      />
    </div>
  );
}

export default App;
