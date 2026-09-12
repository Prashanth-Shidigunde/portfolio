import React, { useEffect, useState } from 'react';
import './Preloader.css';

export function Preloader({ loadProgress = 0, isLoaded = false }) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);

  // Enforce minimum 1.50-second preloader duration
  useEffect(() => {
    const minTimer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);

    return () => clearTimeout(minTimer);
  }, []);

  // Smoothly animate progress from 0% to 100% over the 1.50-second duration
  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500; // 1.50 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeRatioPct = Math.min(100, Math.floor((elapsed / duration) * 100));

      // Combine time-based smooth progress with real asset loading progress
      const combinedProgress = Math.max(timeRatioPct, Math.round(loadProgress));
      setVisualProgress(Math.min(100, combinedProgress));

      if (elapsed >= duration && (isLoaded || loadProgress >= 100 || combinedProgress >= 100)) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [loadProgress, isLoaded]);

  const displayProgress = visualProgress;
  const shouldHide = minTimeElapsed && (isLoaded || loadProgress >= 100 || visualProgress >= 100);

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
