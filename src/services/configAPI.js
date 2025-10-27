const API_URL = 'http://localhost:5000/api/config';

// Helper function for API calls
const apiCall = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return await response.json();
};

// Cache for configuration data
let configCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get complete configuration (cached)
export const getCompleteConfig = async (forceRefresh = false) => {
  const now = Date.now();
  
  // Return cached data if available and not expired
  if (!forceRefresh && configCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
    return configCache;
  }
  
  try {
    const data = await apiCall('/complete');
    configCache = data;
    cacheTimestamp = now;
    return data;
  } catch (error) {
    console.error('Error fetching complete config:', error);
    // Return cached data if available, even if expired
    if (configCache) {
      console.warn('Using expired cache due to fetch error');
      return configCache;
    }
    throw error;
  }
};

// Clear cache
export const clearConfigCache = () => {
  configCache = null;
  cacheTimestamp = null;
};

// Get audit structure
export const getAuditStructure = async () => {
  try {
    return await apiCall('/audit-structure/formatted');
  } catch (error) {
    console.error('Error fetching audit structure:', error);
    throw error;
  }
};

// Get evidence requirements
export const getEvidenceRequirements = async () => {
  try {
    return await apiCall('/evidence-requirements');
  } catch (error) {
    console.error('Error fetching evidence requirements:', error);
    throw error;
  }
};

// Get evidence requirements for specific control
export const getEvidenceRequirementsForControl = async (controlId) => {
  try {
    const data = await apiCall(`/evidence-requirements/${controlId}`);
    return data.requirements || [];
  } catch (error) {
    console.error('Error fetching evidence requirements for control:', error);
    return [];
  }
};

// Get form type definitions
export const getFormTypes = async () => {
  try {
    return await apiCall('/form-types');
  } catch (error) {
    console.error('Error fetching form types:', error);
    throw error;
  }
};

// Get form type by value
export const getFormType = async (value) => {
  try {
    return await apiCall(`/form-types/${value}`);
  } catch (error) {
    console.error('Error fetching form type:', error);
    return null;
  }
};

// Get evidence mappings
export const getEvidenceMappings = async () => {
  try {
    return await apiCall('/evidence-mappings');
  } catch (error) {
    console.error('Error fetching evidence mappings:', error);
    throw error;
  }
};

// Get static evidence controls
export const getStaticEvidenceControls = async () => {
  try {
    return await apiCall('/static-evidence-controls');
  } catch (error) {
    console.error('Error fetching static evidence controls:', error);
    throw error;
  }
};

// Get template-only controls
export const getTemplateOnlyControls = async () => {
  try {
    return await apiCall('/template-only-controls');
  } catch (error) {
    console.error('Error fetching template-only controls:', error);
    throw error;
  }
};

// Check if control is template-only
export const isTemplateOnlyControl = async (controlId) => {
  try {
    const data = await apiCall(`/template-only-controls/${controlId}`);
    return data.isTemplateOnly;
  } catch (error) {
    console.error('Error checking template-only control:', error);
    return false;
  }
};

// Get applicable form types for a control
export const getApplicableFormTypes = async (controlId) => {
  try {
    return await apiCall(`/applicable-forms/${controlId}`);
  } catch (error) {
    console.error('Error fetching applicable form types:', error);
    return [];
  }
};

// Get template content for a control
export const getTemplateContent = async (controlId) => {
  try {
    return await apiCall(`/template-content/${controlId}`);
  } catch (error) {
    console.error('Error fetching template content:', error);
    return null;
  }
};

// Get all template contents
export const getAllTemplateContents = async () => {
  try {
    return await apiCall('/template-contents');
  } catch (error) {
    console.error('Error fetching template contents:', error);
    throw error;
  }
};

// Helper functions for frontend compatibility
export const getFormLabel = (formTypes, value) => {
  const formType = formTypes.find(ft => ft.value === value);
  return formType ? formType.label : value;
};

export const getFormIcon = (formTypes, value) => {
  const formType = formTypes.find(ft => ft.value === value);
  return formType ? formType.icon : '📝';
};

export const needsStaticEvidence = (staticEvidenceControls, controlId) => {
  const category = controlId.match(/^\d+\.\d+/)?.[0];
  return staticEvidenceControls.some(ctrl => ctrl.category === category);
};

export const hasEvidenceCapability = (templateOnlyControls, evidenceMappings, staticEvidenceControls, controlId) => {
  // Check if it's a template-only control
  const isTemplateOnly = templateOnlyControls.some(ctrl => ctrl.controlId === controlId);
  if (isTemplateOnly) {
    return false;
  }
  
  // Check if it matches *.x.1 pattern (general template-only pattern)
  if (controlId.match(/^\d+\.\d+\.1$/)) {
    return false;
  }
  
  // Check if it has form types or static evidence
  const category = controlId.match(/^\d+\.\d+/)?.[0];
  const hasFormTypes = Object.values(evidenceMappings).some(categories => 
    categories.includes(category)
  );
  const hasStaticEvidence = staticEvidenceControls.some(ctrl => ctrl.category === category);
  
  return hasFormTypes || hasStaticEvidence;
};

export default {
  getCompleteConfig,
  clearConfigCache,
  getAuditStructure,
  getEvidenceRequirements,
  getEvidenceRequirementsForControl,
  getFormTypes,
  getFormType,
  getEvidenceMappings,
  getStaticEvidenceControls,
  getTemplateOnlyControls,
  isTemplateOnlyControl,
  getApplicableFormTypes,
  getTemplateContent,
  getAllTemplateContents,
  getFormLabel,
  getFormIcon,
  needsStaticEvidence,
  hasEvidenceCapability
};
