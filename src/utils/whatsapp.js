/**
 * WhatsApp Helper Utilities for Pulse Blend Media
 */

export const OWNER_WHATSAPP_NUMBER = '916304834605';
export const WHATSAPP_BASE_URL = `https://wa.me/${OWNER_WHATSAPP_NUMBER}`;

/**
 * Constructs the pre-filled WhatsApp message for service bookings.
 */
export function buildWhatsAppMessage(formData, bookingId, fileNames = []) {
  const fullName = formData.fullName ? formData.fullName.trim() : '';
  const email = formData.email ? formData.email.trim() : '';
  const country = formData.country || '';
  const state = formData.state || '';
  const mobileNumber = `${formData.countryCode || '+91'} ${formData.mobile ? formData.mobile.trim() : ''}`.trim();
  
  let service = formData.selectedService || '';
  if (formData.selectedService === 'Custom Requirement' && formData.customServiceName) {
    service = `Custom Requirement (${formData.customServiceName.trim()})`;
  }

  const projectRequirements = formData.projectRequirements ? formData.projectRequirements.trim() : '';
  const preferredDate = formData.preferredDate ? formData.preferredDate : 'Flexible / Not Specified';
  
  let preferredTime = formData.preferredTimeSlot || 'Flexible Slot (Recommended)';
  if (formData.preferredTimeSlot === 'Custom Slot' && formData.customTimeSlot) {
    preferredTime = formData.customTimeSlot.trim();
  }

  const estimatedBudget = formData.estimatedBudget ? formData.estimatedBudget : '0';
  const referenceLink = formData.referenceLink && formData.referenceLink.trim() ? formData.referenceLink.trim() : 'None';
  
  const formattedFiles = fileNames && fileNames.length > 0 ? fileNames.join(', ') : 'None';

  return `🔔 NEW PULSE_BLEND_MEDIA BOOKING

Booking ID: ${bookingId}

CUSTOMER DETAILS
Name: ${fullName}
Email: ${email}
Country: ${country}
State: ${state}
Mobile: ${mobileNumber}

SERVICE DETAILS
Service: ${service}

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
${formattedFiles}

Status:
REQUESTED`;
}

/**
 * Generates the full WhatsApp URL with encoded message.
 */
export function generateWhatsAppUrl(message) {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
