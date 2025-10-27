import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Image, Eye, Plus, ArrowLeft, Upload, ListChecks } from 'lucide-react';
import { evidenceFormsAPI } from '../services/evidenceFormsAPI';
import FormBuilder from './forms/FormBuilder';
import EvidenceFormViewer from './EvidenceFormViewer';
import StaticEvidenceUploader from './StaticEvidenceUploader';
import EvidenceChecklist from './EvidenceChecklist';
import { useApplicableFormTypes, useEvidenceRequirements, useFormTypes, useStaticEvidenceControls } from '../hooks/useConfig';
import { needsStaticEvidence, hasEvidenceCapability } from '../services/configAPI';

function ControlEvidenceView({ control, currentUser, darkMode, onBackToTemplate }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showStaticUploader, setShowStaticUploader] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [evidenceTab, setEvidenceTab] = useState('checklist'); // 'checklist', 'forms', 'files'
  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';
  
  // Get configuration from database - hooks must be called unconditionally
  const formTypesData = useApplicableFormTypes(control?.item?.id || '');
  const requirementsData = useEvidenceRequirements(control?.item?.id || '');
  const allFormTypesData = useFormTypes();
  const staticControlsData = useStaticEvidenceControls();
  
  const applicableFormTypes = formTypesData?.applicableFormTypes || [];
  const formTypesLoading = formTypesData?.loading || false;
  const evidenceRequirements = requirementsData?.requirements || [];
  const requirementsLoading = requirementsData?.loading || false;
  const allFormTypes = allFormTypesData?.formTypes || [];
  const allFormTypesLoading = allFormTypesData?.loading || false;
  const staticEvidenceControls = staticControlsData?.staticEvidenceControls || [];
  const staticControlsLoading = staticControlsData?.loading || false;
  
  const configLoading = formTypesLoading || requirementsLoading || allFormTypesLoading || staticControlsLoading;
  
  const isStaticOnly = staticEvidenceControls && needsStaticEvidence(staticEvidenceControls, control.item.id) && applicableFormTypes && applicableFormTypes.length === 0;
  const hasRequirements = evidenceRequirements && evidenceRequirements.length > 0;
  
  // Helper functions with null checks
  const getFormType = (value) => allFormTypes ? allFormTypes.find(ft => ft.value === value) : null;
  const getFormIcon = (value) => getFormType(value)?.icon || '📝';
  const getFormLabel = (value) => getFormType(value)?.label || value;

  useEffect(() => {
    loadForms();
  }, [control]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await evidenceFormsAPI.getByControl(control.item.id);
      setForms(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load evidence forms:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: '#6b7280', icon: <Clock size={14} />, text: 'Draft' },
      pending_review: { bg: '#f59e0b', icon: <Clock size={14} />, text: 'Pending Review' },
      pending_approval: { bg: '#3b82f6', icon: <Clock size={14} />, text: 'Pending Approval' },
      approved: { bg: '#10b981', icon: <CheckCircle size={14} />, text: 'Approved' },
      rejected: { bg: '#ef4444', icon: <AlertCircle size={14} />, text: 'Rejected' }
    };

    const badge = badges[status] || badges.draft;
    return (
      <span 
        className="px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1"
        style={{backgroundColor: badge.bg}}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const getFormTypeLabel = (type) => {
    const formType = getFormType(type);
    return formType ? { icon: formType.icon, label: formType.label } : { icon: '📝', label: 'Form' };
  };

  // Show loading state while config is loading
  if (configLoading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{backgroundColor: bgColor}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{borderColor: darkMode ? '#007acc' : '#2563eb'}}></div>
          <p style={{color: textColor}}>Loading evidence configuration...</p>
        </div>
      </div>
    );
  }

  if (showStaticUploader) {
    return (
      <StaticEvidenceUploader
        control={control}
        currentUser={currentUser}
        darkMode={darkMode}
        onClose={() => setShowStaticUploader(false)}
        onSuccess={() => {
          setShowStaticUploader(false);
          loadForms();
        }}
      />
    );
  }

  if (showCreateForm) {
    // Use selected form type, or default to first applicable type
    const formTypeToUse = selectedFormType || (applicableFormTypes && applicableFormTypes[0]) || 'change_request';
    
    return (
      <FormBuilder
        formType={formTypeToUse}
        currentUser={currentUser}
        darkMode={darkMode}
        preSelectedControl={control.item.id}
        onClose={() => {
          setShowCreateForm(false);
          setSelectedFormType(null);
        }}
        onSuccess={() => {
          setShowCreateForm(false);
          setSelectedFormType(null);
          loadForms();
        }}
      />
    );
  }

  if (selectedForm) {
    return (
      <EvidenceFormViewer
        form={selectedForm}
        currentUser={currentUser}
        darkMode={darkMode}
        onClose={() => {
          setSelectedForm(null);
          loadForms();
        }}
        onUpdate={() => {
          loadForms();
          // Reload the form details
          evidenceFormsAPI.getById(selectedForm._id).then(updatedForm => {
            setSelectedForm(updatedForm);
          });
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{backgroundColor: bgColor}}>
      {/* Header */}
      <div className="border-b p-4" style={{borderColor}}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold" style={{color: textColor}}>
              {control.item.id} - {control.item.name}
            </h2>
            <p className="text-sm mt-1" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              {control.category}
            </p>
            {onBackToTemplate && (
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={onBackToTemplate}
                  className="px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all hover:border-blue-400"
                  style={{
                    borderColor: darkMode ? '#404040' : '#e2e8f0',
                    backgroundColor: 'transparent',
                    color: textColor
                  }}
                >
                  📋 Template
                </button>
                <button
                  className="px-4 py-1.5 rounded-lg border-2 text-sm font-medium transition-all"
                  style={{
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  <FileText size={16} className="inline mr-2" />
                  Evidence
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (isStaticOnly) {
                setShowStaticUploader(true);
              } else {
                // Use first applicable form type (they're already filtered for this control)
                const formType = applicableFormTypes[0] || 'change_request';
                setSelectedFormType(formType);
                setShowCreateForm(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all"
            style={{backgroundColor: '#10b981'}}
            title={isStaticOnly ? 'Upload photos, documents, certificates' : 'Create operational evidence form'}
          >
            {isStaticOnly ? <Upload size={18} /> : <Plus size={18} />}
            {isStaticOnly ? 'Upload Evidence Files' : 'Add Evidence'}
          </button>
        </div>
      </div>

      {/* Evidence Tabs */}
      <div className="border-b" style={{borderColor}}>
        <div className="flex gap-2 px-4">
          {hasRequirements && (
            <button
              onClick={() => setEvidenceTab('checklist')}
              className="px-4 py-3 font-medium text-sm transition-all"
              style={{
                borderBottom: evidenceTab === 'checklist' ? '2px solid #3b82f6' : '2px solid transparent',
                color: evidenceTab === 'checklist' ? '#3b82f6' : textColor
              }}
            >
              <ListChecks size={16} className="inline mr-2" />
              Checklist
            </button>
          )}
          <button
            onClick={() => setEvidenceTab('forms')}
            className="px-4 py-3 font-medium text-sm transition-all"
            style={{
              borderBottom: evidenceTab === 'forms' ? '2px solid #3b82f6' : '2px solid transparent',
              color: evidenceTab === 'forms' ? '#3b82f6' : textColor
            }}
          >
            <FileText size={16} className="inline mr-2" />
            Forms ({forms.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {evidenceTab === 'checklist' && hasRequirements ? (
          <EvidenceChecklist
            control={control}
            currentUser={currentUser}
            darkMode={darkMode}
          />
        ) : evidenceTab === 'forms' ? (
          <div className="p-4">
        {loading ? (
          <div className="text-center py-8" style={{color: textColor}}>Loading...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4" style={{color: darkMode ? '#4b5563' : '#d1d5db'}} />
            <p className="font-medium mb-2" style={{color: textColor}}>No Evidence Forms Yet</p>
            <p className="text-sm mb-4" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              Create evidence forms to document operations for this control
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 rounded-lg text-white"
              style={{backgroundColor: '#3b82f6'}}
            >
              Create First Form
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => {
              const formTypeInfo = getFormTypeLabel(form.formType);
              const signatureCount = [
                form.signatures?.requester,
                form.signatures?.reviewer,
                form.signatures?.approver
              ].filter(Boolean).length;

              return (
                <div
                  key={form._id}
                  className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                  style={{
                    backgroundColor: darkMode ? '#262626' : '#ffffff',
                    borderColor
                  }}
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{formTypeInfo.icon}</div>
                      <div>
                        <div className="font-semibold" style={{color: textColor}}>
                          {form.title}
                        </div>
                        <div className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                          {form.formId} • {formTypeInfo.label}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(form.status)}
                  </div>

                  <div className="flex items-center gap-4 text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                    <span>Created: {new Date(form.createdAt).toLocaleDateString()}</span>
                    {form.attachments?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Image size={12} />
                        {form.attachments.length} files
                      </span>
                    )}
                    <span>Signatures: {signatureCount}/3</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ControlEvidenceView;
