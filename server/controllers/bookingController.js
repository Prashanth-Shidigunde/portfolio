/**
 * Server Booking Controller
 */
const bookingRepository = require('../repositories/bookingRepository');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');

module.exports = {
  createBooking: async (req, res, next) => {
    try {
      const payload = req.body;
      const currentYear = new Date().getFullYear();
      const seq = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `PBM-${currentYear}-${seq}`;
      const createdAt = new Date().toISOString();

      const bookingRecord = {
        booking_id: bookingId,
        full_name: payload.customer.fullName,
        email: payload.customer.email,
        country: payload.customer.country,
        state: payload.customer.state,
        country_code: payload.customer.countryCode || '+91',
        mobile_number: payload.customer.mobile,
        service: payload.service.selectedService,
        custom_service_name: payload.service.customServiceName || null,
        project_requirements: payload.service.projectRequirements,
        preferred_date: payload.service.preferredDate || null,
        preferred_time: payload.service.preferredTimeSlot || null,
        estimated_budget: payload.service.estimatedBudget,
        reference_link: payload.service.referenceLink || null,
        reference_files: payload.references || [],
        terms_accepted: payload.consent?.termsAccepted || true,
        privacy_accepted: payload.consent?.privacyAccepted || true,
        status: 'REQUESTED',
        created_at: createdAt
      };

      await bookingRepository.create(bookingRecord);

      res.status(201).json(formatSuccessResponse({
        bookingId,
        bookingRecord
      }, 'Booking created successfully.'));
    } catch (err) {
      next(err);
    }
  },

  getBookingById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const record = await bookingRepository.findById(id);
      if (!record) {
        return res.status(404).json(formatErrorResponse('Booking not found.', 'NOT_FOUND'));
      }
      res.json(formatSuccessResponse(record));
    } catch (err) {
      next(err);
    }
  }
};
