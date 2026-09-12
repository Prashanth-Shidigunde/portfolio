import React from 'react';
import './Preloader.css';

export function Preloader({ loadProgress, isLoaded }) {
  return (
    <div class={`loader ${isLoaded ? 'loaded' : ''}`}>
      <div class="loader-bar-container">
        <div class="loader-bar" style={{ width: `${loadProgress}%` }}></div>
      </div>
    </div>
  );
}
