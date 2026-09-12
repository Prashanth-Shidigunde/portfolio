/**
 * Server Service Controller
 */
const serviceRepository = require('../repositories/serviceRepository');
const { formatSuccessResponse } = require('../utils/helpers');

module.exports = {
  getAllServices: async (req, res, next) => {
    try {
      const services = await serviceRepository.findAll();
      res.json(formatSuccessResponse(services));
    } catch (err) {
      next(err);
    }
  }
};
