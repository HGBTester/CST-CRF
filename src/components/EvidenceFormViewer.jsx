import React, { useState } from 'react';
import { X, CheckCircle, Clock, AlertCircle, FileText, Image, Download, User } from 'lucide-react';
import { evidenceFormsAPI } from '../services/evidenceFormsAPI';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function EvidenceFormViewer({ form, currentUser, darkMode, onClose, onUpdate }) {
  const [signing, setSigning] = useState(false);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: '#6b7280', icon: <Clock size={16} />, text: 'Draft' },
      pending_review: { bg: '#f59e0b', icon: <Clock size={16} />, text: 'Pending Review' },
      pending_approval: { bg: '#3b82f6', icon: <Clock size={16} />, text: 'Pending Approval' },
      approved: { bg: '#10b981', icon: <CheckCircle size={16} />, text: 'Approved' },
      rejected: { bg: '#ef4444', icon: <AlertCircle size={16} />, text: 'Rejected' }
    };

    const badge = badges[status] || badges.draft;
    return (
      <span 
        className="px-4 py-2 rounded-full text-white font-medium flex items-center gap-2"
        style={{backgroundColor: badge.bg}}
      >
        {badge.icon}
        {badge.text}
      </span>
    );
  };

  const canSign = (role) => {
    if (!currentUser) return false;
    
    // Check if already signed
    if (form.signatures && form.signatures[role]) return false;
    
    // Check permissions and prerequisites
    if (role === 'reviewer') {
      // Must be pending_review and have requester signature
      return form.status === 'pending_review' && 
             form.signatures?.requester &&
             currentUser.permissions.includes('sign_as_reviewed');
    }
    
    if (role === 'approver') {
      // Must be pending_approval and have both requester and reviewer signatures
      return form.status === 'pending_approval' &&
             form.signatures?.requester &&
             form.signatures?.reviewer &&
             currentUser.permissions.includes('sign_as_approved');
    }
    
    return false;
  };

  const handleSign = async (role) => {
    if (!canSign(role)) return;
    
    setSigning(true);
    try {
      await evidenceFormsAPI.sign(form._id, role, {
        id: currentUser.id,
        fullName: currentUser.fullName,
        position: currentUser.position,
        signatureImage: currentUser.signatureImage
      }, `Approved by ${currentUser.fullName}`);
      
      alert('✅ Signature added successfully!');
      onUpdate && onUpdate();
    } catch (error) {
      console.error('Sign error:', error);
      alert('Failed to sign: ' + error.message);
    } finally {
      setSigning(false);
    }
  };

  const renderSignatureBox = (role, label) => {
    const signature = form.signatures?.[role];
    const canSignThis = canSign(role);

    return (
      <div 
        className="p-4 rounded-lg border-2"
        style={{
          borderColor: signature ? '#10b981' : borderColor,
          backgroundColor: signature ? (darkMode ? '#064e3b' : '#d1fae5') : (darkMode ? '#262626' : '#f9fafb')
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold" style={{color: textColor}}>{label}</h4>
          {signature ? (
            <CheckCircle size={20} style={{color: '#10b981'}} />
          ) : (
            <Clock size={20} style={{color: '#9ca3af'}} />
          )}
        </div>

        {signature ? (
          <div>
            <p className="text-sm mb-1" style={{color: textColor}}>
              <strong>Name:</strong> {signature.userName}
            </p>
            <p className="text-sm mb-1" style={{color: textColor}}>
              <strong>Position:</strong> {signature.position}
            </p>
            <p className="text-sm mb-1" style={{color: textColor}}>
              <strong>Signed:</strong> {new Date(signature.signedAt).toLocaleString()}
            </p>
            {signature.comments && (
              <p className="text-sm mt-2 italic" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                "{signature.comments}"
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm mb-3" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              Awaiting signature from {label.toLowerCase()}
            </p>
            {canSignThis && (
              <button
                onClick={() => handleSign(role)}
                disabled={signing}
                className="w-full py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                style={{backgroundColor: '#10b981'}}
              >
                {signing ? 'Signing...' : `Sign as ${label}`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderFormData = () => {
    if (!form.formData) return null;

    return (
      <div className="space-y-3">
        {Object.entries(form.formData).map(([key, value]) => {
          if (key === 'controlId' || !value) return null;
          
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          
          return (
            <div key={key} className="pb-3 border-b" style={{borderColor}}>
              <p className="text-sm font-semibold mb-1" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                {label}
              </p>
              <p style={{color: textColor}} className="whitespace-pre-wrap">
                {value}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        className="rounded-lg p-6 max-w-6xl w-full my-auto max-h-[95vh] overflow-y-auto"
        style={{backgroundColor: bgColor}}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold" style={{color: textColor}}>
                {form.title}
              </h2>
              {getStatusBadge(form.status)}
            </div>
            <p className="text-sm" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              {form.formId} • Control {form.controlId} • Created {new Date(form.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} disabled={signing}>
            <X size={24} style={{color: darkMode ? '#9ca3af' : '#64748b'}} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Form Data */}
            <div className="p-4 rounded-lg border" style={{borderColor, backgroundColor: darkMode ? '#262626' : '#f9fafb'}}>
              <h3 className="text-lg font-semibold mb-4" style={{color: textColor}}>
                Form Details
              </h3>
              {renderFormData()}
            </div>

            {/* Attachments */}
            {form.attachments && form.attachments.length > 0 && (
              <div className="p-4 rounded-lg border" style={{borderColor, backgroundColor: darkMode ? '#262626' : '#f9fafb'}}>
                <h3 className="text-lg font-semibold mb-4" style={{color: textColor}}>
                  Attachments ({form.attachments.length})
                </h3>
                <div className="space-y-2">
                  {form.attachments.map((att, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded border"
                      style={{borderColor, backgroundColor: darkMode ? '#1a1a1a' : '#ffffff'}}
                    >
                      <div className="flex items-center gap-3">
                        {att.category === 'photo' || att.category === 'screenshot' ? (
                          <Image size={20} style={{color: '#3b82f6'}} />
                        ) : (
                          <FileText size={20} style={{color: '#6b7280'}} />
                        )}
                        <div>
                          <p className="font-medium" style={{color: textColor}}>{att.fileName}</p>
                          <p className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                            {att.description || att.category} • {(att.fileSize / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <a
                        href={`${API_BASE_URL}${att.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Download size={18} style={{color: '#3b82f6'}} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History */}
            {form.history && form.history.length > 0 && (
              <div className="p-4 rounded-lg border" style={{borderColor, backgroundColor: darkMode ? '#262626' : '#f9fafb'}}>
                <h3 className="text-lg font-semibold mb-4" style={{color: textColor}}>
                  Activity History
                </h3>
                <div className="space-y-2">
                  {form.history.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full mt-1.5" style={{backgroundColor: '#3b82f6'}} />
                      <div>
                        <p style={{color: textColor}}>
                          <strong>{entry.action}</strong> by {entry.performedBy}
                        </p>
                        <p style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                          {new Date(entry.performedAt).toLocaleString()}
                        </p>
                        {entry.details && (
                          <p className="italic" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                            {entry.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Signatures - 1 column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{color: textColor}}>
              Approval Workflow
            </h3>
            
            {renderSignatureBox('requester', 'Requester')}
            {renderSignatureBox('reviewer', 'Reviewer')}
            {renderSignatureBox('approver', 'Approver')}

            {form.status === 'approved' && (
              <div 
                className="p-6 rounded-lg border-2 text-center"
                style={{borderColor: '#10b981', backgroundColor: darkMode ? '#064e3b' : '#d1fae5'}}
              >
                <CheckCircle size={48} className="mx-auto mb-3" style={{color: '#10b981'}} />
                <p className="text-xl font-bold" style={{color: '#10b981'}}>
                  APPROVED
                </p>
                <p className="text-sm mt-2" style={{color: textColor}}>
                  All signatures collected
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: darkMode ? '#404040' : '#e5e7eb',
              color: textColor
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvidenceFormViewer;
