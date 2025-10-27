import React, { useState } from 'react';
import { Upload, X, Trash2, FileText, Image } from 'lucide-react';
import { evidenceFormsAPI } from '../services/evidenceFormsAPI';

function StaticEvidenceUploader({ control, currentUser, darkMode, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e5e7eb' : '#1e293b';
  const borderColor = darkMode ? '#404040' : '#e2e8f0';

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      fileName: file.name,
      fileSize: file.size,
      category: file.type.startsWith('image/') ? 'photo' : 'document',
      description: ''
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (files.length === 0) {
      alert('Please upload at least one file');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('controlId', control.item.id);
      formData.append('formType', 'static_evidence');
      formData.append('createdBy', currentUser.fullName);
      files.forEach((fileObj) => {
        formData.append('files', fileObj.file);
      });
      await evidenceFormsAPI.create(formData);
      alert('✅ Evidence uploaded!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      alert('Failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto" style={{backgroundColor: bgColor}}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold" style={{color: textColor}}>Upload Evidence Files</h2>
          <button onClick={onClose}><X size={24} style={{color: textColor}} /></button>
        </div>
        <p className="text-sm mb-4" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
          {control.item.id} - {control.item.name}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{color: textColor}}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded border"
              style={{borderColor, backgroundColor: darkMode ? '#262626' : '#ffffff', color: textColor}}
              placeholder="e.g., Physical Access Control Photos Q4 2025"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{color: textColor}}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded border"
              rows="3"
              style={{borderColor, backgroundColor: darkMode ? '#262626' : '#ffffff', color: textColor}}
              placeholder="Describe what evidence is included..."
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium" style={{color: textColor}}>Files</label>
            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded cursor-pointer hover:bg-blue-50" style={{borderColor}}>
              <Upload size={20} style={{color: '#3b82f6'}} />
              <span style={{color: '#3b82f6'}}>Choose files to upload</span>
              <input type="file" multiple onChange={handleFileSelect} className="hidden" />
            </label>
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 border rounded" style={{borderColor}}>
                    {f.category === 'photo' ? <Image size={18} /> : <FileText size={18} />}
                    <span className="flex-1" style={{color: textColor}}>{f.fileName}</span>
                    <span className="text-xs" style={{color: darkMode ? '#9ca3af' : '#64748b'}}>
                      {(f.fileSize / 1024).toFixed(0)} KB
                    </span>
                    <button type="button" onClick={() => removeFile(i)}>
                      <Trash2 size={16} style={{color: '#ef4444'}} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2 rounded text-white font-medium disabled:opacity-50"
              style={{backgroundColor: '#10b981'}}
            >
              {uploading ? 'Uploading...' : 'Upload Evidence'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2 rounded" style={{backgroundColor: darkMode ? '#404040' : '#e5e7eb', color: textColor}}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaticEvidenceUploader;
