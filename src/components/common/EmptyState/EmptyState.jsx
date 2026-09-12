import React from 'react';
import './EmptyState.css';

export function EmptyState({ title = 'No Items Found', message = 'Check back later for updates.' }) {
  return (
    <div className="common-empty-container">
      <div className="empty-icon">📂</div>
      <h4 className="empty-title">{title}</h4>
      <p className="empty-message">{message}</p>
    </div>
  );
}

export default EmptyState;
