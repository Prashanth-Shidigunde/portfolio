import React, { useState, useEffect, useRef, useCallback } from 'react';
import useFeedback from '../../hooks/useFeedback';
import { testimonialsData } from '../../data/testimonialsData';
import './FeedbackCarousel.css';

export function FeedbackCarousel({ onOpenFeedbackModal }) {
  const { feedbackList, loading } = useFeedback();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Responsive items per slide (3 for desktop, 2 for tablet, 1 for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth <= 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Format approved feedback entries retrieved from Supabase DB
  const supabaseApprovedItems = (feedbackList || []).map((item) => ({
    id: `sb-${item.id}`,
    rating: item.rating || 5,
    quote: item.feedback,
    name: item.full_name,
    role: [item.role, item.service].filter(Boolean).join(' • ') || 'Client Partner'
  }));

  // 2. Format past feedback data (all 6 original testimonials)
  const pastFeedbackItems = (testimonialsData || []).map((t) => ({
    id: `past-${t.id}`,
    rating: t.rating || 5,
    quote: t.quote,
    name: t.name,
    role: t.role
  }));

  // 3. Combine: new approved Supabase feedback first, followed by all past feedback data
  const combinedList = [...supabaseApprovedItems, ...pastFeedbackItems];

  // 4. Assign zero-padded card numbers (01, 02, 03...)
  const displayItems = combinedList.map((item, index) => ({
    ...item,
    num: String(index + 1).padStart(2, '0')
  }));

  // Chunk display items into slide pages
  const slidesData = [];
  for (let i = 0; i < displayItems.length; i += itemsPerSlide) {
    slidesData.push(displayItems.slice(i, i + itemsPerSlide));
  }

  const slidesCount = slidesData.length;

  const nextSlide = useCallback(() => {
    if (slidesCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slidesCount);
  }, [slidesCount]);

  const prevSlide = useCallback(() => {
    if (slidesCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slidesCount) % slidesCount);
  }, [slidesCount]);

  const prefersReducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  // Auto Rotation Timer (4 seconds)
  useEffect(() => {
    if (slidesCount <= 1 || isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [slidesCount, isPaused, prefersReducedMotion, nextSlide]);

  // Adjust container height based on active slide page height
  useEffect(() => {
    const activeSlide = slideRefs.current[currentIndex];
    if (activeSlide && trackRef.current) {
      const h = activeSlide.offsetHeight;
      if (h > 0) {
        trackRef.current.style.height = `${h}px`;
      }
    }
  }, [currentIndex, slidesData]);

  // Touch Swipe Handlers for Mobile
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

  // Compute average score display from all items
  const averageRating = displayItems.length > 0
    ? (displayItems.reduce((acc, curr) => acc + curr.rating, 0) / displayItems.length).toFixed(1)
    : '5.0';

  return (
    <div
      className="testimonials-glass-panel"
      id="testimonial-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* HEADER WITH BADGE & SATISFACTION RATING */}
      <div className="testimonials-header">
        <div className="testimonials-header-left">
          <div className="section-pill-badge small-badge">
            <span className="badge-dot"></span>
            <span>CLIENT FEEDBACK</span>
          </div>
          <h3 className="testimonials-title">WORDS FROM THE PEOPLE WE WORK WITH</h3>
        </div>
        <div className="rating-badge-container">
          <div className="rating-stars">
            ★★★★★ <span className="rating-score">{averageRating}</span>
          </div>
          <span className="rating-label">SATISFACTION RATING</span>
        </div>
      </div>

      {/* CAROUSEL TRACK VIEWPORT */}
      <div className="testimonial-carousel-container" ref={trackRef}>
        {loading && displayItems.length === 0 ? (
          <div className="feedback-loading-spinner">
            <div className="feedback-spinner"></div>
            <span>Loading client feedback...</span>
          </div>
        ) : (
          <div
            className="testimonial-cards-wrapper"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: prefersReducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {slidesData.map((slideItems, slideIdx) => (
              <div
                key={slideIdx}
                ref={(el) => (slideRefs.current[slideIdx] = el)}
                className={`testimonial-slide-page ${slideIdx === currentIndex ? 'active-slide' : ''}`}
              >
                <div className="testimonial-cards-grid">
                  {slideItems.map((item) => (
                    <div key={item.id} className="testimonial-card">
                      <div className="testimonial-card-top">
                        <span className="testimonial-num">{item.num}</span>
                        <div className="testimonial-stars">{'★'.repeat(item.rating)}</div>
                      </div>

                      <blockquote className="testimonial-quote">"{item.quote}"</blockquote>

                      <div className="testimonial-author">
                        <div className="author-avatar">
                          <span>
                            {item.name
                              ? item.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .substring(0, 2)
                                  .toUpperCase()
                              : 'PB'}
                          </span>
                        </div>
                        <div className="author-meta">
                          <h4 className="author-name">{item.name}</h4>
                          <span className="author-role">{item.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONTROLS (Displayed when 2+ slide pages exist) */}
      {slidesCount > 1 && (
        <div className="carousel-controls">
          <button
            className="carousel-btn"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            ←
          </button>
          <div className="carousel-dots">
            {slidesData.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="carousel-btn"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            →
          </button>
        </div>
      )}

      {/* SHARE YOUR FEEDBACK CTA BUTTON */}
      <div className="feedback-carousel-cta-bar">
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
