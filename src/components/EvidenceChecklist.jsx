import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Upload, FileText, Trash2, Download, AlertCircle, FormInput, Link2, Plus, X } from 'lucide-react';
import { evidenceChecklistAPI } from '../services/evidenceChecklistAPI';
import { useEvidenceRequirements, useApplicableFormTypes, useFormTypes } from '../hooks/useConfig';
import FormBuilder from './forms/FormBuilder';

function EvidenceChecklist({ control, currentUser, darkMode }) {
  const [checklistItems, setChecklistItems] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(null);
  const [showFormOptions, setShowFormOptions] = useState(null);
  const [availableForms, setAvailableForms] = useState([]);
  const [showFormBuilder, setShowFormBuilder] = useState(null);
  const [selectedFormType, setSelectedFormType] = useState('');
  const [showLinkFormDialog, setShowLinkFormDialog] = useState(null);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  // Get configuration from database
  const { requirements: evidenceRequirements, loading: configLoading } = useEvidenceRequirements(control.item.id);
  const { applicableFormTypes } = useApplicableFormTypes(control.item.id);
  const { formTypes: allFormTypes } = useFormTypes();
  
  // Filter form types to only show applicable ones
  const formTypes = allFormTypes.filter(ft => applicableFormTypes.includes(ft.value));

  useEffect(() => {
    if (!configLoading) {
      loadChecklist();
      loadProgress();
      loadAvailableForms();
    }
  }, [control.item.id, configLoading, evidenceRequirements]);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      
      // Wait for config to load
      if (configLoading) {
        return;
      }
      
      // Get requirements from database via hook
      if (!evidenceRequirements || evidenceRequirements.length === 0) {
        setChecklistItems([]);
        setLoading(false);
        return;
      }

      // Initialize checklist in backend
      const items = await evidenceChecklistAPI.initialize(control.item.id, evidenceRequirements);
      setChecklistItems(items);
    } catch (error) {
      console.error('Error loading checklist:', error);
      alert('Failed to load checklist: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const prog = await evidenceChecklistAPI.getProgress(control.item.id);
      setProgress(prog);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadAvailableForms = async () => {
    try {
      const forms = await evidenceChecklistAPI.getAvailableForms(control.item.id);
      setAvailableForms(forms);
    } catch (error) {
      console.error('Error loading available forms:', error);
    }
  };

  const handleFileSelect = (e, requirementId) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadDialog(requirementId);
    }
  };

  const handleUpload = async (requirementId) => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    try {
      setUploading(requirementId);
      await evidenceChecklistAPI.uploadEvidence(
        control.item.id,
        requirementId,
        selectedFile,
        notes,
        currentUser.id,
        currentUser.fullName
      );

      // Reload checklist and progress
      await loadChecklist();
      await loadProgress();

      // Reset state
      setSelectedFile(null);
      setNotes('');
      setShowUploadDialog(null);
      alert('✅ Evidence uploaded successfully!');
    } catch (error) {
      console.error('Error uploading evidence:', error);
      alert('Failed to upload evidence: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (itemId, requirementId) => {
    if (!confirm('Are you sure you want to delete this evidence?')) {
      return;
    }

    try {
      await evidenceChecklistAPI.deleteEvidence(itemId);
      await loadChecklist();
      await loadProgress();
      alert('✅ Evidence deleted successfully!');
    } catch (error) {
      console.error('Error deleting evidence:', error);
      alert('Failed to delete evidence');
    }
  };

  const handleDownload = async (item) => {
    try {
      const blob = await evidenceChecklistAPI.downloadEvidence(item._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleLinkForm = async (requirementId, formId) => {
    try {
      setUploading(requirementId);
      await evidenceChecklistAPI.linkForm(
        control.item.id,
        requirementId,
        formId,
        currentUser.id,
        currentUser.fullName,
        notes
      );

      await loadChecklist();
      await loadProgress();

      setNotes('');
      setShowLinkFormDialog(null);
      setShowFormOptions(null);
      alert('✅ Form linked successfully!');
    } catch (error) {
      console.error('Error linking form:', error);
      alert('Failed to link form: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const handleShowFormOptions = (requirementId) => {
    setShowFormOptions(requirementId);
    setShowUploadDialog(null);
  };

  if (configLoading || loading) {
    return <div className="p-6 text-center" style={{color: textColor}}>Loading checklist...</div>;
  }

  if (!evidenceRequirements || evidenceRequirements.length === 0) {
    return (
      <div className="p-6 text-center" style={{color: textColor}}>
        <AlertCircle size={48} className="mx-auto mb-4" style={{color: darkMode ? '#9ca3af' : '#d1d5db'}} />
        <p className="text-lg font-medium mb-2">No Checklist Requirements</p>
        <p className="text-sm" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
          This control does not have predefined evidence checklist items.
        </p>
      </div>
    );
  }

  // Show FormBuilder if creating a new form
  if (showFormBuilder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full h-full">
          <FormBuilder
            formType={selectedFormType}
            currentUser={currentUser}
            darkMode={darkMode}
            preSelectedControl={control.item.id}
            onClose={() => {
              setShowFormBuilder(null);
              setSelectedFormType('');
            }}
            onSuccess={async (form) => {
              // Link the newly created form
              try {
                await evidenceChecklistAPI.linkForm(
                  control.item.id,
                  showFormBuilder,
                  form._id,
                  currentUser.id,
                  currentUser.fullName,
                  ''
                );
                await loadChecklist();
                await loadProgress();
                await loadAvailableForms();
                setShowFormBuilder(null);
                setShowFormOptions(null);
                setSelectedFormType('');
                alert('✅ Form created and linked successfully!');
              } catch (error) {
                console.error('Error linking new form:', error);
                alert('Form created but failed to link: ' + error.message);
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Progress Summary */}
      {progress && (
        <div className="mb-6 p-4 rounded-lg border" style={{backgroundColor: darkMode ? '#262626' : '#f9fafb', borderColor}}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{color: textColor}}>Evidence Progress</h3>
            <span className="text-lg font-bold" style={{color: progress.percentage === 100 ? '#10b981' : '#ef4444'}}>
              {progress.completed}/{progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="h-3 rounded-full transition-all"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: progress.percentage === 100 ? '#10b981' : '#3b82f6'
              }}
            />
          </div>
          <div className="flex items-center justify-between text-sm" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
            <span>Required: {progress.requiredCompleted}/{progress.required}</span>
            <span>{progress.percentage}% Complete</span>
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <div 
            key={item._id}
            className="border rounded-lg p-4"
            style={{
              borderColor,
              backgroundColor: item.isComplete ? (darkMode ? '#1e40af20' : '#dbeafe') : 'transparent'
            }}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox/Status Icon */}
              <div className="mt-1">
                {item.isComplete ? (
                  <CheckCircle size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} style={{color: darkMode ? '#6b7280' : '#9ca3af'}} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium" style={{color: textColor}}>
                      [{item.requirementId}] {item.requirementName}
                      {item.isRequired && (
                        <span className="ml-2 text-xs text-red-500">* Required</span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Evidence Info (File or Form) */}
                {item.isComplete && (item.file || item.form) ? (
                  <div className="mt-3 p-3 rounded-lg border" style={{backgroundColor: darkMode ? '#262626' : '#f9fafb', borderColor}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.evidenceType === 'file' ? (
                          <FileText size={18} style={{color: '#3b82f6'}} />
                        ) : (
                          <FormInput size={18} style={{color: '#10b981'}} />
                        )}
                        <div>
                          {item.evidenceType === 'file' && item.file ? (
                            <>
                              <p className="text-sm font-medium" style={{color: textColor}}>
                                {item.file.originalName}
                              </p>
                              <p className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                                Uploaded by {item.file.uploadedBy.userName} • {new Date(item.file.uploadedAt).toLocaleDateString()}
                              </p>
                            </>
                          ) : item.evidenceType === 'form' && item.form ? (
                            <>
                              <p className="text-sm font-medium" style={{color: textColor}}>
                                {item.form.formTitle}
                              </p>
                              <p className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                                Form: {item.form.formType} • Linked by {item.form.linkedBy.userName} • {new Date(item.form.linkedAt).toLocaleDateString()}
                              </p>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.evidenceType === 'file' && (
                          <button
                            onClick={() => handleDownload(item)}
                            className="p-2 rounded hover:bg-gray-200 transition-colors"
                            title="Download"
                          >
                            <Download size={18} style={{color: '#3b82f6'}} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id, item.requirementId)}
                          className="p-2 rounded hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} style={{color: '#ef4444'}} />
                        </button>
                      </div>
                    </div>
                    {item.notes && (
                      <p className="text-sm mt-2" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                        Notes: {item.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3">
                    {showUploadDialog === item.requirementId ? (
                      <div className="p-3 rounded-lg border" style={{backgroundColor: darkMode ? '#262626' : '#f9fafb', borderColor}}>
                        <p className="text-sm font-medium mb-2" style={{color: textColor}}>
                          Selected: {selectedFile?.name}
                        </p>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes (optional)"
                          rows={2}
                          className="w-full p-2 rounded border text-sm mb-2"
                          style={{
                            backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                            borderColor,
                            color: textColor
                          }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpload(item.requirementId)}
                            disabled={uploading === item.requirementId}
                            className="px-4 py-2 rounded text-white text-sm"
                            style={{backgroundColor: '#10b981'}}
                          >
                            {uploading === item.requirementId ? 'Uploading...' : 'Upload'}
                          </button>
                          <button
                            onClick={() => {
                              setShowUploadDialog(null);
                              setSelectedFile(null);
                              setNotes('');
                            }}
                            className="px-4 py-2 rounded text-sm"
                            style={{
                              backgroundColor: darkMode ? '#374151' : '#e5e7eb',
                              color: textColor
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : showFormOptions === item.requirementId ? (
                      <div className="p-3 rounded-lg border" style={{backgroundColor: darkMode ? '#262626' : '#f9fafb', borderColor}}>
                        <p className="text-sm font-medium mb-3" style={{color: textColor}}>
                          Choose Form Type
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {formTypes.map((ft) => (
                            <button
                              key={ft.value}
                              onClick={() => {
                                setSelectedFormType(ft.value);
                                setShowFormBuilder(item.requirementId);
                              }}
                              className="p-2 rounded border text-left text-sm hover:bg-opacity-50 transition-colors"
                              style={{
                                backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                                borderColor,
                                color: textColor
                              }}
                            >
                              <span className="mr-2">{ft.icon}</span>
                              {ft.label}
                            </button>
                          ))}
                        </div>
                        {availableForms.length > 0 && (
                          <>
                            <div className="border-t pt-3 mb-2" style={{borderColor}}>
                              <p className="text-xs font-medium mb-2" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                                Or link existing form:
                              </p>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {availableForms.map((form) => (
                                  <button
                                    key={form._id}
                                    onClick={() => handleLinkForm(item.requirementId, form._id)}
                                    className="w-full p-2 rounded border text-left text-sm hover:bg-opacity-50 transition-colors"
                                    style={{
                                      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
                                      borderColor,
                                      color: textColor
                                    }}
                                  >
                                    <div className="font-medium">{form.title}</div>
                                    <div className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                                      {form.formId} • {form.formType}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setShowFormOptions(null);
                            setNotes('');
                          }}
                          className="w-full px-4 py-2 rounded text-sm mt-2"
                          style={{
                            backgroundColor: darkMode ? '#374151' : '#e5e7eb',
                            color: textColor
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded cursor-pointer text-white text-sm"
                          style={{backgroundColor: '#3b82f6'}}
                        >
                          <Upload size={16} />
                          <span>Upload File</span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, item.requirementId)}
                          />
                        </label>
                        <button
                          onClick={() => handleShowFormOptions(item.requirementId)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded text-white text-sm"
                          style={{backgroundColor: '#10b981'}}
                        >
                          <FormInput size={16} />
                          <span>Create Form</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EvidenceChecklist;
