import { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore';
import { TOOLS } from '../store/constants';
import { PENCIL_CURSOR, ERASER_CURSOR } from './canvasCursors';
import GridBackground from './GridBackground';
import { renderAll } from './CanvasRenderer';
import useCanvasEvents from './useCanvasEvents';
import TextInput from '../components/elements/TextInput';
import SelectionOverlay from './SelectionOverlay';

const WhiteboardCanvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { elements, viewport, activeTool } = useStore();

  const {
    liveElement,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onDoubleClick,
    onWheel,
    isPanning,
    startResizing,
    selectionState
  } = useCanvasEvents(containerRef);

  const [spacePressed, setSpacePressed] = useState(false);

  // Space key for panning detection (passed to onMouseDown via event state)
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

  // Handle resize and render
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.scale(dpr, dpr);
      
      renderAll(ctx, elements, viewport, liveElement);
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updateCanvasSize();
    return () => resizeObserver.disconnect();
  }, [elements, viewport, liveElement, selectionState]);

  // Regular render call
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderAll(ctx, elements, viewport, liveElement);
  }, [elements, viewport, liveElement]);

  const handleMouseDown = (e) => {
    // Inject spacePressed into event for useCanvasEvents
    e.spaceKey = spacePressed;
    onMouseDown(e);
  };

  const containerCursor =
    isPanning || spacePressed
      ? 'grabbing'
      : activeTool === TOOLS.PAN
        ? 'grab'
        : activeTool === TOOLS.SELECT
          ? 'default'
          : activeTool === TOOLS.TEXT
            ? 'text'
            : activeTool === TOOLS.PENCIL
              ? PENCIL_CURSOR
              : activeTool === TOOLS.ERASER
                ? ERASER_CURSOR
                : 'crosshair';

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-[#F8F9FB] overflow-hidden"
      style={{ cursor: containerCursor }}
      onWheel={onWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}
      onMouseLeave={onMouseUp}
    >
      <GridBackground />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        style={{ width: '100%', height: '100%', cursor: 'inherit' }}
      />
      <TextInput />
      <SelectionOverlay onStartResizing={startResizing} />
      
      {/* Marquee Visual (The "blue box") */}
      {selectionState?.type === 'marquee' && (
        <div 
          className="absolute border border-[#5B6AF0] bg-[#5B6AF0]/10 pointer-events-none z-30"
          style={{
            left: selectionState.x,
            top: selectionState.y,
            width: selectionState.width,
            height: selectionState.height
          }}
        />
      )}
    </div>
  );
};

export default WhiteboardCanvas;
