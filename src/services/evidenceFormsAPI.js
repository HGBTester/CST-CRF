const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }
  return await response.json();
};

export const evidenceFormsAPI = {
  // Get all forms
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/evidence-forms?${params}`);
  },

  // Get single form
  getById: (id) => apiCall(`/evidence-forms/${id}`),

  // Get forms by control ID
  getByControl: (controlId) => apiCall(`/evidence-forms/control/${controlId}`),

  // Create new form
  create: (formData) => apiCall('/evidence-forms', {
    method: 'POST',
    body: JSON.stringify(formData)
  }),

  // Update form
  update: (id, formData) => apiCall(`/evidence-forms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  }),

  // Sign form
  sign: (id, role, userInfo, comments) => apiCall(`/evidence-forms/${id}/sign`, {
    method: 'POST',
    body: JSON.stringify({ role, userInfo, comments })
  }),

  // Upload attachment
  uploadAttachment: (id, file, uploadedBy, description, category) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy);
    formData.append('description', description);
    formData.append('category', category);

    return apiCall(`/evidence-forms/${id}/attachments`, {
      method: 'POST',
      body: formData
    });
  },

  // Delete attachment
  deleteAttachment: (formId, attachmentId, performedBy) => apiCall(`/evidence-forms/${formId}/attachments/${attachmentId}`, {
    method: 'DELETE',
    body: JSON.stringify({ performedBy })
  }),

  // Get statistics
  getStats: () => apiCall('/evidence-forms/stats/summary')
};
