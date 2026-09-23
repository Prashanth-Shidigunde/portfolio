import React, { useState, useEffect, useRef } from 'react';
import { indianStates, countriesList, countryCodes } from '../../data/locationData';
import { useBooking } from '../../hooks/useBooking';
import fileService from '../../services/fileService';
import { validateBookingForm } from '../../utils/validation';
import logoImg from '../../assets/images/pulse-blend-media-logo.png';
import './BookingModal.css';

const MAX_FILE_SIZE_MB = 25;

export function BookingModal({ isOpen, initialService, onClose, onOpenLegal }) {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const initialFormState = {
    fullName: '',
    email: '',
    country: 'India',
    state: 'Andhra Pradesh',
    countryCode: '+91',
    mobile: '',
    selectedService: initialService || 'Select a service',
    customServiceName: '',
    projectRequirements: '',
    preferredDate: '',
    preferredTimeSlot: 'Flexible Slot (Recommended)',
    customTimeSlot: '',
    estimatedBudget: '',
    referenceLink: '',
    termsAccepted: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    isSubmitting,
    submitError,
    setSubmitError,
    isSubmitted,
    submittedData,
    submitBooking,
    resetBookingState
  } = useBooking();

  // Sync initial service when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        selectedService: initialService || 'Select a service',
        customServiceName: '',
        preferredTimeSlot: 'Flexible Slot (Recommended)',
        customTimeSlot: ''
      }));
      setErrors({});
      setFileError('');
      resetBookingState();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialService]);

  // ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto sync country code when country changes
      if (name === 'country') {
        const found = countryCodes.find((c) => c.country === value);
        if (found) {
          updated.countryCode = found.code;
        }
      }

      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle File Selection
  const handleFiles = (filesList) => {
    setFileError('');
    const { validFiles, error } = fileService.validateFiles(filesList, MAX_FILE_SIZE_MB);
    if (error) {
      setFileError(error);
      return;
    }
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Form Validation
  const validateForm = () => {
    const { isValid, errors: valErrors } = validateBookingForm(formData);
    setErrors(valErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    const res = await submitBooking(formData, selectedFiles);

    if (res && res.success && res.whatsappUrl) {
      try {
        window.location.href = res.whatsappUrl;
      } catch (err) {
        console.warn('WhatsApp redirect notice:', err);
      }
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setSelectedFiles([]);
    setErrors({});
    setFileError('');
    resetBookingState();
  };

  const primaryServicesList = [
    'Video Editing',
    'Photo Editing',
    'Indoor & Outdoor Shooting',
    'Website Design',
    'Computer Classes',
    'Piano Classes',
    'Color Grading',
    'Reel Editing',
    'YouTube Editing',
    'Thumbnail Design',
    'Social Media Creatives',
    'Product Editing',
    'Business Web Dev',
    'Landing Page Design',
    '3D Website Development',
    'Custom Requirement'
  ];

  const timeSlotOptions = [
    'Flexible Slot (Recommended)',
    'Morning (10:00 AM - 1:00 PM)',
    'Afternoon (2:00 PM - 5:00 PM)',
    'Evening (6:00 PM - 9:00 PM)',
    'Custom Slot'
  ];

  const getFirstName = (nameStr) => {
    if (!nameStr) return 'Client';
    return nameStr.trim().split(' ')[0] || 'Client';
  };

  return (
    <div className="booking-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal-container glass-panel" ref={modalRef} role="dialog" aria-modal="true">
        {/* Modal Header */}
        <div className="booking-modal-header">
          <div className="modal-header-content">
            <img src={logoImg} alt="Pulse_Blend_Media" className="booking-modal-logo-img" />
            <h2 className="modal-heading">SERVICE BOOKING &amp; RESERVATION</h2>
            <p className="modal-subtext">
              Tell us what you need and share the details required to plan your project.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="booking-modal-body">
          {isSubmitted ? (
            <div className="booking-success-container">
              <div className="success-icon-badge">✓</div>

              <h3 className="success-heading">
                Your booking was saved successfully.
              </h3>

              {/* BOOKING DATA SUMMARY CARD */}
              <div className="summary-card glass-panel">
                <div className="summary-row">
                  <span className="summary-label">Booking ID:</span>
                  <span className="summary-val highlight-id">{submittedData.bookingId}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Request Status:</span>
                  <span className="summary-val status-requested">REQUESTED</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Client Name:</span>
                  <span className="summary-val">{submittedData.customer.fullName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Contact:</span>
                  <span className="summary-val">{submittedData.customer.email}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Mobile:</span>
                  <span className="summary-val">{submittedData.customer.mobile}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Selected Service:</span>
                  <span className="summary-val highlight-val">
                    {submittedData.service.selectedService}
                    {submittedData.service.customServiceName && ` (${submittedData.service.customServiceName})`}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Estimated Budget:</span>
                  <span className="summary-val budget-val">₹{submittedData.service.estimatedBudget}</span>
                </div>
                {submittedData.service.preferredDate && (
                  <div className="summary-row">
                    <span className="summary-label">Preferred Date:</span>
                    <span className="summary-val">{submittedData.service.preferredDate}</span>
                  </div>
                )}
              </div>

              <p className="success-next-steps">
                Click below to send your pre-filled booking details directly to our WhatsApp.
              </p>

              <div className="thankyou-actions-grid">
                <button
                  type="button"
                  className="btn-thankyou btn-owner-wa"
                  onClick={() => {
                    if (submittedData.whatsappUrl) {
                      window.open(submittedData.whatsappUrl, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  OPEN WHATSAPP
                </button>

                <button
                  type="button"
                  className="btn-thankyou btn-view-invoice"
                  onClick={() => window.open(`/booking-invoice.html?id=${submittedData.bookingId}`, '_blank', 'noopener,noreferrer')}
                >
                  VIEW BOOKING INVOICE ↗
                </button>

                <button
                  type="button"
                  className="btn-thankyou btn-close-modal"
                  onClick={onClose}
                >
                  CLOSE
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="booking-form">

              {/* CUSTOMER DETAILS SECTION */}
              <div className="form-section-card glass-panel">
                <div className="form-section-header">
                  <span className="section-num">01</span>
                  <h3 className="form-section-title">CUSTOMER DETAILS</h3>
                </div>

                <div className="form-grid">
                  {/* Full Name */}
                  <div className="form-group full-width-sm">
                    <label htmlFor="fullName" className="field-label">
                      FULL NAME <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`form-input ${errors.fullName ? 'input-error' : ''}`}
                    />
                    {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-group full-width-sm">
                    <label htmlFor="email" className="field-label">
                      EMAIL ADDRESS <span className="req-star">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>

                  {/* Country */}
                  <div className="form-group">
                    <label htmlFor="country" className="field-label">
                      COUNTRY
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {countriesList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="form-group">
                    <label htmlFor="state" className="field-label">
                      STATE / REGION
                    </label>
                    {formData.country === 'India' ? (
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-select"
                      >
                        {indianStates.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state or region"
                        className="form-input"
                      />
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="form-group full-width-sm">
                    <label htmlFor="mobile" className="field-label">
                      MOBILE NUMBER <span className="req-star">*</span>
                    </label>
                    <div className="mobile-input-wrapper">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="country-code-select"
                        aria-label="Country Code"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.country} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        className={`form-input mobile-input ${errors.mobile ? 'input-error' : ''}`}
                      />
                    </div>
                    {errors.mobile && <span className="error-msg">{errors.mobile}</span>}
                  </div>
                </div>
              </div>

              {/* SERVICE DETAILS SECTION */}
              <div className="form-section-card glass-panel">
                <div className="form-section-header">
                  <span className="section-num">02</span>
                  <h3 className="form-section-title">SERVICE DETAILS</h3>
                </div>

                <div className="form-grid">
                  {/* Select Service */}
                  <div className="form-group full-width">
                    <label htmlFor="selectedService" className="field-label">
                      SELECT SERVICE <span className="req-star">*</span>
                    </label>
                    <select
                      id="selectedService"
                      name="selectedService"
                      value={formData.selectedService}
                      onChange={handleChange}
                      className={`form-select ${errors.selectedService ? 'input-error' : ''}`}
                    >
                      <option value="Select a service" disabled>
                        Select a service
                      </option>
                      {primaryServicesList.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                    {errors.selectedService && <span className="error-msg">{errors.selectedService}</span>}
                  </div>

                  {/* Additional field for Custom Requirement */}
                  {formData.selectedService === 'Custom Requirement' && (
                    <div className="form-group full-width">
                      <label htmlFor="customServiceName" className="field-label">
                        CUSTOM SERVICE NAME <span className="req-star">*</span>
                      </label>
                      <input
                        type="text"
                        id="customServiceName"
                        name="customServiceName"
                        value={formData.customServiceName}
                        onChange={handleChange}
                        placeholder="Tell us service name"
                        className={`form-input ${errors.customServiceName ? 'input-error' : ''}`}
                      />
                      {errors.customServiceName && (
                        <span className="error-msg">{errors.customServiceName}</span>
                      )}
                    </div>
                  )}

                  {/* Project Requirements */}
                  <div className="form-group full-width">
                    <label htmlFor="projectRequirements" className="field-label">
                      PROJECT REQUIREMENTS / NOTES <span className="req-star">*</span>
                    </label>
                    <textarea
                      id="projectRequirements"
                      name="projectRequirements"
                      rows="4"
                      value={formData.projectRequirements}
                      onChange={handleChange}
                      placeholder="Tell us about your project, what you need, expected outcome, deadline, style, quantity, or any other useful details..."
                      className={`form-textarea ${errors.projectRequirements ? 'input-error' : ''}`}
                    ></textarea>
                    {errors.projectRequirements && (
                      <span className="error-msg">{errors.projectRequirements}</span>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div className="form-group">
                    <label htmlFor="preferredDate" className="field-label">
                      PREFERRED DATE
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="form-input date-input"
                    />
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="form-group">
                    <label htmlFor="preferredTimeSlot" className="field-label">
                      PREFERRED TIME / SLOT
                    </label>
                    <select
                      id="preferredTimeSlot"
                      name="preferredTimeSlot"
                      value={formData.preferredTimeSlot}
                      onChange={handleChange}
                      className="form-select"
                    >
                      {timeSlotOptions.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Time Slot Text Field when "Custom Slot" is selected */}
                  {formData.preferredTimeSlot === 'Custom Slot' && (
                    <div className="form-group full-width-sm">
                      <label htmlFor="customTimeSlot" className="field-label">
                        CUSTOM TIME SLOT
                      </label>
                      <input
                        type="text"
                        id="customTimeSlot"
                        name="customTimeSlot"
                        value={formData.customTimeSlot}
                        onChange={handleChange}
                        placeholder="e.g. 11:30 AM - 1:30 PM, Late Night"
                        className={`form-input ${errors.customTimeSlot ? 'input-error' : ''}`}
                      />
                      {errors.customTimeSlot && <span className="error-msg">{errors.customTimeSlot}</span>}
                    </div>
                  )}

                  {/* Estimated Budget */}
                  <div className="form-group">
                    <label htmlFor="estimatedBudget" className="field-label">
                      ESTIMATED BUDGET <span className="req-star">*</span>
                    </label>
                    <input
                      type="number"
                      id="estimatedBudget"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      placeholder="Enter your estimated budget"
                      className={`form-input ${errors.estimatedBudget ? 'input-error' : ''}`}
                      min="1"
                    />
                    {errors.estimatedBudget && <span className="error-msg">{errors.estimatedBudget}</span>}
                  </div>

                  {/* Reference Link */}
                  <div className="form-group">
                    <label htmlFor="referenceLink" className="field-label">
                      REFERENCE LINK
                    </label>
                    <input
                      type="url"
                      id="referenceLink"
                      name="referenceLink"
                      value={formData.referenceLink}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className={`form-input ${errors.referenceLink ? 'input-error' : ''}`}
                    />
                    {errors.referenceLink && <span className="error-msg">{errors.referenceLink}</span>}
                  </div>
                </div>
              </div>

              {/* REFERENCE FILES SECTION */}
              <div className="form-section-card glass-panel">
                <div className="form-section-header">
                  <span className="section-num">03</span>
                  <h3 className="form-section-title">REFERENCE FILES</h3>
                </div>

                <div
                  className={`drag-drop-zone ${isDragOver ? 'drag-over' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    multiple
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.mp4,.mov"
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon">📁</div>
                  <p className="upload-title">Drag &amp; Drop reference files here or click to browse</p>
                  <p className="upload-hint">
                    Supported: Images (JPG, PNG, WEBP), Documents (PDF), Videos (MP4, MOV). Max {MAX_FILE_SIZE_MB}MB per file.
                  </p>
                </div>

                {fileError && <div className="file-error-banner">{fileError}</div>}

                {selectedFiles.length > 0 && (
                  <div className="file-list">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="file-chip glass-panel">
                        <span className="file-icon">📄</span>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{formatFileSize(file.size)}</span>
                        </div>
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(idx);
                          }}
                          aria-label={`Remove file ${file.name}`}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PAYMENT NOTE NOTICE */}
              <div className="form-section-card glass-panel payment-note-card">
                <div className="payment-note-header">
                  <span className="payment-note-badge">PAYMENT NOTE</span>
                </div>
                <p className="payment-note-text">
                  50% advance payment is required to confirm and schedule the booking. The remaining 50% is payable after project completion.
                </p>
              </div>

              {/* TERMS & PRIVACY CONSENT SECTION */}
              <div className="form-section-card glass-panel consent-card">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="consent-checkbox"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="consent-text">
                    I agree to the{' '}
                    <a
                      href="#terms-and-conditions"
                      className="consent-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenLegal('terms');
                      }}
                    >
                      Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a
                      href="#privacy-policy"
                      className="consent-link"
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenLegal('privacy');
                      }}
                    >
                      Privacy Policy
                    </a>
                    . <span className="req-star">*</span>
                  </span>
                </label>
                {errors.termsAccepted && <div className="error-msg consent-error">{errors.termsAccepted}</div>}
              </div>

              {/* Submit Error Banner if saving fails */}
              {submitError && <div className="submit-error-banner">{submitError}</div>}

              {/* BOOK NOW CTA BUTTON */}
              <div className="form-actions-bar">
                <button type="submit" className="btn-booking-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'SUBMITTING...' : 'BOOK NOW ↗'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


