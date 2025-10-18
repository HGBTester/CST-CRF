import React, { useState, useRef, useEffect } from 'react';
import { Save, Sparkles, X, Edit2, Check, Plus } from 'lucide-react';

function TemplateEditor({ control, onSave, onClose, currentTemplate, onAIEdit, onNewRequest }) {
  const [editableContent, setEditableContent] = useState(currentTemplate);
  const [editingSection, setEditingSection] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSectionEdit = (sectionId, newContent) => {
    const updatedContent = editableContent.replace(
      new RegExp(`<div id="${sectionId}"[^>]*>.*?</div>`, 's'),
      `<div id="${sectionId}" class="editable-section">${newContent}</div>`
    );
    setEditableContent(updatedContent);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editableContent);
    setHasChanges(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden" style={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
      {/* Header */}
      <div className="bg-white border-b-2 px-6 py-4 flex items-center justify-between" style={{borderColor: '#e2e8f0'}}>
        <div>
          <h1 className="font-semibold" style={{fontSize: '24px', color: '#1e293b'}}>{control.item.id} - {control.item.name}</h1>
          <p className="mt-1" style={{fontSize: '14px', color: '#64748b'}}>{control.category}</p>
        </div>
        <div className="flex items-center gap-3">
          {onNewRequest && (
            <button
              onClick={onNewRequest}
              className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '14px'
              }}
            >
              <Plus size={18} />
              <span>New Request</span>
            </button>
          )}
          <button
            onClick={onAIEdit}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              fontSize: '14px'
            }}
          >
            <Sparkles size={18} />
            <span>AI Edit</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#10b981',
              fontSize: '14px'
            }}
          >
            <Save size={18} />
            <span>Save Template</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{color: '#64748b'}}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Edit Mode Banner */}
      <div className="border-b px-6 py-3" style={{backgroundColor: '#eff6ff', borderColor: '#dbeafe'}}>
        <div className="flex items-center gap-2" style={{color: '#1e40af'}}>
          <Edit2 size={16} />
          <span style={{fontSize: '14px', fontWeight: '500'}}>Template Edit Mode</span>
          <span style={{fontSize: '13px', color: '#2563eb'}}>• Click sections to edit directly or use AI Edit for smart modifications</span>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <EditableDocument
          content={editableContent}
          onSectionEdit={handleSectionEdit}
          editingSection={editingSection}
          setEditingSection={setEditingSection}
          control={control}
        />
      </div>
    </div>
  );
}

function EditableDocument({ content, onSectionEdit, editingSection, setEditingSection, control }) {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const sections = [
    { id: 'purpose', title: '1. Purpose', pattern: /<h3[^>]*>1\.\s*Purpose<\/h3>(.*?)<h3/s },
    { id: 'scope', title: '2. Scope', pattern: /<h3[^>]*>2\.\s*Scope<\/h3>(.*?)<h3/s },
    { id: 'requirements', title: '3. Requirements', pattern: /<h3[^>]*>3\.\s*Requirements<\/h3>(.*?)<h3/s },
  ];

  return (
    <div className="mx-auto" style={{maxWidth: '900px', padding: '40px'}}>
      {/* Header Section */}
      <div style={{paddingBottom: '20px', marginBottom: '30px', borderBottom: '4px solid #2563eb'}}>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center text-white font-bold shadow-lg" 
               style={{
                 width: '40px',
                 height: '40px',
                 backgroundColor: '#2563eb',
                 borderRadius: '8px',
                 fontSize: '18px'
               }}>
            L3
          </div>
          <div className="flex-1">
            <h2 className="font-bold" style={{fontSize: '24px', color: '#1e293b'}}>L3 Company</h2>
            <p style={{fontSize: '13px', color: '#64748b'}}>Cybersecurity Documentation</p>
          </div>
          <div className="text-right">
            <p style={{fontSize: '12px', color: '#64748b'}}>Document No.</p>
            <p className="font-bold" style={{fontSize: '18px', color: '#1e293b'}}>{control.item.id}</p>
            <p style={{fontSize: '12px', color: '#64748b'}}>Version 1.0</p>
          </div>
        </div>

        <div className="text-white shadow-lg" 
             style={{
               background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
               padding: '25px',
               borderRadius: '10px',
               marginBottom: '30px'
             }}>
          <p style={{fontSize: '13px', fontWeight: '500'}} className="mb-1">CST Control {control.item.id}</p>
          <h1 className="font-bold mb-2" style={{fontSize: '28px'}}>{control.item.name}</h1>
          <p style={{fontSize: '14px', opacity: '0.9'}}>{control.category}</p>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #2563eb',
          padding: '20px',
          borderRadius: '5px'
        }}>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-medium" style={{fontSize: '13px', color: '#64748b'}}>Date Prepared:</p>
              <p style={{fontSize: '14px', color: '#1e293b'}}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="font-medium" style={{fontSize: '13px', color: '#64748b'}}>Classification:</p>
              <p style={{fontSize: '14px', color: '#1e293b'}}>Confidential - Internal Use</p>
            </div>
            <div>
              <p className="font-medium" style={{fontSize: '13px', color: '#64748b'}}>Compliance Level:</p>
              <p className="font-semibold" style={{fontSize: '14px', color: '#2563eb'}}>{control.item.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Content Sections */}
      <div className="space-y-6">
        <EditableSection
          id="purpose"
          title="1. Purpose"
          content={extractPurpose(localContent)}
          onSave={(content) => onSectionEdit('purpose', content)}
          isEditing={editingSection === 'purpose'}
          setEditing={(val) => setEditingSection(val ? 'purpose' : null)}
        />

        <EditableSection
          id="scope"
          title="2. Scope"
          content={extractScope(localContent)}
          onSave={(content) => onSectionEdit('scope', content)}
          isEditing={editingSection === 'scope'}
          setEditing={(val) => setEditingSection(val ? 'scope' : null)}
        />

        <EditableSection
          id="requirements"
          title="3. Requirements"
          content={extractRequirements(localContent)}
          onSave={(content) => onSectionEdit('requirements', content)}
          isEditing={editingSection === 'requirements'}
          setEditing={(val) => setEditingSection(val ? 'requirements' : null)}
        />
      </div>

      {/* Note about signatures */}
      <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a template. Signature sections will be added automatically when documents are generated.
        </p>
      </div>
    </div>
  );
}

function EditableSection({ id, title, content, onSave, isEditing, setEditing }) {
  const [editedContent, setEditedContent] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editedContent);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setEditing(false);
  };

  return (
    <div className="group relative" style={{marginBottom: '30px'}}>
      <div className="flex items-center justify-between" style={{
        paddingBottom: '10px',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '15px'
      }}>
        <h3 className="font-semibold" style={{fontSize: '18px', color: '#1e293b'}}>{title}</h3>
        {!isEditing && (
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-3 py-1 rounded-lg transition-all"
            style={{
              fontSize: '13px',
              backgroundColor: '#dbeafe',
              color: '#1e40af'
            }}
          >
            <Edit2 size={14} />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => {
              setEditedContent(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            className="w-full p-4 rounded-lg resize-none"
            style={{
              border: '2px solid #2563eb',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              fontSize: '14px',
              color: '#1e293b',
              lineHeight: '1.8'
            }}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 text-white rounded-lg transition-colors"
              style={{
                backgroundColor: '#10b981',
                fontSize: '14px'
              }}
            >
              <Check size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: '#e2e8f0',
                color: '#475569',
                fontSize: '14px'
              }}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="whitespace-pre-wrap" style={{
            color: '#475569',
            fontSize: '15px',
            lineHeight: '1.8'
          }}>{content}</p>
        </div>
      )}
    </div>
  );
}

// Helper functions to extract content
function extractPurpose(html) {
  const match = html.match(/<h3[^>]*>1\.\s*Purpose<\/h3>\s*<p>(.*?)<\/p>/s);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : 'This document establishes the requirements and procedures...';
}

function extractScope(html) {
  const match = html.match(/<h3[^>]*>2\.\s*Scope<\/h3>\s*<p>(.*?)<\/p>/s);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : 'This document applies to all operations...';
}

function extractRequirements(html) {
  const match = html.match(/<h3[^>]*>3\.\s*Requirements<\/h3>\s*<p>(.*?)<\/p>/s);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : 'The following requirements must be met...';
}

export default TemplateEditor;
