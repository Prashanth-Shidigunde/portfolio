import React from 'react';
import './ServiceCard.css';

export function ServiceCard({ item, onOpenBooking }) {
  const isWhatsApp = item.isCustom;

  const handleButtonClick = (e) => {
    if (!isWhatsApp) {
      e.preventDefault();
      if (onOpenBooking) {
        onOpenBooking(item.title);
      }
    }
  };

  return (
    <div className={`service-card ${isWhatsApp ? 'custom-card' : ''} reveal-on-scroll`} data-tilt>
      <div className="card-glass-shine"></div>
      <div className="card-top">
        <span className="service-num">{item.num}</span>
        <span className={`service-tag ${isWhatsApp ? 'highlight-tag' : ''}`}>{item.tag}</span>
      </div>
      <h3 className="service-title">{item.title}</h3>
      <p className="service-desc">{item.description}</p>
      <div className="card-bottom">
        <div className="service-price">
          <span className="price-label">{item.priceLabel}</span>
          <span className="price-value">{item.priceValue}</span>
        </div>
        <a
          href={item.btnLink}
          target={isWhatsApp ? '_blank' : '_self'}
          rel={isWhatsApp ? 'noopener noreferrer' : undefined}
          className={`service-btn ${isWhatsApp ? 'whatsapp-btn' : ''}`}
          onClick={handleButtonClick}
        >
          {item.btnText}
        </a>
      </div>
    </div>
  );
}

