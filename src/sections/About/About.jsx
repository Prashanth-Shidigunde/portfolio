import React, { useState } from 'react';
import FeedbackCarousel from '../../components/feedback/FeedbackCarousel';
import FeedbackModal from '../../components/feedback/FeedbackModal';
import useFeedback from '../../hooks/useFeedback';
import './About.css';

export function About({ onOpenLegal }) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const { isSubmitting, submitSuccess, submitError, submitFeedback, resetFormState } = useFeedback();

  const handleOpenModal = () => {
    resetFormState();
    setIsFeedbackModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleSubmitFeedback = async (formData) => {
    await submitFeedback(formData);
  };

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-grid">
          {/* Left Column: Intro & Founder */}
          <div className="about-content-col reveal-on-scroll">
            <div className="section-pill-badge">
              <span className="badge-dot"></span>
              <span>ABOUT US</span>
            </div>
            <h2 className="about-headline">WE BLEND CREATIVITY &amp; VISION INTO IMPACT.</h2>
            <p className="about-paragraph highlight-paragraph">
              Pulse_Blend_Media is a creative house driven by passion for visual storytelling, digital design and practical learning.
            </p>
            <p className="about-paragraph">
              We bring video editing, photography, web development and skill building together under one roof, helping brands and individuals make their mark.
            </p>

            <div className="founder-card glass-panel">
              <div className="founder-header">
                <div className="founder-avatar">
                  <span className="avatar-icon">⚡</span>
                </div>
                <div className="founder-info">
                  <span className="founder-role">FOUNDER &amp; CREATIVE DIRECTOR</span>
                  <h4 className="founder-name">Pulse_Blend_Media</h4>
                </div>
              </div>
              <p className="founder-text">
                "Our mission is simple: take your vision and turn it into extraordinary visual experiences."
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Glass Feedback Panel */}
          <div className="testimonials-col reveal-on-scroll">
            <FeedbackCarousel onOpenFeedbackModal={handleOpenModal} />
          </div>
        </div>
      </div>

      {/* Glass Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseModal}
        onSubmitFeedback={handleSubmitFeedback}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
        onOpenLegal={onOpenLegal}
      />
    </section>
  );
}

export default About;

