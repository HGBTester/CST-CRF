import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, Menu, X, Printer, Download, Plus, LogOut, User, CheckCircle, Clock, AlertCircle, Trash2, Sparkles, Moon, Sun } from 'lucide-react';
import { auditStructure } from './data/auditStructure';
import { generateDocument } from './utils/documentTemplates';
import { authenticateUser } from './data/users';
import { createDocumentInstance, getDocumentInstances, signDocument, getAllDocumentInstances, revokeSignature, deleteDocumentInstance } from './data/documentStore';
import { saveCustomTemplate, getCustomTemplate, hasCustomTemplate } from './data/customTemplates';
import { editDocumentWithAI } from './utils/aiService';
import Login from './components/Login';
import DocumentViewer from './components/DocumentViewer';
import AIEditor from './components/AIEditor';
import TemplateEditor from './components/TemplateEditorNew';

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
    
    // Auto-expand the control to show the new document
    toggleControl(item.id);
  };

  const handleSelectControl = (category, subcategory, item) => {
    setSelectedControl({ category, subcategory, item });
    setSelectedDocInstance(null);
    setEditMode(true); // Open in edit mode
    // Generate document content for editing
    const content = generateDocument(category, subcategory, item);
    setCurrentDocumentContent(content);
  };

  const handleSelectDocInstance = (category, subcategory, item, docInstance) => {
    setSelectedControl({ category, subcategory, item });
    setSelectedDocInstance(docInstance);
    setEditMode(false); // View mode for instances
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
        return <CheckCircle size={14} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={14} className="text-orange-600" />;
      default:
        return <AlertCircle size={14} className="text-gray-600" />;
    }
  };

  // Filter audit structure based on search term
  const getFilteredStructure = () => {
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

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`} style={{backgroundColor: (darkMode ? '#1a1a1a' : '#f8fafc'), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden`} style={{backgroundColor: (darkMode ? '#262626' : '#ffffff'), borderRight: (darkMode ? '1px solid #404040' : '1px solid #e2e8f0'), fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="text-white p-5" style={{backgroundColor: '#2563eb'}}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center shadow-md" style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#ffffff',
                borderRadius: '8px'
              }}>
                <span className="font-bold" style={{fontSize: '18px', color: '#2563eb'}}>L3</span>
              </div>
              <div className="flex-1">
                <h1 className="font-bold" style={{fontSize: '16px'}}>CST Audit System</h1>
                <p style={{fontSize: '12px', color: '#dbeafe'}}>Documentation Manager</p>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded transition-colors hover:bg-blue-600"
                style={{color: '#ffffff'}}
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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg focus:outline-none"
                style={{
                  fontSize: '13px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #3b82f6',
                  color: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Tree Navigation */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-2">
              {Object.entries(filteredStructure).map(([category, subcategories]) => (
                <div key={category} className="border rounded-lg overflow-hidden" style={{borderColor: (darkMode ? '#404040' : '#e5e7eb')}}>
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center gap-2 p-3 transition-colors"
                    style={{backgroundColor: (darkMode ? '#1e40af' : '#eff6ff'), color: (darkMode ? '#ffffff' : '#1e3a8a')}}
                  >
                    <span className="text-blue-600 font-bold" style={{fontSize: '16px'}}>
                      {expandedCategories[category] ? '−' : '+'}
                    </span>
                    <span className="font-semibold text-sm flex-1 text-left" style={{color: (darkMode ? '#ffffff' : '#1e3a8a')}}>{category}</span>
                  </button>

                  {expandedCategories[category] && (
                    <div style={{backgroundColor: (darkMode ? '#262626' : '#ffffff')}}>
                      {Object.entries(subcategories).map(([subcategory, items]) => (
                        <div key={subcategory} style={{borderTop: (darkMode ? '1px solid #404040' : '1px solid #e5e7eb')}}>
                          <button
                            onClick={() => toggleSubcategory(`${category}-${subcategory}`)}
                            className="w-full flex items-center gap-2 p-2.5 pl-8 transition-colors"
                            style={{backgroundColor: (darkMode ? '#1f1f1f' : '#f9fafb'), color: (darkMode ? '#d1d5db' : '#374151')}}
                          >
                            <span style={{color: (darkMode ? '#9ca3af' : '#4b5563'), fontSize: '14px', fontWeight: 'bold'}}>
                              {expandedSubcategories[`${category}-${subcategory}`] ? '−' : '+'}
                            </span>
                            <span className="font-medium text-sm flex-1 text-left">{subcategory}</span>
                          </button>

                          {expandedSubcategories[`${category}-${subcategory}`] && (
                            <div style={{backgroundColor: (darkMode ? '#1a1a1a' : '#f9fafb')}}>
                              {items.map((item) => {
                                const instances = getDocumentInstances(item.id);
                                const isExpanded = expandedControls[item.id];
                                const hasDocuments = instances.length > 0;
                                const customTemplate = hasCustomTemplate(item.id);
                                const hasPending = instances.some(doc => doc.status !== 'completed');
                                const hasCompleted = instances.some(doc => doc.status === 'completed');
                                
                                let titleColor = 'text-gray-700';
                                if (hasCompleted) titleColor = 'text-green-700';
                                else if (hasPending) titleColor = 'text-orange-600';
                                
                                const itemBorderColor = darkMode ? '#333333' : '#f3f4f6';
                                const itemBgColor = darkMode ? '#1f1f1f' : '#ffffff';
                                
                                return (
                                  <div key={item.id} style={{borderBottom: '1px solid ' + itemBorderColor}}>
                                    {/* Control Header */}
                                    <div className="flex items-center pl-12 pr-3 py-2 transition-colors group hover:opacity-90" style={{backgroundColor: itemBgColor}}>
                                      <button
                                        onClick={() => toggleControl(item.id)}
                                        className="flex items-center gap-1 min-w-0 mr-2"
                                      >
                                        <span className="text-gray-500" style={{fontSize: '12px', fontWeight: 'bold'}}>
                                          {isExpanded ? '−' : '+'}
                                        </span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleSelectControl(category, subcategory, item)}
                                        className="flex-1 min-w-0 text-left flex items-center gap-2 p-1.5 rounded transition-colors"
                                        style={{backgroundColor: 'transparent'}}
                                        title="Click to edit template"
                                      >
                                        <FileText size={13} className={`flex-shrink-0 ${hasDocuments ? 'text-green-600' : 'text-blue-500'}`} />
                                        <div className="flex-1 min-w-0 flex items-center gap-1.5">
                                          <span className="font-semibold" style={{fontSize: '11px', color: (darkMode ? '#e5e7eb' : '#111827')}}>{item.id}</span>
                                          {customTemplate && (
                                            <Sparkles size={9} className="text-purple-600" title="Custom AI-modified template" />
                                          )}
                                          <span style={{fontSize: '10px', color: (darkMode ? '#6b7280' : '#9ca3af')}}>•</span>
                                          <span className={`font-normal break-words text-left ${titleColor}`} style={{fontSize: '11px'}}>{item.name}</span>
                                        </div>
                                        {instances.length > 0 && (
                                          <span className="font-medium ml-auto flex-shrink-0" style={{fontSize: '10px', color: (darkMode ? '#9ca3af' : '#6b7280')}}>
                                            {instances.length}
                                          </span>
                                        )}
                                      </button>
                                    </div>

                                    {/* Document Instances */}
                                    {isExpanded && instances.length > 0 && (
                                      <div className="pl-16 pr-2 py-1" style={{backgroundColor: (darkMode ? '#0f0f0f' : '#f3f4f6')}}>
                                        {instances.map((docInstance) => (
                                          <div
                                            key={docInstance.id}
                                            className="flex items-center gap-1 mb-1"
                                          >
                                            <button
                                              onClick={() => handleSelectDocInstance(category, subcategory, item, docInstance)}
                                              className={`flex-1 flex items-center justify-between p-2 rounded text-left transition-colors ${
                                                selectedDocInstance?.id === docInstance.id
                                                  ? 'bg-blue-100 border border-blue-300'
                                                  : 'bg-white border border-gray-200 hover:bg-blue-50'
                                              } ${
                                                docInstance.status === 'completed' ? 'border-l-4 border-l-green-500' :
                                                docInstance.status === 'in_progress' ? 'border-l-4 border-l-orange-500' :
                                                'border-l-4 border-l-gray-400'
                                              }`}
                                            >
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                  {getStatusIcon(docInstance.status)}
                                                  <span className="text-xs font-medium text-gray-900">{docInstance.id}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                  {new Date(docInstance.createdAt).toLocaleDateString()}
                                                </div>
                                              </div>
                                              <div className="text-xs">
                                                {docInstance.status === 'completed' && (
                                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                                    ✓
                                                  </span>
                                                )}
                                                {docInstance.status === 'in_progress' && (
                                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                                                    ●
                                                  </span>
                                                )}
                                                {docInstance.status === 'pending' && (
                                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
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
                                              className="p-1.5 text-white rounded transition-colors flex-shrink-0"
                                              style={{backgroundColor: '#dc2626'}}
                                              title="Delete Document"
                                            >
                                              <Trash2 size={12} className="text-white" />
                                            </button>
                                          </div>
                                        ))}
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
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Only show for document instances (view mode) */}
        {!editMode && (
          <div className="bg-white shadow-sm p-4 flex items-center justify-between no-print border-b border-gray-200">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-600 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
              )}
              {selectedControl && selectedDocInstance && (
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedControl.item.id} - {selectedControl.item.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      {selectedControl.category}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                      Document No. {selectedDocInstance.id}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-600">
                      Version {selectedDocInstance.version}
                    </p>
                    {selectedDocInstance.status === 'completed' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          ✓ Approved
                        </span>
                      </>
                    )}
                    {selectedDocInstance.status === 'in_progress' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          ● In Progress
                        </span>
                      </>
                    )}
                    {selectedDocInstance.status === 'pending' && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
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
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Printer size={18} />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Export PDF</span>
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden" style={{backgroundColor: (darkMode ? '#1a1a1a' : '#f9fafb')}}>
          {selectedControl && editMode ? (
            <TemplateEditor
              control={selectedControl}
              onSave={handleSaveTemplate}
              onClose={handleCloseEditor}
              currentTemplate={currentDocumentContent}
              onAIEdit={handleOpenAIEditor}
              onNewRequest={currentUser?.permissions.includes('generate_documents') ? () => handleGenerateDocument(selectedControl.category, selectedControl.subcategory, selectedControl.item) : null}
              darkMode={darkMode}
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
