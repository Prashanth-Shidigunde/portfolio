import React from 'react';
import './FrameCanvas.css';

export const FrameCanvas = React.forwardRef((props, ref) => {
  return <canvas ref={ref} id="frame-canvas" />;
});
