/**
 * Server Request Validation Middleware
 */
const { formatErrorResponse } = require('../utils/helpers');

module.exports = {
  validateBookingBody: (req, res, next) => {
    const { customer, service } = req.body || {};
    if (!customer?.fullName || !customer?.email || !customer?.mobile) {
      return res.status(400).json(formatErrorResponse('Missing required customer details.', 'INVALID_INPUT'));
    }
    if (!service?.selectedService || !service?.projectRequirements || !service?.estimatedBudget) {
      return res.status(400).json(formatErrorResponse('Missing required service details.', 'INVALID_INPUT'));
    }
    next();
  },

  validateContactBody: (req, res, next) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json(formatErrorResponse('Missing required contact fields.', 'INVALID_INPUT'));
    }
    next();
  }
};
