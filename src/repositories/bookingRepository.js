/**
 * Booking Repository
 * Data Access Layer for Service Bookings.
 */
import { saveServiceBooking, getBookingRecord } from '../lib/supabaseClient';

export const bookingRepository = {
  async createBooking(payload, files = []) {
    return await saveServiceBooking(payload, files);
  },

  async getBookingById(bookingId) {
    return getBookingRecord(bookingId);
  }
};

export default bookingRepository;
