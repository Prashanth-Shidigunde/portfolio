import React from 'react';
import { ContactForm } from '../../components/ContactForm/ContactForm';
import './Contact.css';

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container reveal-on-scroll">
        <div className="contact-layout-grid">
          {/* Left Column: Contact Intro & Direct Contact Info */}
          <div className="contact-info-col">
            <div className="section-pill-badge">
              <span className="badge-dot"></span>
              <span>LET'S CREATE SOMETHING</span>
            </div>

            <h2 className="contact-main-heading">
              Have an idea?
              <br />
              Let's bring it to life.
            </h2>

            <p className="contact-subtext">
              Tell me a little about what you need, and I'll get back to you with the next steps.
            </p>

            <div className="contact-cards-group">
              {/* Email Card */}
              <div className="contact-info-card glass-panel">
                <div className="info-card-icon">✉</div>
                <div className="info-card-content">
                  <span className="info-card-label">EMAIL</span>
                  <a href="mailto:onestarprashanth@gmail.com" className="info-card-value">
                    onestarprashanth@gmail.com
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="contact-info-card glass-panel contact-whatsapp-card">
                <div className="info-card-icon whatsapp-icon">💬</div>
                <div className="info-card-content">
                  <span className="info-card-label">WHATSAPP</span>
                  <a
                    href="https://wa.me/916304834605"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-card-value whatsapp-link"
                  >
                    +91 6304834605
                  </a>
                </div>
              </div>

              {/* Response Card */}
              <div className="contact-info-card glass-panel">
                <div className="info-card-icon">⚡</div>
                <div className="info-card-content">
                  <span className="info-card-label">RESPONSE</span>
                  <span className="info-card-value static-value">
                    Usually within a reasonable working window.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Glass Contact Form */}
          <div className="contact-form-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
