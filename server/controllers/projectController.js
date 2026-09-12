/**
 * Server Project Controller
 */
const projectRepository = require('../repositories/projectRepository');
const { formatSuccessResponse } = require('../utils/helpers');

module.exports = {
  getAllProjects: async (req, res, next) => {
    try {
      const { category } = req.query;
      const projects = await projectRepository.findByCategory(category || 'ALL');
      res.json(formatSuccessResponse(projects));
    } catch (err) {
      next(err);
    }
  }
};
