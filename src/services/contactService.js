/**
 * Contact Form Service
 */
import contactRepository from '../repositories/contactRepository';
import { validateContactForm } from '../utils/validation';

export const contactService = {
  async submitContactForm(formData) {
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        message: 'Please complete all required contact form fields.'
      };
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      service: formData.service || 'General Inquiry',
      message: formData.message.trim(),
      submittedAt: new Date().toISOString()
    };

    return await contactRepository.submitContact(payload);
  }
};

export default contactService;
