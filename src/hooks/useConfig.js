import { useState, useEffect } from 'react';
import { getCompleteConfig } from '../services/configAPI';

// Global state for configuration
let globalConfig = null;
let globalLoading = true;
let globalError = null;
let listeners = [];

// Initialize configuration on app start
const initializeConfig = async () => {
  try {
    globalLoading = true;
    globalError = null;
    notifyListeners();
    
    const config = await getCompleteConfig();
    globalConfig = config;
    globalLoading = false;
    notifyListeners();
  } catch (error) {
    console.error('Failed to initialize configuration:', error);
    globalError = error.message;
    globalLoading = false;
    notifyListeners();
  }
};

// Notify all listeners of state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Subscribe to configuration changes
const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// Custom hook to use configuration
export const useConfig = () => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    try {
      // Subscribe to configuration changes
      const unsubscribe = subscribe(() => {
        forceUpdate({});
      });
      
      // Initialize config if not already loading or loaded
      if (globalConfig === null && globalLoading) {
        // First time - trigger initialization
        initializeConfig().catch(() => {});
      }
      
      return unsubscribe;
    } catch (error) {
      globalError = error.message;
      globalLoading = false;
    }
  }, []);
  
  return {
    config: globalConfig,
    loading: globalLoading,
    error: globalError,
    refresh: initializeConfig
  };
};

// Hook to get audit structure
export const useAuditStructure = () => {
  const { config, loading, error } = useConfig();
  return {
    auditStructure: config?.auditStructure || {},
    loading,
    error
  };
};

// Hook to get evidence requirements
export const useEvidenceRequirements = (controlId = null) => {
  try {
    const { config, loading, error } = useConfig();
    
    if (controlId) {
      return {
        requirements: config?.evidenceRequirements?.[controlId] || [],
        loading: loading ?? true,
        error: error || null
      };
    }
    
    return {
      evidenceRequirements: config?.evidenceRequirements || {},
      loading: loading ?? true,
      error: error || null
    };
  } catch (err) {
    return controlId ? {
      requirements: [],
      loading: false,
      error: err.message
    } : {
      evidenceRequirements: {},
      loading: false,
      error: err.message
    };
  }
};

// Hook to get form types
export const useFormTypes = () => {
  try {
    const { config, loading, error } = useConfig();
    return {
      formTypes: config?.formTypes || [],
      loading: loading ?? true,
      error: error || null
    };
  } catch (err) {
    return {
      formTypes: [],
      loading: false,
      error: err.message
    };
  }
};

// Hook to get evidence mappings
export const useEvidenceMappings = () => {
  const { config, loading, error } = useConfig();
  return {
    evidenceMappings: config?.evidenceMappings || {},
    loading,
    error
  };
};

// Hook to get static evidence controls
export const useStaticEvidenceControls = () => {
  try {
    const { config, loading, error } = useConfig();
    return {
      staticEvidenceControls: config?.staticEvidenceControls || [],
      loading: loading ?? true,
      error: error || null
    };
  } catch (err) {
    return {
      staticEvidenceControls: [],
      loading: false,
      error: err.message
    };
  }
};

// Hook to get template-only controls
export const useTemplateOnlyControls = () => {
  const { config, loading, error } = useConfig();
  return {
    templateOnlyControls: config?.templateOnlyControls || [],
    loading,
    error
  };
};

// Hook to check if control is template-only
export const useIsTemplateOnly = (controlId) => {
  const { config, loading, error } = useConfig();
  
  const isTemplateOnly = config?.templateOnlyControls?.some(
    ctrl => ctrl.controlId === controlId
  ) || false;
  
  return {
    isTemplateOnly,
    loading,
    error
  };
};

// Hook to get applicable form types for a control
export const useApplicableFormTypes = (controlId) => {
  try {
    const { config, loading, error } = useConfig();
    
    const category = controlId?.match(/^\d+\.\d+/)?.[0];
    const applicableTypes = [];
    
    if (category && config?.evidenceMappings) {
      for (const [formType, categories] of Object.entries(config.evidenceMappings)) {
        if (categories.includes(category)) {
          applicableTypes.push(formType);
        }
      }
    }
    
    return {
      applicableFormTypes: applicableTypes,
      loading: loading ?? true,
      error: error || null
    };
  } catch (err) {
    return {
      applicableFormTypes: [],
      loading: false,
      error: err.message
    };
  }
};

// Initialize configuration when module loads
if (typeof window !== 'undefined') {
  initializeConfig();
}

export default useConfig;
