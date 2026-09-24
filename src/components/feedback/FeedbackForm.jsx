import React, { useState } from 'react';
import './FeedbackForm.css';

const SERVICE_OPTIONS = [
  'Video Editing',
  'Photo Editing',
  'Indoor & Outdoor Shooting',
  'Website Design',
  'Piano Classes',
  'Computer Teaching',
  'Custom Requirement',
  'Other'
];

const ROLE_OPTIONS = [
  'Business Owner',
  'Content Creator',
  'Student',
  'Entrepreneur',
  'Creative Professional',
  'Other'
];

export function FeedbackForm({
  onSubmitFeedback,
  isSubmitting,
  submitError,
  submitSuccess,
  onOpenLegal,
  onCloseModal,
  onDirtyChange
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    service: '',
    rating: 5, // Default 5 stars
    feedback: '',
    role: '',
    displayConsent: false
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});

  const checkDirty = (data) => {
    return Boolean(
      data.fullName.trim() ||
      data.email.trim() ||
      data.feedback.trim() ||
      data.role ||
      data.service
    );
  };

  const validateEmail = (email) => {
    if (!email) return true; // Optional field
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validateForm = () => {
    const errs = {};

    // Full name
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter a valid name (at least 2 characters)';
    } else if (formData.fullName.trim().length > 100) {
      errs.fullName = 'Name must be 100 characters or less';
    }

    // Email
    if (formData.email.trim() && !validateEmail(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Rating
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errs.rating = 'Please select a star rating (1 to 5 stars)';
    }

    // Feedback
    if (!formData.feedback.trim()) {
      errs.feedback = 'Feedback text is required';
    } else if (formData.feedback.trim().length < 10) {
      errs.feedback = 'Please provide a little more detail (at least 10 characters)';
    } else if (formData.feedback.trim().length > 2000) {
      errs.feedback = 'Feedback must be 2000 characters or less';
    }

    // Display consent
    if (!formData.displayConsent) {
      errs.displayConsent = 'Public display consent is required to submit feedback';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      if (onDirtyChange) {
        onDirtyChange(checkDirty(nextData));
      }
      return nextData;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleStarClick = (ratingVal) => {
    setFormData((prev) => {
      const nextData = { ...prev, rating: ratingVal };
      if (onDirtyChange) {
        onDirtyChange(checkDirty(nextData));
      }
      return nextData;
    });
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    await onSubmitFeedback(formData);
  };

  // SUCCESS STATE VIEW
  if (submitSuccess) {
    return (
      <div className="feedback-success-card">
        <div className="feedback-success-icon-badge">✓</div>
        <h3 className="feedback-success-heading">THANK YOU!</h3>
        <p className="feedback-success-body">
          Your feedback has been received.
        </p>
        <p className="feedback-success-subtext">
          Thank you for helping us improve.
        </p>
        <div className="feedback-success-actions">
          <button
            type="button"
            className="feedback-btn-close"
            onClick={onCloseModal}
          >
            CLOSE
          </button>
        </div>
      </div>
    );
  }

  const activeRating = hoverRating || formData.rating;

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      {/* FULL NAME */}
      <div className="feedback-form-group">
        <label htmlFor="fullName" className="feedback-field-label">
          FULL NAME <span className="req-star">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Your name"
          className={`feedback-input ${errors.fullName ? 'input-error' : ''}`}
        />
        {errors.fullName && <span className="feedback-error-msg">{errors.fullName}</span>}
      </div>

      {/* EMAIL */}
      <div className="feedback-form-group">
        <label htmlFor="email" className="feedback-field-label">
          EMAIL ADDRESS <span className="opt-tag">(Optional)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className={`feedback-input ${errors.email ? 'input-error' : ''}`}
        />
        {errors.email && <span className="feedback-error-msg">{errors.email}</span>}
      </div>

      {/* SERVICE DROPDOWN */}
      <div className="feedback-form-group">
        <label htmlFor="service" className="feedback-field-label">
          SERVICE <span className="opt-tag">(Optional)</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="feedback-select"
        >
          <option value="">Select a service</option>
          {SERVICE_OPTIONS.map((srv) => (
            <option key={srv} value={srv}>
              {srv}
            </option>
          ))}
        </select>
      </div>

      {/* RATING (STARS) */}
      <div className="feedback-form-group">
        <label className="feedback-field-label">
          RATING <span className="req-star">*</span>
        </label>
        <div className="rating-star-selector" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((starVal) => {
            const isFilled = starVal <= activeRating;
            return (
              <button
                key={starVal}
                type="button"
                className={`star-btn ${isFilled ? 'filled' : 'empty'}`}
                onClick={() => handleStarClick(starVal)}
                onMouseEnter={() => setHoverRating(starVal)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                role="radio"
                aria-checked={formData.rating === starVal}
              >
                {isFilled ? '★' : '☆'}
              </button>
            );
          })}
        </div>
        {errors.rating && <span className="feedback-error-msg">{errors.rating}</span>}
      </div>

      {/* ROLE / PROFESSION */}
      <div className="feedback-form-group">
        <label htmlFor="role" className="feedback-field-label">
          ROLE / PROFESSION <span className="opt-tag">(Optional)</span>
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="feedback-select"
        >
          <option value="">Select role / profession</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* FEEDBACK TEXTAREA */}
      <div className="feedback-form-group">
        <label htmlFor="feedback" className="feedback-field-label">
          FEEDBACK <span className="req-star">*</span>
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows="4"
          value={formData.feedback}
          onChange={handleChange}
          placeholder="Tell us about your experience with Pulse_Blend_Media..."
          className={`feedback-textarea ${errors.feedback ? 'input-error' : ''}`}
        ></textarea>
        {errors.feedback && <span className="feedback-error-msg">{errors.feedback}</span>}
      </div>

      {/* PUBLIC DISPLAY CONSENT */}
      <div className="feedback-form-group consent-group">
        <label className="feedback-checkbox-container">
          <input
            type="checkbox"
            name="displayConsent"
            checked={formData.displayConsent}
            onChange={handleChange}
            className="feedback-checkbox"
          />
          <span className="feedback-checkbox-custom"></span>
          <span className="feedback-consent-text">
            I agree that my feedback and display name may be shown publicly on the Pulse_Blend_Media website.{' '}
            <span className="req-star">*</span>
            <span className="legal-links-block">
              (View{' '}
              <a
                href="#terms-and-conditions"
                className="feedback-legal-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenLegal) onOpenLegal('terms');
                }}
              >
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a
                href="#privacy-policy"
                className="feedback-legal-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenLegal) onOpenLegal('privacy');
                }}
              >
                Privacy Policy
              </a>
              )
            </span>
          </span>
        </label>
        {errors.displayConsent && (
          <span className="feedback-error-msg consent-error">{errors.displayConsent}</span>
        )}
      </div>

      {/* SUBMIT ERROR BANNER */}
      {submitError && <div className="feedback-submit-error">{submitError}</div>}

      {/* SUBMIT BUTTON */}
      <div className="feedback-actions">
        <button
          type="submit"
          className="feedback-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FEEDBACK →'}
        </button>
      </div>
    </form>
  );
}

export default FeedbackForm;
