/**
 * Booking Business Service
 * Formats ONE ORIGINAL bookingPayload and dispatches to:
 * 1. Supabase Database & Storage (Primary)
 * 2. WhatsApp Message & URL
 */
import bookingRepository from '../repositories/bookingRepository';
import { validateBookingForm } from '../utils/validation';
import { generateBookingId } from '../lib/supabaseClient';
import whatsappService from './whatsappService';

export const bookingService = {
  async submitBooking(formData, files = []) {
    // 1. Form Validation
    const validation = validateBookingForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: 'Please resolve form validation errors.'
      };
    }

    const bookingId = generateBookingId();
    const createdAt = new Date().toISOString();

    const selectedService = formData.selectedService;
    const customServiceName = selectedService === 'Custom Requirement' ? (formData.customServiceName ? formData.customServiceName.trim() : null) : null;
    const preferredTime = formData.preferredTimeSlot === 'Custom Slot' ? (formData.customTimeSlot ? formData.customTimeSlot.trim() : 'Custom Slot') : (formData.preferredTimeSlot || 'Flexible Slot (Recommended)');

    // 2. CREATE ONE ORIGINAL SOURCE BOOKING PAYLOAD
    const bookingPayload = {
      bookingId,
      createdAt,
      status: 'REQUESTED',

      customer: {
        fullName: formData.fullName ? formData.fullName.trim() : '',
        email: formData.email ? formData.email.trim() : '',
        country: formData.country || '',
        state: formData.state || '',
        countryCode: formData.countryCode || '+91',
        mobileNumber: `${formData.countryCode || '+91'} ${formData.mobile ? formData.mobile.trim() : ''}`.trim()
      },

      service: {
        selectedService,
        customServiceName,
        projectRequirements: formData.projectRequirements ? formData.projectRequirements.trim() : '',
        preferredDate: formData.preferredDate || null,
        preferredTime,
        estimatedBudget: Number(formData.estimatedBudget) || 0,
        referenceLink: formData.referenceLink && formData.referenceLink.trim() ? formData.referenceLink.trim() : null
      },

      referenceFiles: (files || []).map((file) => ({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      })),

      consent: {
        termsAccepted: Boolean(formData.termsAccepted),
        privacyAccepted: Boolean(formData.termsAccepted)
      }
    };

    // 3. DESTINATION 1: SUPABASE DATABASE & STORAGE
    const supabaseRes = await bookingRepository.createBooking(bookingPayload, files);

    if (!supabaseRes || !supabaseRes.success) {
      return {
        success: false,
        message: supabaseRes?.message || 'Your booking could not be submitted. Please try again.'
      };
    }

    // Attach uploaded files info to payload if available
    if (supabaseRes.bookingRecord && supabaseRes.bookingRecord.uploaded_files) {
      bookingPayload.referenceFiles = supabaseRes.bookingRecord.uploaded_files;
    }

    // 4. DESTINATION 2: WHATSAPP MESSAGE (Create message directly from original bookingPayload!)
    const whatsappMsg = whatsappService.createBookingWhatsAppMessage(bookingPayload);
    const whatsappUrl = whatsappService.generateWhatsAppUrlFromPayload(bookingPayload);

    return {
      success: true,
      bookingId,
      bookingPayload,
      bookingRecord: supabaseRes.bookingRecord,
      whatsappMsg,
      whatsappUrl
    };
  },

  async getBooking(bookingId) {
    return await bookingRepository.getBookingById(bookingId);
  }
};

export default bookingService;
