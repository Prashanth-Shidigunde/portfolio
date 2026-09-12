import React, { useEffect } from 'react';
import { legalDocuments } from '../../data/legalDocuments';
import './LegalModal.css';

export function LegalModal({ activeDocType, onClose }) {
  const doc = activeDocType ? legalDocuments[activeDocType] : null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeDocType) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDocType, onClose]);

  useEffect(() => {
    if (activeDocType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [activeDocType]);

  if (!doc) return null;

  return (
    <div
      className={`legal-modal-overlay ${activeDocType ? 'active' : ''}`}
      onClick={onClose}
      aria-hidden={!activeDocType}
    >
      <div
        className="legal-modal-glass glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            {doc.title}
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div
          className="modal-body-content"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </div>
    </div>
  );
}
