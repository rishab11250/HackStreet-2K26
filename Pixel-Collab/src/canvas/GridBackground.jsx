import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { COLORS } from '../store/constants';

const GridBackground = () => {
  const canvasRef = useRef(null);
  const viewport = useStore((state) => state.viewport);
  const showGrid = useStore((state) => state.showGrid);
  const gridSnapSize = useStore((state) => state.gridSnapSize);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    
    // Set canvas size with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (!showGrid) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    
    const gridSize = Math.max(8, (gridSnapSize || 20) * viewport.zoom);
    const offsetX = viewport.x % gridSize;
    const offsetY = viewport.y % gridSize;

    ctx.beginPath();
    ctx.fillStyle = COLORS.DOT_GRID || '#DDE1EA';

    for (let x = offsetX; x < width; x += gridSize) {
      for (let y = offsetY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [viewport, showGrid, gridSnapSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default GridBackground;
