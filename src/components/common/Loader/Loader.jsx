import React from 'react';
import './Loader.css';

export function Loader({ text = 'Loading...' }) {
  return (
    <div className="common-loader-container">
      <div className="common-spinner"></div>
      {text && <p className="common-loader-text">{text}</p>}
    </div>
  );
}

export default Loader;
