/**
 * Server Contact Controller
 */
const { formatSuccessResponse } = require('../utils/helpers');

module.exports = {
  submitContact: async (req, res, next) => {
    try {
      const payload = req.body;
      const contactRecord = {
        id: `CNT-${Date.now()}`,
        ...payload,
        submittedAt: new Date().toISOString()
      };
      res.status(201).json(formatSuccessResponse(contactRecord, 'Contact submission received.'));
    } catch (err) {
      next(err);
    }
  }
};
