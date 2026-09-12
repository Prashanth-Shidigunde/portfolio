/**
 * Service Business Service
 */
import serviceRepository from '../repositories/serviceRepository';

export const serviceService = {
  async getServices() {
    return await serviceRepository.getAllServices();
  },

  async getExtraServices() {
    return await serviceRepository.getExtraServices();
  },

  async getServiceByTitle(title) {
    return await serviceRepository.getServiceByTitle(title);
  }
};

export default serviceService;
