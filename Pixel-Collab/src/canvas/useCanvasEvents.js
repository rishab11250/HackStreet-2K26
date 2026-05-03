import { useState, useRef, useCallback } from 'react';
import useStore from '../store/useStore';
import useViewport from '../hooks/useViewport';
import { TOOLS } from '../store/constants';
import { PencilTool } from '../tools/PencilTool';
import { ShapeTool } from '../tools/ShapeTool';
import { TextTool } from '../tools/TextTool';
import { EraserTool } from '../tools/EraserTool';
import { SelectTool } from '../tools/SelectTool';
import { StickyNoteTool } from '../tools/StickyNoteTool';

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
    selectedIds,
    setSelectedIds,
    clearSelection,
    addElement,
    deleteElements,
    updateElement,
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
  const [selectionState, setSelectionState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const startResizing = useCallback((e, handle) => {
    e.stopPropagation();
    if (selectedIds.length !== 1) return;
    
    const element = elements.find(el => el.id === selectedIds[0]);
    if (!element) return;
    
    const { x, y } = toCanvas(e.clientX, e.clientY);
    setResizeState({
      handle,
      startX: x,
      startY: y,
      initialElement: { ...element }
    });
    setIsDrawing(true);
  }, [selectedIds, elements, toCanvas]);

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
      setSelectedIds,
      clearSelection,
      selectedIds,
      elements,
      setIsEditingText,
    };

    switch (activeTool) {
      case TOOLS.SELECT: {
        const state = SelectTool.onMouseDown(e, toolArgs);
        setSelectionState(state);
        setIsDrawing(true);
        break;
      }
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
      case TOOLS.STICKY: {
        StickyNoteTool.onClick(e, toolArgs);
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
    opacity, fontSize, fontWeight, toCanvas, pushHistory, addElement, setIsEditingText,
    setSelectedIds, clearSelection, elements, selectedIds
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

    if (resizeState) {
      const { x, y } = toCanvas(e.clientX, e.clientY);
      const dx = x - resizeState.startX;
      const dy = y - resizeState.startY;
      const { initialElement, handle } = resizeState;
      const updates = {};

      if (handle.includes('e')) updates.width = Math.max(10, initialElement.width + dx);
      if (handle.includes('s')) updates.height = Math.max(10, initialElement.height + dy);
      if (handle.includes('w')) {
        const newWidth = Math.max(10, initialElement.width - dx);
        updates.x = initialElement.x + (initialElement.width - newWidth);
        updates.width = newWidth;
      }
      if (handle.includes('n')) {
        const newHeight = Math.max(10, initialElement.height - dy);
        updates.y = initialElement.y + (initialElement.height - newHeight);
        updates.height = newHeight;
      }

      updateElement(initialElement.id, updates);
      return;
    }

    const toolArgs = {
      toCanvas,
      currentElement: liveElement,
      shiftKey: e.shiftKey,
      elements,
      deleteElements,
      setSelectedIds,
      state: activeTool === TOOLS.ERASER ? eraserState : selectionState,
    };

    switch (activeTool) {
      case TOOLS.SELECT: {
        const newState = SelectTool.onMouseMove(e, toolArgs);
        setSelectionState(newState);
        break;
      }
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
  }, [isPanning, isDrawing, resizeState, updateElement, activeTool, liveElement, elements, deleteElements, eraserState, selectionState, handlePan, toCanvas, setSelectedIds]);

  const onMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (!isDrawing) return;

    if (resizeState) {
      pushHistory();
      setResizeState(null);
      setIsDrawing(false);
      return;
    }

    switch (activeTool) {
      case TOOLS.SELECT: {
        SelectTool.onMouseUp(selectionState, { pushHistory, updateElement, selectedIds, elements });
        setSelectionState(null);
        break;
      }
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
  }, [isPanning, isDrawing, resizeState, activeTool, liveElement, eraserState, selectionState, addElement, pushHistory, updateElement, selectedIds, elements]);

  const onWheel = useCallback((e) => {
    handleZoom(e, containerRef);
  }, [handleZoom, containerRef]);

  return {
    liveElement,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    isPanning,
    startResizing,
  };
};

export default useCanvasEvents;
