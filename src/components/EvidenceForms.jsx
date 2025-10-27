import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, Clock, AlertCircle, Image, File, X, ArrowLeft } from 'lucide-react';
import { evidenceFormsAPI } from '../services/evidenceFormsAPI';
import { useFormTypes } from '../hooks/useConfig';
import FormBuilder from './forms/FormBuilder';
import EvidenceFormViewer from './EvidenceFormViewer';

function EvidenceForms({ currentUser, darkMode, onClose }) {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formType, setFormType] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';
  
  // Get form types from database
  const { formTypes: FORM_TYPE_DEFINITIONS } = useFormTypes();

  useEffect(() => {
    loadForms();
    loadStats();
  }, []);

  const loadForms = async () => {
    try {
      const data = await evidenceFormsAPI.getAll();
      setForms(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load forms:', error);
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await evidenceFormsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Use centralized form type definitions
  const formTypes = FORM_TYPE_DEFINITIONS.map(ft => ({
    value: ft.value,
    label: `${ft.icon} ${ft.label}`,
    icon: ft.icon,
    description: ft.description
  }));

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

  const handleCreateFormType = (type) => {
    setFormType(type);
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{backgroundColor: bgColor}}>
        <div style={{color: textColor}}>Loading...</div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <FormBuilder
        formType={formType}
        currentUser={currentUser}
        darkMode={darkMode}
        onClose={() => setShowCreateForm(false)}
        onSuccess={() => {
          setShowCreateForm(false);
          loadForms();
          loadStats();
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
          loadStats();
        }}
        onUpdate={() => {
          loadForms();
          loadStats();
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
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{borderColor}}>
        <div>
          <div className="flex items-center gap-3">
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                style={{backgroundColor: darkMode ? '#262626' : '#f3f4f6'}}
                title="Back to Controls"
              >
                <ArrowLeft size={20} style={{color: textColor}} />
              </button>
            )}
            <h1 className="text-2xl font-semibold" style={{color: textColor}}>Evidence Forms</h1>
          </div>
          <p className="text-sm mt-1 ml-14" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
            Create and manage operational evidence forms
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="px-6 py-4 grid grid-cols-4 gap-4">
          {stats.map((stat) => {
            const formType = formTypes.find(ft => ft.value === stat._id);
            return (
              <div 
                key={stat._id}
                className="p-4 rounded-lg border"
                style={{backgroundColor: darkMode ? '#262626' : '#f9fafb', borderColor}}
              >
                <div className="text-2xl mb-1">{formType?.icon || '📝'}</div>
                <div className="font-semibold" style={{color: textColor}}>{stat.total}</div>
                <div className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                  {formType?.label.replace(/^..\s/, '') || stat._id}
                </div>
                <div className="text-xs mt-1" style={{color: '#10b981'}}>
                  {stat.approved} approved
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Create Buttons */}
      <div className="px-6 py-4 border-b" style={{borderColor}}>
        <h3 className="text-sm font-semibold mb-3" style={{color: textColor}}>Create New Form</h3>
        <div className="grid grid-cols-4 gap-3">
          {formTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleCreateFormType(type.value)}
              className="p-4 rounded-lg border text-left transition-all hover:shadow-md"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-medium text-sm">{type.label.replace(/^..\s/, '')}</div>
              <div className="text-xs mt-1" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Forms List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <h3 className="text-sm font-semibold mb-3" style={{color: textColor}}>Recent Forms</h3>
        
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4" style={{color: darkMode ? '#4b5563' : '#d1d5db'}} />
            <p style={{color: darkMode ? '#9ca3af' : '#64748b'}}>No evidence forms yet</p>
            <p className="text-sm mt-1" style={{color: darkMode ? '#6b7280' : '#9ca3af'}}>
              Create your first form using the buttons above
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => {
              const formType = formTypes.find(ft => ft.value === form.formType);
              return (
                <button
                  key={form._id}
                  onClick={() => setSelectedForm(form)}
                  className="w-full p-4 rounded-lg border text-left transition-all hover:shadow-md"
                  style={{
                    backgroundColor: darkMode ? '#262626' : '#ffffff',
                    borderColor
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{formType?.icon || '📝'}</div>
                      <div>
                        <div className="font-semibold" style={{color: textColor}}>{form.title}</div>
                        <div className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                          {form.formId} • Control {form.controlId}
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
                        {form.attachments.length} attachments
                      </span>
                    )}
                    <span>Signatures: {
                      [form.signatures?.requester, form.signatures?.reviewer, form.signatures?.approver]
                        .filter(Boolean).length
                    }/3</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EvidenceForms;
