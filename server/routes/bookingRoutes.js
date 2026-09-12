const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBookingBody } = require('../middleware/validation');

router.post('/', validateBookingBody, bookingController.createBooking);
router.get('/:id', bookingController.getBookingById);

module.exports = router;
