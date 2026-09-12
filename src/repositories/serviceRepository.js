/**
 * Service Repository
 * Data Access Layer for Services.
 * Currently fetches local static data; future Supabase integration switches data source here.
 */
import { servicesData, extraServicesData } from '../data/servicesData';
import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';

export const serviceRepository = {
  async getAllServices() {
    // Try remote API if available, fallback to static local data
    try {
      const res = await apiClient(ENDPOINTS.SERVICES);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (_) {
      // Gracefully handle network / API unavailability
    }

    return servicesData;
  },

  async getExtraServices() {
    return extraServicesData;
  },

  async getServiceByTitle(title) {
    const services = await this.getAllServices();
    return services.find((s) => s.title.toLowerCase() === title.toLowerCase()) || null;
  }
};

export default serviceRepository;
