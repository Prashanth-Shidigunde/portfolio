/**
 * Feedback Business Service
 * Handles user feedback submissions and retrieving approved client feedback from Supabase.
 */
import { supabase } from '../lib/supabase';

export const feedbackService = {
  /**
   * Submit new user feedback to Supabase user_feedback table
   * @param {Object} feedbackPayload
   * @returns {Promise<{success: boolean, message?: string, error?: any, record?: any}>}
   */
  async submitFeedback(feedbackPayload) {
    if (!supabase) {
      console.warn('⚠️ Supabase client is not configured.');
      return {
        success: false,
        message: 'Supabase client is not configured. Please check environment variables.'
      };
    }

    try {
      const record = {
        full_name: feedbackPayload.fullName ? feedbackPayload.fullName.trim() : '',
        email: feedbackPayload.email ? feedbackPayload.email.trim() : null,
        service: feedbackPayload.service && feedbackPayload.service !== 'Select a service' ? feedbackPayload.service : null,
        rating: Number(feedbackPayload.rating) || 5,
        feedback: feedbackPayload.feedback ? feedbackPayload.feedback.trim() : '',
        role: feedbackPayload.role && feedbackPayload.role !== 'Select role / profession' ? feedbackPayload.role : null,
        display_consent: Boolean(feedbackPayload.displayConsent),
        status: 'PENDING',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_feedback')
        .insert([record]);

      if (error) {
        console.error('❌ SUPABASE DB FEEDBACK INSERT ERROR:', error);
        return {
          success: false,
          message: `Database Insert Error (${error.code || 'RLS'}): ${error.message}`,
          error: error.message
        };
      }

      console.log('🎉 SUPABASE FEEDBACK SUBMISSION SUCCESS');
      return {
        success: true
      };
    } catch (err) {
      console.error('❌ Unexpected Supabase Feedback Exception:', err);
      return {
        success: false,
        message: err.message || 'An unexpected error occurred while submitting feedback.'
      };
    }
  },

  /**
   * Fetch approved user feedback records ordered by created_at DESC
   * @returns {Promise<Array>}
   */
  async getApprovedFeedback() {
    if (!supabase) {
      console.warn('⚠️ Supabase client not initialized. Cannot load approved feedback.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('id, full_name, service, rating, feedback, role, created_at')
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching approved feedback:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('❌ Exception fetching approved feedback:', err);
      return [];
    }
  },

  /**
   * Get single feedback by ID
   * @param {string} id
   */
  async getFeedbackById(id) {
    if (!supabase || !id) return null;

    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('id, full_name, service, rating, feedback, role, created_at')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return data;
    } catch (err) {
      console.error('❌ Error fetching feedback by id:', err);
      return null;
    }
  }
};

export default feedbackService;
