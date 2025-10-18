const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

export const authAPI = {
  login: async (username, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (data.token) localStorage.setItem('token', data.token);
    return data.user;
  }
};

export const documentAPI = {
  getAll: () => apiCall('/documents'),
  getByControl: (controlId) => apiCall(`/documents/control/${controlId}`),
  getById: (id) => apiCall(`/documents/${id}`),
  create: (data) => apiCall('/documents', { method: 'POST', body: JSON.stringify(data) }),
  sign: (id, role, userInfo) => apiCall(`/documents/${id}/sign`, { method: 'POST', body: JSON.stringify({ role, userInfo }) }),
  revoke: (id, role) => apiCall(`/documents/${id}/revoke`, { method: 'POST', body: JSON.stringify({ role }) }),
  delete: (id) => apiCall(`/documents/${id}`, { method: 'DELETE' })
};

export const templateAPI = {
  getAll: () => apiCall('/templates'),
  getByControl: (controlId) => apiCall(`/templates/${controlId}`),
  exists: (controlId) => apiCall(`/templates/${controlId}/exists`),
  save: (controlId, content, modifiedBy) => apiCall('/templates', { method: 'POST', body: JSON.stringify({ controlId, content, modifiedBy }) }),
  delete: (controlId) => apiCall(`/templates/${controlId}`, { method: 'DELETE' })
};
