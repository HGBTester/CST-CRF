import { useState, useEffect } from 'react';
import { evidenceFormsAPI } from '../services/evidenceFormsAPI';

// Custom hook to fetch and manage evidence counts for all controls
export function useEvidenceCounts() {
  const [evidenceCounts, setEvidenceCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchEvidenceCounts = async () => {
    try {
      const forms = await evidenceFormsAPI.getAll();
      
      // Count forms by controlId
      const counts = {};
      forms.forEach(form => {
        if (form.controlId) {
          counts[form.controlId] = (counts[form.controlId] || 0) + 1;
        }
      });
      
      setEvidenceCounts(counts);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch evidence counts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidenceCounts();
  }, []);

  return { evidenceCounts, loading, refetch: fetchEvidenceCounts };
}
