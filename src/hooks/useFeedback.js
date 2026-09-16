import { useState, useEffect, useCallback } from 'react';
import feedbackService from '../services/feedbackService';

const COOLDOWN_KEY = 'pbm_last_feedback_submission';
const COOLDOWN_TIME_MS = 60 * 1000; // 60 seconds cooldown between submissions

export function useFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchApprovedFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackService.getApprovedFeedback();
      setFeedbackList(data || []);
    } catch (err) {
      console.error('Failed to load approved feedback:', err);
      setError('Feedback is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedFeedback();

    const handleFocus = () => {
      fetchApprovedFeedback();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchApprovedFeedback]);

  const submitFeedback = async (formData) => {
    // Spam / Cooldown protection
    const lastSubmitTime = localStorage.getItem(COOLDOWN_KEY);
    if (lastSubmitTime) {
      const elapsed = Date.now() - parseInt(lastSubmitTime, 10);
      if (elapsed < COOLDOWN_TIME_MS) {
        const remainingSec = Math.ceil((COOLDOWN_TIME_MS - elapsed) / 1000);
        const errMsg = `Please wait ${remainingSec} second${remainingSec > 1 ? 's' : ''} before submitting another feedback request.`;
        setSubmitError(errMsg);
        return { success: false, message: errMsg };
      }
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await feedbackService.submitFeedback(formData);

      if (res.success) {
        setSubmitSuccess(true);
        localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
        return { success: true };
      } else {
        setSubmitError(res.message || 'Failed to submit feedback. Please try again.');
        return { success: false, message: res.message };
      }
    } catch (err) {
      const errMsg = err.message || 'An unexpected error occurred.';
      setSubmitError(errMsg);
      return { success: false, message: errMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormState = () => {
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError('');
  };

  return {
    feedbackList,
    loading,
    error,
    refetch: fetchApprovedFeedback,
    isSubmitting,
    submitSuccess,
    submitError,
    submitFeedback,
    resetFormState
  };
}

export default useFeedback;
