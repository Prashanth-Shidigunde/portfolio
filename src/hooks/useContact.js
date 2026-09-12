import { useState } from 'react';
import contactService from '../services/contactService';

export function useContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitContact = async (formData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await contactService.submitContactForm(formData);
      if (result && result.success) {
        setIsSubmitted(true);
        return { success: true };
      } else {
        const err = result?.message || 'Failed to submit contact message. Please try again.';
        setSubmitError(err);
        return { success: false, error: err };
      }
    } catch (err) {
      console.error('Contact Form Hook Error:', err);
      const errMsg = 'Failed to submit contact message. Please try again.';
      setSubmitError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetContactState = () => {
    setIsSubmitting(false);
    setSubmitError('');
    setIsSubmitted(false);
  };

  return {
    isSubmitting,
    submitError,
    isSubmitted,
    submitContact,
    resetContactState
  };
}

export default useContact;
