/**
 * Server Booking Repository
 */
const inMemoryBookings = new Map();

module.exports = {
  create: async (bookingRecord) => {
    inMemoryBookings.set(bookingRecord.booking_id, bookingRecord);
    return bookingRecord;
  },

  findById: async (bookingId) => {
    return inMemoryBookings.get(bookingId) || null;
  },

  findAll: async () => {
    return Array.from(inMemoryBookings.values());
  }
};
