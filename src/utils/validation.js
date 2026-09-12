/**
 * Centralized Validation Rules
 */

import { MAX_FILE_SIZE_MB } from './constants';

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email Address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';
  return null;
}

export function validateMobile(mobile) {
  if (!mobile || !mobile.trim()) return 'Mobile Number is required.';
  const phoneRegex = /^[0-9+\s\-()]{7,15}$/;
  if (!phoneRegex.test(mobile.trim())) return 'Please enter a valid mobile number.';
  return null;
}

export function validateUrl(urlStr) {
  if (!urlStr || !urlStr.trim()) return null;
  try {
    new URL(urlStr.trim());
    return null;
  } catch (_) {
    return 'Please enter a valid URL (e.g. https://example.com).';
  }
}

export function validatePositiveNumber(val, fieldName = 'Amount') {
  if (val === undefined || val === null || val === '') return `${fieldName} is required.`;
  const num = Number(val);
  if (isNaN(num) || num <= 0) return `Please enter a valid positive ${fieldName.toLowerCase()}.`;
  return null;
}

export function validateFileSize(file, maxMb = MAX_FILE_SIZE_MB) {
  if (!file) return null;
  if (file.size > maxMb * 1024 * 1024) {
    return `File "${file.name}" exceeds the ${maxMb}MB size limit.`;
  }
  return null;
}

export function validateBookingForm(formData) {
  const errors = {};

  if (!formData.fullName || !formData.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  }

  const emailErr = validateEmail(formData.email);
  if (emailErr) errors.email = emailErr;

  const mobileErr = validateMobile(formData.mobile);
  if (mobileErr) errors.mobile = mobileErr;

  if (!formData.selectedService || formData.selectedService === 'Select a service') {
    errors.selectedService = 'Please select a service.';
  }

  if (formData.selectedService === 'Custom Requirement' && (!formData.customServiceName || !formData.customServiceName.trim())) {
    errors.customServiceName = 'Please tell us the service name.';
  }

  if (!formData.projectRequirements || !formData.projectRequirements.trim()) {
    errors.projectRequirements = 'Please share your project requirements.';
  }

  const budgetErr = validatePositiveNumber(formData.estimatedBudget, 'Budget');
  if (budgetErr) errors.estimatedBudget = budgetErr;

  const refLinkErr = validateUrl(formData.referenceLink);
  if (refLinkErr) errors.referenceLink = refLinkErr;

  if (!formData.termsAccepted) {
    errors.termsAccepted = 'You must agree to the Terms & Conditions and Privacy Policy.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateContactForm(formData) {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Name is required.';
  }

  const emailErr = validateEmail(formData.email);
  if (emailErr) errors.email = emailErr;

  if (!formData.message || !formData.message.trim()) {
    errors.message = 'Message is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
