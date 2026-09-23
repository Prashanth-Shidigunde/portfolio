import React from 'react';
import './ServiceCard.css';

function parsePriceDisplay(item) {
  if (item.priceAmount) {
    return { amount: item.priceAmount, suffix: item.priceSuffix || '' };
  }

  const str = item.priceValue || '';

  if (str.toLowerCase().includes('starting from')) {
    const match = str.match(/₹[\d,]+/);
    const amount = match ? match[0] : str;
    return { amount, suffix: '/ STARTING FROM' };
  }

  if (str.toLowerCase().includes('per month')) {
    const match = str.match(/₹[\d,]+/);
    const amount = match ? match[0] : str;
    return { amount, suffix: '/ PER MONTH' };
  }

  return { amount: str, suffix: '' };
}

export function ServiceCard({ item, onOpenBooking }) {
  const isWhatsApp = item.isCustom;
  const { amount, suffix } = parsePriceDisplay(item);

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
          <div className="price-value-container">
            <span className="price-amount-bold">{amount}</span>
            {suffix && <span className="price-suffix-red">{suffix}</span>}
          </div>
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

export default ServiceCard;

