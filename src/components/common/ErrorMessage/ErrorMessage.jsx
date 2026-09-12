import React from 'react';
import './ErrorMessage.css';

export function ErrorMessage({ message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="common-error-banner">
      <span className="error-banner-icon">⚠️</span>
      <p className="error-banner-text">{message}</p>
      {onRetry && (
        <button className="error-banner-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
