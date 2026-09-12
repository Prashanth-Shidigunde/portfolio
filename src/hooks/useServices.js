import { useState, useEffect } from 'react';
import serviceService from '../services/serviceService';

export function useServices() {
  const [services, setServices] = useState([]);
  const [extraServices, setExtraServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const [mainData, extraData] = await Promise.all([
          serviceService.getServices(),
          serviceService.getExtraServices()
        ]);
        if (isMounted) {
          setServices(mainData);
          setExtraServices(extraData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load services');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { services, extraServices, loading, error };
}

export default useServices;
