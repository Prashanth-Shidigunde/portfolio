/**
 * Server Auth Controller
 * Handles Owner Personal Microsoft Account OAuth authentication & Excel connection testing.
 */
const excelSyncService = require('../services/excelSyncService');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');

module.exports = {
  getLoginUrl: (req, res, next) => {
    try {
      const url = excelSyncService.getOAuthLoginUrl();
      res.json(formatSuccessResponse({ url }, 'OAuth authorization URL generated.'));
    } catch (err) {
      res.status(400).json(formatErrorResponse(err.message));
    }
  },

  handleCallback: async (req, res, next) => {
    try {
      const { code, error, error_description } = req.query;

      if (error) {
        return res.redirect(`/admin/microsoft-excel?status=error&message=${encodeURIComponent(error_description || error)}`);
      }

      if (!code) {
        return res.redirect('/admin/microsoft-excel?status=error&message=No+authorization+code+provided');
      }

      await excelSyncService.handleOAuthCallback(code);
      res.redirect('/admin/microsoft-excel?status=connected');
    } catch (err) {
      res.redirect(`/admin/microsoft-excel?status=error&message=${encodeURIComponent(err.message)}`);
    }
  },

  getStatus: async (req, res, next) => {
    try {
      const status = await excelSyncService.getConnectionStatus();
      res.json(formatSuccessResponse(status));
    } catch (err) {
      next(err);
    }
  },

  testConnection: async (req, res, next) => {
    try {
      const result = await excelSyncService.testConnection();
      if (result.success) {
        res.json(formatSuccessResponse(result, result.message));
      } else {
        res.status(400).json(formatErrorResponse(result.message, 'CONNECTION_TEST_FAILED', result));
      }
    } catch (err) {
      next(err);
    }
  },

  testWrite: async (req, res, next) => {
    try {
      const result = await excelSyncService.testWrite();
      if (result.success) {
        res.json(formatSuccessResponse(result, 'Safe test write executed successfully.'));
      } else {
        res.status(400).json(formatErrorResponse(result.message || 'Test write failed', 'TEST_WRITE_FAILED', result));
      }
    } catch (err) {
      next(err);
    }
  }
};
