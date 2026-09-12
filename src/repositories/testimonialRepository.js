/**
 * Testimonial Repository
 * Data Access Layer for Client Testimonials.
 */
import { testimonialsData } from '../data/testimonialsData';
import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';

export const testimonialRepository = {
  async getAllTestimonials() {
    try {
      const res = await apiClient(ENDPOINTS.TESTIMONIALS);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (_) {
      // Fallback to static local data
    }
    return testimonialsData;
  }
};

export default testimonialRepository;
