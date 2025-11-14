const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE_URL}/evidence-checklist`;

export const evidenceChecklistAPI = {
  // Get checklist items for a control
  async getByControl(controlId) {
    const response = await fetch(`${API_URL}/control/${controlId}`);
    if (!response.ok) throw new Error('Failed to fetch checklist');
    return response.json();
  },

  // Get progress for a control
  async getProgress(controlId) {
    const response = await fetch(`${API_URL}/progress/${controlId}`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    return response.json();
  },

  // Get available forms for a control
  async getAvailableForms(controlId) {
    const response = await fetch(`${API_URL}/available-forms/${controlId}`);
    if (!response.ok) throw new Error('Failed to fetch available forms');
    return response.json();
  },

  // Initialize checklist for a control
  async initialize(controlId, requirements) {
    const response = await fetch(`${API_URL}/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ controlId, requirements })
    });
    if (!response.ok) throw new Error('Failed to initialize checklist');
    return response.json();
  },

  // Upload evidence file for a checklist item
  async uploadEvidence(controlId, requirementId, file, notes, userId, userName) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes || '');
    formData.append('userId', userId);
    formData.append('userName', userName);

    const response = await fetch(`${API_URL}/upload/${controlId}/${requirementId}`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload evidence');
    return response.json();
  },

  // Download evidence file
  async downloadEvidence(itemId) {
    const response = await fetch(`${API_URL}/download/${itemId}`);
    if (!response.ok) throw new Error('Failed to download evidence');
    return response.blob();
  },

  // Delete evidence for a checklist item
  async deleteEvidence(itemId) {
    const response = await fetch(`${API_URL}/${itemId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete evidence');
    return response.json();
  },

  // Get progress for a control
  async getProgress(controlId) {
    const response = await fetch(`${API_URL}/progress/${controlId}`);
    if (!response.ok) throw new Error('Failed to fetch progress');
    return response.json();
  },

  // Link an existing form to a checklist item
  async linkForm(controlId, requirementId, formId, userId, userName, notes) {
    const response = await fetch(`${API_URL}/link-form/${controlId}/${requirementId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, userId, userName, notes })
    });
    if (!response.ok) throw new Error('Failed to link form');
    return response.json();
  },

  // Create a new form and link it to a checklist item
  async createForm(controlId, requirementId, formType, formData, userId, userName) {
    const response = await fetch(`${API_URL}/create-form/${controlId}/${requirementId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, formData, userId, userName })
    });
    if (!response.ok) throw new Error('Failed to create form');
    return response.json();
  },

  // Get available forms for linking to a control
  async getAvailableForms(controlId) {
    const response = await fetch(`${API_URL}/available-forms/${controlId}`);
    if (!response.ok) throw new Error('Failed to fetch available forms');
    return response.json();
  }
};
