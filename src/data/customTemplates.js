// Custom template storage for AI-modified documents
// In Stage 3, this will be connected to a backend database

let customTemplates = {};

export const saveCustomTemplate = (controlId, content) => {
  customTemplates[controlId] = {
    content,
    modifiedAt: new Date().toISOString(),
    version: customTemplates[controlId] ? customTemplates[controlId].version + 1 : 1
  };
  return customTemplates[controlId];
};

export const getCustomTemplate = (controlId) => {
  return customTemplates[controlId];
};

export const hasCustomTemplate = (controlId) => {
  return !!customTemplates[controlId];
};

export const deleteCustomTemplate = (controlId) => {
  delete customTemplates[controlId];
};

export const getAllCustomTemplates = () => {
  return { ...customTemplates };
};

// Reset for demo purposes
export const resetCustomTemplates = () => {
  customTemplates = {};
};
