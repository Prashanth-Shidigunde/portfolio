import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import FeedbackForm from './FeedbackForm';
import './FeedbackModal.css';

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmitFeedback,
  isSubmitting,
  submitError,
  submitSuccess,
  onOpenLegal
}) {
  const modalRef = useRef(null);
  const isDirtyRef = useRef(false);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Robust Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // If user has entered data in form, do not close modal on background click to prevent data loss
      if (isDirtyRef.current) {
        return;
      }
      onClose();
    }
  };

  const handleDirtyChange = (isDirty) => {
    isDirtyRef.current = isDirty;
  };

  return createPortal(
    <div
      className="feedback-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div
        className="feedback-modal-container"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="feedback-modal-header">
          <div className="feedback-modal-header-text">
            <div className="section-pill-badge small-badge">
              <span className="badge-dot"></span>
              <span>CLIENT FEEDBACK</span>
            </div>
            <h2 id="feedback-modal-title" className="feedback-modal-heading">
              SHARE YOUR FEEDBACK
            </h2>
            <p className="feedback-modal-subtext">
              We value your experience. Help us continuously improve our craft.
            </p>
          </div>
          <button
            type="button"
            className="feedback-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <FeedbackForm
          onSubmitFeedback={onSubmitFeedback}
          isSubmitting={isSubmitting}
          submitError={submitError}
          submitSuccess={submitSuccess}
          onOpenLegal={onOpenLegal}
          onCloseModal={onClose}
          onDirtyChange={handleDirtyChange}
        />
      </div>
    </div>,
    document.body
  );
}

export default FeedbackModal;

