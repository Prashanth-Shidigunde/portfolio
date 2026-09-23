import React from 'react';
import { useServices } from '../../hooks/useServices';
import { ServiceCard } from '../../components/ServiceCard/ServiceCard';
import './Services.css';

export function Services({ onOpenBooking }) {
  const { services, extraServices } = useServices();

  return (
    <section id="services" className="services-section">
      <div className="services-header reveal-on-scroll">
        <div className="section-pill-badge">
          <span className="badge-dot"></span>
          <span>WHAT WE OFFER</span>
        </div>
        <h2 className="section-heading" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
          CORE SERVICES &amp; SOLUTIONS
        </h2>
        <p className="section-subtext">
          Explore our primary services built for brands, creators, businesses and students looking for quality results.
        </p>
      </div>

      <div className="services-grid">
        {services.map((item, idx) => (
          <ServiceCard key={idx} item={item} onOpenBooking={onOpenBooking} />
        ))}
      </div>

      {/* Additional Creative Services Panel */}
      <div className="additional-services-wrapper reveal-on-scroll">
        <div className="additional-header">
          <div className="section-pill-badge small-badge">
            <span className="badge-dot"></span>
            <span>MORE CREATIVE OPTIONS</span>
          </div>
          <h3 className="additional-heading">NEED SOMETHING EXTRA?</h3>
          <p className="additional-subtext">
            Add focused creative services to extend your project whenever needed.
          </p>
        </div>

        <div className="additional-grid">
          {extraServices.map((chip, idx) => (
            <div
              key={idx}
              className="extra-service-chip"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenBooking && onOpenBooking(chip.name)}
            >
              <span className="chip-name">{chip.name}</span>
              <span className="chip-price">{chip.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

