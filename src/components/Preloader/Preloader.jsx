import React, { useEffect, useState } from 'react';
import './Preloader.css';

export function Preloader({ loadProgress = 0, isLoaded = false }) {
  const [internalLoaded, setInternalLoaded] = useState(false);
  const displayProgress = Math.min(100, Math.max(0, Math.round(loadProgress)));

  useEffect(() => {
    if (isLoaded || loadProgress >= 100) {
      const timer = setTimeout(() => {
        setInternalLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, loadProgress]);

  // Safety fallback: ensure preloader clears after max 3.5 seconds if asset loading stalls
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setInternalLoaded(true);
    }, 3500);
    return () => clearTimeout(safetyTimer);
  }, []);

  const shouldHide = isLoaded || internalLoaded || loadProgress >= 100;

  return (
    <div
      className={`preloader-overlay ${shouldHide ? 'preloader-exit' : ''}`}
      aria-hidden={shouldHide}
    >
      {/* Cinematic Background Light Blooms */}
      <div className="preloader-bg-glow glow-cyan"></div>
      <div className="preloader-bg-glow glow-violet"></div>
      <div className="preloader-bg-glow glow-magenta"></div>

      <div className="preloader-content">
        {/* Animated Glass Ring Container */}
        <div className="preloader-ring-wrapper">
          <div className="preloader-ring-outer"></div>
          <div className="preloader-ring-inner"></div>

          {/* Central Brand */}
          <div className="preloader-brand">
            <span className="preloader-tagline">CREATIVE STUDIO • PRODUCTION • DIGITAL</span>
            <h1 className="preloader-logo-title">
              Pulse<span className="logo-accent">_</span>Blend<span className="logo-accent">_</span>Media
            </h1>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="preloader-progress-section">
          <div className="preloader-status-row">
            <span className="preloader-status-text">LOADING EXPERIENCE</span>
            <span className="preloader-percentage">{displayProgress}%</span>
          </div>

          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${displayProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preloader;
