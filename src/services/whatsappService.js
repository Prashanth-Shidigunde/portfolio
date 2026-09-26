/**
 * WhatsApp Service for Pulse_Blend_Media
 * Generates formatted WhatsApp messages directly from bookingPayload.
 */

export const OWNER_WHATSAPP_NUMBER = '916304834605';
export const WHATSAPP_BASE_URL = `https://wa.me/${OWNER_WHATSAPP_NUMBER}`;

/**
 * Creates the pre-filled WhatsApp message string directly from bookingPayload.
 */
export function createBookingWhatsAppMessage(bookingPayload) {
  const { bookingId, customer, service, referenceFiles } = bookingPayload;

  const fullName = customer?.fullName || '';
  const email = customer?.email || '';
  const country = customer?.country || '';
  const state = customer?.state || '';
  const mobileNumber = customer?.mobileNumber || '';

  let serviceName = service?.selectedService || '';
  if (service?.selectedService === 'Custom Requirement' && service?.customServiceName) {
    serviceName = `Custom Requirement (${service.customServiceName})`;
  }

  const projectRequirements = service?.projectRequirements || '';
  const preferredDate = service?.preferredDate ? service.preferredDate : 'Flexible / Not Specified';
  const preferredTime = service?.preferredTime ? service.preferredTime : 'Flexible Slot (Recommended)';
  const estimatedBudget = service?.estimatedBudget !== undefined ? service.estimatedBudget : '0';
  const referenceLink = service?.referenceLink ? service.referenceLink : 'None';

  let fileNamesStr = 'None';
  if (referenceFiles && Array.isArray(referenceFiles) && referenceFiles.length > 0) {
    fileNamesStr = referenceFiles
      .map((f) => (typeof f === 'string' ? f : f.fileName || f.name || 'File'))
      .join(', ');
  }

  return `🔔 NEW PULSE_BLEND_MEDIA BOOKING

Booking ID: ${bookingId}

CUSTOMER DETAILS

Name: ${fullName}
Email: ${email}
Country: ${country}
State: ${state}
Mobile: ${mobileNumber}

SERVICE DETAILS

Service: ${serviceName}

Project Requirements:
${projectRequirements}

Preferred Date:
${preferredDate}

Preferred Time / Slot:
${preferredTime}

Estimated Budget:
₹${estimatedBudget}

Reference Link:
${referenceLink}

Reference Files:
${fileNamesStr}

Payment Terms:
50% advance + 50% after completion

Status:
REQUESTED`;
}

/**
 * Generates the full WhatsApp URL with encoded message payload.
 */
export function generateWhatsAppUrlFromPayload(bookingPayload) {
  const messageText = createBookingWhatsAppMessage(bookingPayload);
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(messageText)}`;
}

export const whatsappService = {
  createBookingWhatsAppMessage,
  generateWhatsAppUrlFromPayload
};

export default whatsappService;
