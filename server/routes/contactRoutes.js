const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { validateContactBody } = require('../middleware/validation');

router.post('/', validateContactBody, contactController.submitContact);

module.exports = router;
