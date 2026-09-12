import React, { useState, useEffect, useRef } from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';
import './TestimonialsCarousel.css';

export function TestimonialsCarousel() {
  const { testimonials } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);

  const itemsPerSlide = 3;
  const slidesData = [];
  const list = testimonials.length > 0 ? testimonials : [];
  for (let i = 0; i < list.length; i += itemsPerSlide) {
    slidesData.push(list.slice(i, i + itemsPerSlide));
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [slidesData.length]);

  useEffect(() => {
    const activeSlide = slideRefs.current[currentIndex];
    if (activeSlide && trackRef.current) {
      const h = activeSlide.offsetHeight;
      if (h > 0) {
        trackRef.current.style.height = `${h}px`;
      }
    }
  }, [currentIndex]);

  return (
    <div className="testimonials-glass-panel" id="testimonial-carousel">
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
            ★★★★★ <span className="rating-score">5.0</span>
          </div>
          <span className="rating-label">SATISFACTION RATING</span>
        </div>
      </div>

      <div className="testimonial-carousel-container" ref={trackRef}>
        <div
          className="testimonial-cards-wrapper"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
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
      </div>

      <div className="carousel-controls">
        <button className="carousel-btn" onClick={prevSlide} aria-label="Previous Slide">
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
        <button className="carousel-btn" onClick={nextSlide} aria-label="Next Slide">
          →
        </button>
      </div>
    </div>
  );
}
