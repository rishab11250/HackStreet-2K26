import { useState, useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import useViewport from '../hooks/useViewport';
import { TOOLS } from '../store/constants';
import { PencilTool } from '../tools/PencilTool';
import { ShapeTool } from '../tools/ShapeTool';
import { TextTool } from '../tools/TextTool';
import { EraserTool } from '../tools/EraserTool';

const useCanvasEvents = (containerRef) => {
  const {
    activeTool,
    activeShape,
    strokeColor,
    fillColor,
    strokeWidth,
    opacity,
    fontSize,
    fontWeight,
    elements,
    addElement,
    deleteElements,
    pushHistory,
    setIsEditingText,
  } = useStore();

  const { toCanvas: baseToCanvas, handlePan, handleZoom, getRelativeCoords } = useViewport();

  const toCanvas = useCallback((clientX, clientY) => {
    const { x, y } = getRelativeCoords(clientX, clientY, containerRef);
    return baseToCanvas(x, y);
  }, [baseToCanvas, getRelativeCoords, containerRef]);
  
  const [liveElement, setLiveElement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [eraserState, setEraserState] = useState(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e) => {
    // Middle mouse button or Space + Left Click = Pan
    if (e.button === 1 || (e.button === 0 && e.spaceKey) || activeTool === TOOLS.PAN) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (e.button !== 0) return;

    const toolArgs = {
      toCanvas,
      pushHistory,
      strokeColor,
      fillColor,
      strokeWidth,
      opacity,
      fontSize,
      fontWeight,
      activeShape,
      addElement,
      setIsEditingText,
    };

    switch (activeTool) {
      case TOOLS.PENCIL: {
        const newEl = PencilTool.onMouseDown(e, toolArgs);
        setLiveElement(newEl);
        setIsDrawing(true);
        break;
      }
      case TOOLS.SHAPE: {
        const newEl = ShapeTool.onMouseDown(e, toolArgs);
        setLiveElement(newEl);
        setIsDrawing(true);
        break;
      }
      case TOOLS.TEXT: {
        TextTool.onClick(e, toolArgs);
        break;
      }
      case TOOLS.ERASER: {
        const state = EraserTool.onMouseDown(e, toolArgs);
        setEraserState(state);
        setIsDrawing(true);
        break;
      }
      default:
        break;
    }
  }, [
    activeTool, activeShape, strokeColor, fillColor, strokeWidth, 
    opacity, fontSize, fontWeight, toCanvas, pushHistory, addElement, setIsEditingText
  ]);

  const onMouseMove = useCallback((e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      handlePan(dx, dy);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isDrawing) return;

    const toolArgs = {
      toCanvas,
      currentElement: liveElement,
      shiftKey: e.shiftKey,
      elements,
      deleteElements,
      state: eraserState,
    };

    switch (activeTool) {
      case TOOLS.PENCIL: {
        const updated = PencilTool.onMouseMove(e, toolArgs);
        setLiveElement(updated);
        break;
      }
      case TOOLS.SHAPE: {
        const updated = ShapeTool.onMouseMove(e, toolArgs);
        setLiveElement(updated);
        break;
      }
      case TOOLS.ERASER: {
        const newState = EraserTool.onMouseMove(e, toolArgs);
        setEraserState(newState);
        break;
      }
      default:
        break;
    }
  }, [isPanning, isDrawing, activeTool, liveElement, elements, deleteElements, eraserState, handlePan, toCanvas]);

  const onMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!isDrawing) return;

    switch (activeTool) {
      case TOOLS.PENCIL: {
        const finalEl = PencilTool.onMouseUp(liveElement);
        if (finalEl) addElement(finalEl);
        break;
      }
      case TOOLS.SHAPE: {
        const finalEl = ShapeTool.onMouseUp(liveElement);
        if (finalEl) addElement(finalEl);
        break;
      }
      case TOOLS.ERASER: {
        EraserTool.onMouseUp(eraserState, { pushHistory });
        setEraserState(null);
        break;
      }
      default:
        break;
    }

    setLiveElement(null);
    setIsDrawing(false);
  }, [isPanning, isDrawing, activeTool, liveElement, eraserState, addElement, pushHistory]);

  const onWheel = useCallback((e) => {
    handleZoom(e, containerRef);
  }, [handleZoom, containerRef]);

  return {
    liveElement,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    isPanning
  };
};

export default useCanvasEvents;
