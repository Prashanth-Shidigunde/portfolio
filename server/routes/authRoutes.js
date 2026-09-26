/**
 * Auth & Excel Integration Routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/microsoft/login', authController.getLoginUrl);
router.get('/microsoft/callback', authController.handleCallback);
router.get('/microsoft/status', authController.getStatus);
router.post('/microsoft/test-connection', authController.testConnection);
router.post('/microsoft/test-write', authController.testWrite);

module.exports = router;
