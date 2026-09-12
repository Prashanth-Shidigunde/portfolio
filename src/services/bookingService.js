/**
 * Booking Business Service
 */
import bookingRepository from '../repositories/bookingRepository';
import { validateBookingForm } from '../utils/validation';

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
        termsAccepted: true,
        privacyAccepted: true,
        submittedAt: new Date().toISOString()
      }
    };

    const res = await bookingRepository.createBooking(payload, files);
    return res;
  },

  async getBooking(bookingId) {
    return await bookingRepository.getBookingById(bookingId);
  }
};

export default bookingService;
