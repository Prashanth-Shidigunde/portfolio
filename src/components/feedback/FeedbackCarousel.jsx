import React, { useState, useEffect, useRef, useCallback } from 'react';
import useFeedback from '../../hooks/useFeedback';
import './FeedbackCarousel.css';

export function FeedbackCarousel({ onOpenFeedbackModal }) {
  const { feedbackList, loading, error } = useFeedback();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch Swipe Handling State
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const count = feedbackList.length;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  // Auto Rotation Timer (4 seconds)
  useEffect(() => {
    if (count <= 1 || isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [count, isPaused, prefersReducedMotion, nextSlide]);

  // Reset index if count changes and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= count && count > 0) {
      setCurrentIndex(0);
    }
  }, [count, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (touchEndXRef.current !== 0) {
      if (diff > minSwipeDistance) {
        nextSlide();
      } else if (diff < -minSwipeDistance) {
        prevSlide();
      }
    }

    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
    setIsPaused(false);
  };

  return (
    <div
      className="feedback-carousel-panel glass-panel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* HEADER */}
      <div className="feedback-carousel-header">
        <div className="section-pill-badge small-badge">
          <span className="badge-dot"></span>
          <span>CLIENT FEEDBACK</span>
        </div>
        <h3 className="feedback-carousel-title">WHAT PEOPLE SAY</h3>
        <p className="feedback-carousel-subtext">
          Real experiences from people who have worked with Pulse_Blend_Media.
        </p>
      </div>

      {/* CAROUSEL CONTENT AREA */}
      <div className="feedback-carousel-viewport">
        {loading ? (
          <div className="feedback-state-box">
            <div className="feedback-spinner"></div>
            <p className="feedback-state-text">Loading feedback...</p>
          </div>
        ) : error ? (
          <div className="feedback-state-box feedback-error-box">
            <p className="feedback-state-text">{error}</p>
          </div>
        ) : count === 0 ? (
          <div className="feedback-state-box feedback-empty-box">
            <p className="empty-heading">Be the first to share your experience.</p>
            <p className="empty-subtext">
              We welcome honest feedback from our creative partners and clients.
            </p>
          </div>
        ) : (
          <div
            className="feedback-carousel-track-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="feedback-slider-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: prefersReducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {feedbackList.map((item, index) => (
                <div key={item.id || index} className="feedback-card-slide">
                  <div className="feedback-card-single">
                    {/* Rating Stars & Service Tag */}
                    <div className="feedback-card-top flex-between">
                      <div className="feedback-stars-display" aria-label={`Rating: ${item.rating} out of 5 stars`}>
                        {'★'.repeat(item.rating)}
                      </div>
                      {item.service && (
                        <span className="feedback-service-tag">{item.service}</span>
                      )}
                    </div>

                    {/* Quote Text */}
                    <blockquote className="feedback-quote-text">
                      "{item.feedback}"
                    </blockquote>

                    {/* Author Meta */}
                    <div className="feedback-author-meta">
                      <div className="feedback-author-avatar">
                        <span>
                          {item.full_name
                            ? item.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()
                            : 'PB'}
                        </span>
                      </div>
                      <div className="feedback-author-info">
                        <h4 className="feedback-author-name">{item.full_name}</h4>
                        {item.role && (
                          <span className="feedback-author-role">{item.role}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS (Displayed only when 2+ entries exist) */}
      {!loading && !error && count > 1 && (
        <div className="feedback-carousel-controls">
          <button
            className="feedback-carousel-btn"
            onClick={prevSlide}
            aria-label="Previous Feedback"
          >
            ←
          </button>

          <div className="feedback-carousel-dots">
            {feedbackList.map((_, i) => (
              <button
                key={i}
                className={`feedback-carousel-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to feedback ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="feedback-carousel-btn"
            onClick={nextSlide}
            aria-label="Next Feedback"
          >
            Next →
          </button>
        </div>
      )}

      {/* SHARE YOUR FEEDBACK BUTTON */}
      <div className="feedback-carousel-cta">
        <button
          type="button"
          className="btn-share-feedback"
          onClick={onOpenFeedbackModal}
        >
          SHARE YOUR FEEDBACK →
        </button>
      </div>
    </div>
  );
}

export default FeedbackCarousel;
