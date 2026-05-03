import { useCallback } from 'react';
import useStore from '../store/useStore';

const useViewport = () => {
  const viewport = useStore((state) => state.viewport);
  const setViewport = useStore((state) => state.setViewport);

  const handleZoom = useCallback((e, containerRef) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95;
    const newZoom = Math.min(Math.max(viewport.zoom * zoomFactor, 0.1), 4);

    const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
    const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

    setViewport({ x: newX, y: newY, zoom: newZoom });
  }, [viewport, setViewport]);

  const handlePan = useCallback((dx, dy) => {
    setViewport({
      ...viewport,
      x: viewport.x + dx,
      y: viewport.y + dy,
    });
  }, [viewport, setViewport]);

  const toCanvas = useCallback((screenX, screenY) => ({
    x: (screenX - viewport.x) / viewport.zoom,
    y: (screenY - viewport.y) / viewport.zoom,
  }), [viewport]);

  const toScreen = useCallback((canvasX, canvasY) => ({
    x: canvasX * viewport.zoom + viewport.x,
    y: canvasY * viewport.zoom + viewport.y,
  }), [viewport]);

  const getRelativeCoords = useCallback((clientX, clientY, containerRef) => {
    if (!containerRef.current) return { x: clientX, y: clientY };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  return {
    viewport,
    handleZoom,
    handlePan,
    toCanvas,
    toScreen,
    getRelativeCoords,
  };
};

export default useViewport;
