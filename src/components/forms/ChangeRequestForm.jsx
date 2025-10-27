import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { evidenceFormsAPI } from '../../services/evidenceFormsAPI';
import { auditStructure } from '../../data/auditStructure';

function ChangeRequestForm({ currentUser, darkMode, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    controlId: '4.2.1', // Default to Change Management control
    changeType: '',
    priority: 'medium',
    description: '',
    systemsAffected: '',
    riskLevel: 'medium',
    riskAssessment: '',
    implementationPlan: '',
    rollbackPlan: '',
    implementationDate: '',
    testResults: '',
    businessJustification: ''
  });

  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  // Get all controls for dropdown
  const getAllControls = () => {
    const controls = [];
    Object.entries(auditStructure).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, items]) => {
        items.forEach(item => {
          controls.push({
            id: item.id,
            name: item.name,
            category,
            subcategory
          });
        });
      });
    });
    return controls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Create the form
      const form = await evidenceFormsAPI.create({
        formType: 'change_request',
        controlId: formData.controlId,
        title: formData.title,
        description: formData.description,
        formData: formData,
        createdBy: {
          userId: currentUser.id,
          userName: currentUser.fullName
        },
        status: 'draft'
      });

      // Upload attachments if any
      for (const file of attachments) {
        await evidenceFormsAPI.uploadAttachment(
          form._id,
          file,
          currentUser.fullName,
          file.description || 'Attachment',
          file.category || 'document'
        );
      }

      // Auto-sign as requester
      await evidenceFormsAPI.sign(form._id, 'requester', currentUser, 'Initial submission');

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create change request:', error);
      alert('Failed to create change request: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      category: 'document',
      description: ''
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div 
        className="rounded-lg p-6 max-w-4xl w-full mx-4 my-8"
        style={{backgroundColor: bgColor}}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold" style={{color: textColor}}>
              🔄 Change Request Form
            </h2>
            <p className="text-sm mt-1" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
              Document system/network changes for approval
            </p>
          </div>
          <button onClick={onClose} disabled={uploading}>
            <X size={24} style={{color: darkMode ? '#9ca3af' : '#64748b'}} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Control Selection */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Linked Control *
            </label>
            <select
              required
              value={formData.controlId}
              onChange={(e) => setFormData({...formData, controlId: e.target.value})}
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            >
              <option value="">Select Control</option>
              {getAllControls().filter(c => c.id.startsWith('4.2')).map(control => (
                <option key={control.id} value={control.id}>
                  {control.id} - {control.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Change Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Add firewall rule for CRM system"
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Change Type & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
                Change Type *
              </label>
              <select
                required
                value={formData.changeType}
                onChange={(e) => setFormData({...formData, changeType: e.target.value})}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  borderColor,
                  color: textColor
                }}
              >
                <option value="">Select Type</option>
                <option value="firewall">Firewall Configuration</option>
                <option value="network">Network Configuration</option>
                <option value="server">Server Configuration</option>
                <option value="software">Software Installation</option>
                <option value="database">Database Schema</option>
                <option value="security">Security Policy</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
                Priority *
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  borderColor,
                  color: textColor
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="Detailed description of the change..."
              className="w-full p-3 rounded-lg border resize-none"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Systems Affected */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Systems/Services Affected *
            </label>
            <input
              type="text"
              required
              value={formData.systemsAffected}
              onChange={(e) => setFormData({...formData, systemsAffected: e.target.value})}
              placeholder="e.g., Main Firewall, CRM Server, Customer Portal"
              className="w-full p-3 rounded-lg border"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Risk Assessment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
                Risk Level *
              </label>
              <select
                required
                value={formData.riskLevel}
                onChange={(e) => setFormData({...formData, riskLevel: e.target.value})}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  borderColor,
                  color: textColor
                }}
              >
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
                Implementation Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.implementationDate}
                onChange={(e) => setFormData({...formData, implementationDate: e.target.value})}
                className="w-full p-3 rounded-lg border"
                style={{
                  backgroundColor: darkMode ? '#262626' : '#ffffff',
                  borderColor,
                  color: textColor
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Risk Assessment & Mitigation
            </label>
            <textarea
              value={formData.riskAssessment}
              onChange={(e) => setFormData({...formData, riskAssessment: e.target.value})}
              rows={2}
              placeholder="Identify risks and mitigation strategies..."
              className="w-full p-3 rounded-lg border resize-none"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Implementation Plan */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Implementation Plan *
            </label>
            <textarea
              required
              value={formData.implementationPlan}
              onChange={(e) => setFormData({...formData, implementationPlan: e.target.value})}
              rows={3}
              placeholder="Step-by-step implementation plan..."
              className="w-full p-3 rounded-lg border resize-none"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Rollback Plan */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Rollback Plan *
            </label>
            <textarea
              required
              value={formData.rollbackPlan}
              onChange={(e) => setFormData({...formData, rollbackPlan: e.target.value})}
              rows={2}
              placeholder="How to revert if issues occur..."
              className="w-full p-3 rounded-lg border resize-none"
              style={{
                backgroundColor: darkMode ? '#262626' : '#ffffff',
                borderColor,
                color: textColor
              }}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{color: textColor}}>
              Attachments (Screenshots, Configs, Documentation)
            </label>
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center"
              style={{borderColor}}
            >
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept="image/*,.pdf,.doc,.docx,.xlsx,.xls"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={32} className="mx-auto mb-2" style={{color: darkMode ? '#9ca3af' : '#6b7280'}} />
                <p style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  Click to upload or drag and drop
                </p>
                <p className="text-xs mt-1" style={{color: darkMode ? '#6b7280' : '#9ca3af'}}>
                  PNG, JPG, PDF, DOC, XLS (max 10MB each)
                </p>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((att, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded border"
                    style={{borderColor, backgroundColor: darkMode ? '#262626' : '#f9fafb'}}
                  >
                    <span className="text-sm" style={{color: textColor}}>{att.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50"
              style={{backgroundColor: '#10b981'}}
            >
              {uploading ? 'Creating...' : 'Create & Submit for Review'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: darkMode ? '#404040' : '#e5e7eb',
                color: textColor
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangeRequestForm;
