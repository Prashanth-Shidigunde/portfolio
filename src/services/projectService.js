/**
 * Project Business Service
 */
import projectRepository from '../repositories/projectRepository';

export const projectService = {
  async getProjects() {
    return await projectRepository.getAllProjects();
  },

  async getCategories() {
    return await projectRepository.getProjectCategories();
  },

  async getProjectsByCategory(category) {
    return await projectRepository.getProjectsByCategory(category);
  }
};

export default projectService;
