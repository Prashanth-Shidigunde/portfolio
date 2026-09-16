import React, { useEffect, useRef } from 'react';
import FeedbackForm from './FeedbackForm';
import './FeedbackModal.css';

export function FeedbackModal({ isOpen, onClose, onSubmitFeedback, isSubmitting, submitError, submitSuccess, onOpenLegal }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="feedback-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="feedback-modal-container glass-panel" ref={modalRef}>
        <div className="feedback-modal-header">
          <div className="feedback-modal-header-text">
            <div className="section-pill-badge small-badge">
              <span className="badge-dot"></span>
              <span>PULSE_BLEND_MEDIA</span>
            </div>
            <h2 id="feedback-modal-title" className="feedback-modal-heading">
              SHARE YOUR FEEDBACK
            </h2>
            <p className="feedback-modal-subtext">
              We value your experience. Help us continuously improve our craft.
            </p>
          </div>
          <button
            className="feedback-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="feedback-modal-body">
          <FeedbackForm
            onSubmitFeedback={onSubmitFeedback}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            onOpenLegal={onOpenLegal}
            onCloseModal={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
