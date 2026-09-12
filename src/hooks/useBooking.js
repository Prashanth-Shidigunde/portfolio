import { useState } from 'react';
import bookingService from '../services/bookingService';

export function useBooking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const submitBooking = async (formData, selectedFiles = []) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await bookingService.submitBooking(formData, selectedFiles);

      if (result && result.success) {
        setSubmittedData({
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
          bookingId: result.bookingId,
          record: result.bookingRecord,
          whatsappStatus: result.whatsappStatus
        });
        setIsSubmitted(true);
        return { success: true, bookingId: result.bookingId };
      } else {
        const err = result?.message || "We couldn't submit your booking request. Please try again.";
        setSubmitError(err);
        return { success: false, error: err };
      }
    } catch (err) {
      console.error('Booking Submission Hook Error:', err);
      const errMsg = "We couldn't submit your booking request. Please try again.";
      setSubmitError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBookingState = () => {
    setIsSubmitting(false);
    setSubmitError('');
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return {
    isSubmitting,
    submitError,
    setSubmitError,
    isSubmitted,
    setIsSubmitted,
    submittedData,
    setSubmittedData,
    submitBooking,
    resetBookingState
  };
}

export default useBooking;
