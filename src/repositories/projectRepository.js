/**
 * Project Repository
 * Data Access Layer for Portfolio Projects & Works.
 */
import { projectsData, projectCategories } from '../data/projectsData';
import apiClient from '../api/client';
import ENDPOINTS from '../api/endpoints';

export const projectRepository = {
  async getAllProjects() {
    try {
      const res = await apiClient(ENDPOINTS.PROJECTS);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (_) {
      // Fallback to static local data
    }
    return projectsData;
  },

  async getProjectCategories() {
    return projectCategories;
  },

  async getProjectsByCategory(category) {
    const projects = await this.getAllProjects();
    if (!category || category === 'ALL') return projects;
    return projects.filter((p) => p.category.toUpperCase() === category.toUpperCase());
  }
};

export default projectRepository;
