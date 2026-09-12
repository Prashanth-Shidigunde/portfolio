import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 140;
const FRAME_PATH = (index) =>
  `./ezgif-21793f97c03bafcb-jpg/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

export function useScrollFrameAnimation(canvasRef) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const imagesRef = useRef([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let loadedCount = 0;
    const images = [];

    function renderFrame(index) {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return false;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      return true;
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);

      if (lastRenderedFrameRef.current >= 0) {
        renderFrame(lastRenderedFrameRef.current);
      }
    }

    function updateScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const maxScroll = Math.max(1, docHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    }

    function animate() {
      const diff = targetFrameRef.current - currentFrameRef.current;
      const lerpFactor = 0.15;

      if (Math.abs(diff) > 0.0001) {
        currentFrameRef.current += diff * lerpFactor;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToRender = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      if (frameToRender !== lastRenderedFrameRef.current) {
        if (renderFrame(frameToRender)) {
          lastRenderedFrameRef.current = frameToRender;
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    updateScrollProgress();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // Preload images
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      images.push(img);

      img.onload = () => {
        loadedCount++;
        const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
        setLoadProgress(pct);

        const targetIdx = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentFrameRef.current))
        );

        if (i - 1 === targetIdx || lastRenderedFrameRef.current === -1) {
          if (renderFrame(targetIdx)) {
            lastRenderedFrameRef.current = targetIdx;
          }
        }

        if (loadedCount === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
    }

    imagesRef.current = images;
    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateScrollProgress);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [canvasRef]);

  return { loadProgress, isLoaded };
}
