/**
 * Server Helper Utilities
 */
module.exports = {
  formatSuccessResponse: (data, message = 'Success') => ({
    success: true,
    message,
    data
  }),

  formatErrorResponse: (message = 'An error occurred', errorCode = 'SERVER_ERROR') => ({
    success: false,
    message,
    errorCode
  })
};
