/**
 * Server Booking Controller
 * Handles backend booking operations.
 */
const bookingRepository = require('../repositories/bookingRepository');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');

module.exports = {
  createBooking: async (req, res, next) => {
    try {
      const payload = req.body;
      const currentYear = new Date().getFullYear();
      const seq = Math.floor(1000 + Math.random() * 9000);
      const bookingId = payload.bookingId || `PBM-${currentYear}-${seq}`;
      const createdAt = payload.createdAt || new Date().toISOString();

      const bookingRecord = {
        booking_id: bookingId,
        full_name: payload.customer?.fullName || payload.full_name || '',
        email: payload.customer?.email || payload.email || '',
        country: payload.customer?.country || payload.country || '',
        state: payload.customer?.state || payload.state || '',
        country_code: payload.customer?.countryCode || '+91',
        mobile_number: payload.customer?.mobileNumber || payload.mobile_number || '',
        service: payload.service?.selectedService || payload.service || '',
        custom_service_name: payload.service?.customServiceName || payload.custom_service_name || null,
        project_requirements: payload.service?.projectRequirements || payload.project_requirements || '',
        preferred_date: payload.service?.preferredDate || payload.preferred_date || null,
        preferred_time: payload.service?.preferredTime || payload.preferred_time || null,
        estimated_budget: payload.service?.estimatedBudget || payload.estimated_budget || 0,
        reference_link: payload.service?.referenceLink || payload.reference_link || null,
        reference_files: payload.referenceFiles || payload.uploaded_files || [],
        terms_accepted: payload.consent?.termsAccepted ?? true,
        privacy_accepted: payload.consent?.privacyAccepted ?? true,
        status: payload.status || 'REQUESTED',
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
