/**
 * Contact Repository
 * Data Access Layer for Contact Submissions.
 */
import { saveContactSubmission } from '../lib/supabaseClient';

export const contactRepository = {
  async submitContact(payload) {
    return await saveContactSubmission(payload);
  }
};

export default contactRepository;
