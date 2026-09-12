import React from 'react';
import './Hero.css';

export function Hero({ onOpenBooking }) {
  const handleBookClick = (e) => {
    e.preventDefault();
    if (onOpenBooking) onOpenBooking('');
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container reveal-on-scroll">
        <div className="section-pill-badge">
          <span className="badge-dot"></span>
          <span>CREATIVE STUDIO</span>
        </div>

        <h1 className="hero-title">
          <span className="title-line">VISUAL</span>
          <span className="title-line gradient-text">EXCELLENCE</span>
        </h1>

        <p className="hero-tagline">
          Pulse_Blend_Media brings video editing, photography, web development and practical computer learning together into one seamless creative output.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleBookClick}>
            BOOK A SLOT ↗
          </button>
          <a href="#work" className="btn-secondary">
            EXPLORE WORK
          </a>
        </div>

        <div className="hero-metrics">
          <div className="metric-item">
            <span className="metric-value">4+</span>
            <span className="metric-label">CORE SERVICES</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-value">100%</span>
            <span className="metric-label">CREATIVE FOCUS</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-value">DIRECT</span>
            <span className="metric-label">WHATSAPP ACCESS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
