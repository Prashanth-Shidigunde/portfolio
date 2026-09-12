/**
 * Notification Service
 * Orchestrates WhatsApp notifications to owner number.
 */
import { OWNER_WHATSAPP_RAW } from '../utils/constants';

export const notificationService = {
  buildWhatsAppBookingMessage(bookingRecord) {
    return [
      `🔔 NEW PULSE_BLEND_MEDIA BOOKING`,
      ``,
      `Booking ID: ${bookingRecord.booking_id || bookingRecord.bookingId}`,
      `Name: ${bookingRecord.full_name || bookingRecord.customer?.fullName}`,
      `Email: ${bookingRecord.email || bookingRecord.customer?.email}`,
      `Mobile: ${bookingRecord.mobile_number || bookingRecord.customer?.mobile}`,
      `Country: ${bookingRecord.country || bookingRecord.customer?.country}`,
      `State: ${bookingRecord.state || bookingRecord.customer?.state}`,
      ``,
      `Service: ${bookingRecord.service || bookingRecord.service?.selectedService}`,
      ``,
      `Requirements:`,
      `${bookingRecord.project_requirements || bookingRecord.service?.projectRequirements}`,
      ``,
      `Preferred Date: ${bookingRecord.preferred_date || bookingRecord.service?.preferredDate || 'Flexible'}`,
      `Preferred Time: ${bookingRecord.preferred_time || bookingRecord.service?.preferredTimeSlot || 'Flexible'}`,
      ``,
      `Estimated Budget: ₹${bookingRecord.estimated_budget || bookingRecord.service?.estimatedBudget}`,
      ``,
      `Booking Status: ${bookingRecord.status || 'REQUESTED'}`
    ].join('\n');
  },

  openWhatsAppOwnerChat(bookingRecord) {
    const message = this.buildWhatsAppBookingMessage(bookingRecord);
    const waUrl = `https://wa.me/${OWNER_WHATSAPP_RAW}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
};

export default notificationService;
