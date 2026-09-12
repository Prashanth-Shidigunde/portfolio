/**
 * Global Error Handler Middleware
 */
const { formatErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

module.exports = function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Internal Server Error', { stack: err.stack, path: req.path });
  
  const status = err.status || 500;
  const response = formatErrorResponse(
    err.message || 'Internal Server Error',
    err.code || 'INTERNAL_SERVER_ERROR'
  );

  res.status(status).json(response);
};
