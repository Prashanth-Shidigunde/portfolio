import React from 'react';
import './Footer.css';

export function Footer({ onOpenLegal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* 1. Brand Area */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-logo">
              <span className="logo-text">Pulse_Blend_Media</span>
            </a>
            <p className="footer-tagline">Creative visuals. Digital experiences. Meaningful ideas.</p>
            <p className="footer-brand-desc">
              Photography, video editing, website design, creative production and learning — brought together under one creative studio.
            </p>
            <button id="back-to-top" className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <span>BACK TO TOP ↑</span>
            </button>
          </div>

          {/* 2. Quick Navigation (EXPLORE) */}
          <div className="footer-col">
            <h4 className="footer-heading">EXPLORE</h4>
            <ul className="footer-links-list">
              <li><a href="#home" className="footer-link">HOME</a></li>
              <li><a href="#services" className="footer-link">SERVICES</a></li>
              <li><a href="#work" className="footer-link">WORK</a></li>
              <li><a href="#about" className="footer-link">ABOUT</a></li>
              <li><a href="#contact" className="footer-link">CONTACT</a></li>
            </ul>
          </div>

          {/* 3. Services (SERVICES) */}
          <div className="footer-col">
            <h4 className="footer-heading">SERVICES</h4>
            <ul className="footer-links-list">
              <li><a href="#services" className="footer-link">Video Editing</a></li>
              <li><a href="#services" className="footer-link">Photo Editing</a></li>
              <li><a href="#services" className="footer-link">Indoor &amp; Outdoor Shooting</a></li>
              <li><a href="#services" className="footer-link">Website Design</a></li>
              <li><a href="#services" className="footer-link">Piano Classes</a></li>
              <li><a href="#services" className="footer-link">Computer Teaching</a></li>
              <li><a href="#services" className="footer-link">Custom Requirement</a></li>
            </ul>
          </div>

          {/* 4. Contact (GET IN TOUCH) */}
          <div className="footer-col">
            <h4 className="footer-heading">GET IN TOUCH</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-item-label">EMAIL</span>
                <a href="mailto:onestarprashanth@gmail.com" className="footer-contact-link">
                  onestarprashanth@gmail.com
                </a>
              </li>
              <li>
                <span className="contact-item-label">WHATSAPP</span>
                <a
                  href="https://wa.me/916304834605"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-link whatsapp-footer-link"
                >
                  +91 6304834605
                </a>
              </li>
            </ul>
          </div>

          {/* 5. Legal Links (LEGAL) */}
          <div className="footer-col">
            <h4 className="footer-heading">LEGAL</h4>
            <ul className="footer-links-list">
              <li>
                <button className="footer-link" onClick={() => onOpenLegal('terms')}>
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onOpenLegal('privacy')}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onOpenLegal('cookie')}>
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Closing Statement & Copyright Row */}
        <div className="footer-bottom-row">
          <p className="footer-closing-statement">LET'S BUILD SOMETHING WORTH REMEMBERING.</p>
          <div className="footer-copyright-meta">
            <span className="copyright-text">
              &copy; <span id="current-year">{currentYear}</span> Pulse_Blend_Media. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
