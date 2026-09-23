/**
 * Booking Business Service
 */
import bookingRepository from '../repositories/bookingRepository';
import { validateBookingForm } from '../utils/validation';
import { buildWhatsAppMessage, generateWhatsAppUrl } from '../utils/whatsapp';

export const bookingService = {
  async submitBooking(formData, files = []) {
    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: 'Please resolve form validation errors.'
      };
    }

    const payload = {
      customer: {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        country: formData.country,
        state: formData.state,
        countryCode: formData.countryCode,
        mobile: `${formData.countryCode} ${formData.mobile.trim()}`
      },
      service: {
        selectedService: formData.selectedService,
        customServiceName: formData.selectedService === 'Custom Requirement' ? formData.customServiceName.trim() : null,
        projectRequirements: formData.projectRequirements.trim(),
        preferredDate: formData.preferredDate || null,
        preferredTimeSlot: formData.preferredTimeSlot === 'Custom Slot' ? (formData.customTimeSlot.trim() || 'Custom Slot') : formData.preferredTimeSlot,
        estimatedBudget: Number(formData.estimatedBudget),
        referenceLink: formData.referenceLink.trim() || null
      },
      references: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      consent: {
        termsAccepted: Boolean(formData.termsAccepted),
        privacyAccepted: Boolean(formData.termsAccepted),
        submittedAt: new Date().toISOString()
      }
    };

    // Step 3 & 4: Save booking data into Supabase DB & Storage
    const res = await bookingRepository.createBooking(payload, files);

    if (!res || !res.success) {
      return {
        success: false,
        message: res?.message || 'Your booking could not be submitted. Please try again.'
      };
    }

    // Step 5: Construct complete WhatsApp message containing booking info
    const fileNames = files.map((f) => f.name);
    const whatsappMsg = buildWhatsAppMessage(formData, res.bookingId, fileNames);
    const whatsappUrl = generateWhatsAppUrl(whatsappMsg);

    return {
      success: true,
      bookingId: res.bookingId,
      bookingRecord: res.bookingRecord,
      whatsappMsg,
      whatsappUrl
    };
  },

  async getBooking(bookingId) {
    return await bookingRepository.getBookingById(bookingId);
  }
};

export default bookingService;
