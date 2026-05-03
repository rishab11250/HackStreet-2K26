import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';
import useViewport from '../hooks/useViewport';
import GridBackground from './GridBackground';
import { renderAll } from './CanvasRenderer';
import { TOOLS } from '../store/constants';

const WhiteboardCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { elements, activeTool } = useStore();
  const { viewport, handleZoom, handlePan } = useViewport();
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Space key for panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.scale(dpr, dpr);
      
      renderAll(ctx, elements, viewport);
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateCanvasSize();
    return () => resizeObserver.disconnect();
  }, [elements, viewport]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderAll(ctx, elements, viewport);
  }, [elements, viewport]);

  // Mouse events for pan/zoom
  const onWheel = (e) => {
    handleZoom(e, containerRef);
  };

  const onMouseDown = (e) => {
    if (activeTool === TOOLS.PAN || e.button === 1 || (e.button === 0 && spacePressed)) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      handlePan(dx, dy);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const onMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-[#F8F9FB] overflow-hidden"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <GridBackground />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default WhiteboardCanvas;
