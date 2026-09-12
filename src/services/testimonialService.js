/**
 * Testimonial Business Service
 */
import testimonialRepository from '../repositories/testimonialRepository';

export const testimonialService = {
  async getTestimonials() {
    return await testimonialRepository.getAllTestimonials();
  }
};

export default testimonialService;
