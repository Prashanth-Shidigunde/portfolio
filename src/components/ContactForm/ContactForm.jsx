import React, { useState } from 'react';
import { useContact } from '../../hooks/useContact';
import './ContactForm.css';

export function ContactForm() {
  const { submitContact, isSubmitting } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    contact_method: 'Email',
    budget: 'Not specified',
    details: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (formData.phone.replace(/[^0-9+]/g, '').length < 7) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service requirement.';
    }

    if (!formData.details.trim()) {
      newErrors.details = 'Please describe your project details.';
    } else if (formData.details.trim().length < 5) {
      newErrors.details = 'Please provide a little more detail about your project.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Call service layer / hook
    await submitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      contact_method: formData.contact_method,
      budget: formData.budget,
      message: formData.details
    });

    const recipient = 'onestarprashanth@gmail.com';
    const subject = 'New Project Enquiry — Pulse_Blend_Media';
    const bodyLines = [
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `Service Required: ${formData.service}`,
      `Project Details: ${formData.details}`,
      `Preferred Contact Method: ${formData.contact_method}`,
      `Budget: ${formData.budget}`,
    ];

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="contact-glass-form-wrapper glass-panel">
      <form id="contact-form" className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="contact-name">
              FULL NAME <span className="req-star">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              required
            />
            {errors.name && <span className="form-error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-phone">
              PHONE NUMBER <span className="req-star">*</span>
            </label>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
              required
            />
            {errors.phone && <span className="form-error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="contact-email">
              EMAIL ADDRESS <span className="req-star">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              required
            />
            {errors.email && <span className="form-error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contact-service">
              WHAT DO YOU NEED? <span className="req-star">*</span>
            </label>
            <div className="select-wrapper">
              <select
                id="contact-service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className={errors.service ? 'input-error' : ''}
                required
              >
                <option value="" disabled>
                  Select a service...
                </option>
                <option value="Video Editing">Video Editing</option>
                <option value="Photo Editing">Photo Editing</option>
                <option value="Indoor & Outdoor Shooting">Indoor &amp; Outdoor Shooting</option>
                <option value="Website Design">Website Design</option>
                <option value="Piano Classes">Piano Classes</option>
                <option value="Computer Teaching">Computer Teaching</option>
                <option value="Custom Requirement">Custom Requirement</option>
                <option value="Something Else">Something Else</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
            {errors.service && <span className="form-error-msg">{errors.service}</span>}
          </div>
        </div>

        <div className="form-row two-cols">
          <div className="form-group">
            <label htmlFor="contact-method">PREFERRED CONTACT METHOD</label>
            <div className="select-wrapper">
              <select
                id="contact-method"
                name="contact_method"
                value={formData.contact_method}
                onChange={handleChange}
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contact-budget">OPTIONAL BUDGET</label>
            <div className="select-wrapper">
              <select
                id="contact-budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="Not specified">Select budget range...</option>
                <option value="Under ₹1,000">Under ₹1,000</option>
                <option value="₹1,000 – ₹5,000">₹1,000 – ₹5,000</option>
                <option value="₹5,000 – ₹10,000">₹5,000 – ₹10,000</option>
                <option value="₹10,000+">₹10,000+</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="contact-details">
            PROJECT DETAILS <span className="req-star">*</span>
          </label>
          <textarea
            id="contact-details"
            name="details"
            rows="4"
            placeholder="Tell me briefly what you need, your idea, deadline, budget or any other useful details..."
            value={formData.details}
            onChange={handleChange}
            className={errors.details ? 'input-error' : ''}
            required
          />
          {errors.details && <span className="form-error-msg">{errors.details}</span>}
        </div>

        <div className="form-submit-row">
          <button type="submit" id="contact-submit-btn" className="btn-primary contact-submit-btn">
            <span>SEND REQUEST &rarr;</span>
          </button>
        </div>

        {submitted && (
          <div id="contact-success-msg" className="contact-success-glass">
            <div className="success-icon">✓</div>
            <h4 className="success-title">Thanks! Your enquiry is ready to send.</h4>
            <p className="success-desc">Your email app should open with the project details pre-filled.</p>
          </div>
        )}
      </form>
    </div>
  );
}
