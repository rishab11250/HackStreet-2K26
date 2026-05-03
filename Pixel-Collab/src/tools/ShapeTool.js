import { generateId } from '../utils/generateId';

export const ShapeTool = {
  onMouseDown: (e, { toCanvas, pushHistory, activeShape, strokeColor, fillColor, strokeWidth, opacity }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);
    pushHistory();

    return {
      id: generateId(),
      type: activeShape, // 'rect' | 'circle' | 'line' | 'arrow'
      x,
      y,
      width: 0,
      height: 0,
      strokeColor,
      fillColor,
      strokeWidth,
      opacity,
      zIndex: Date.now(),
      createdAt: Date.now(),
      createdBy: 'user',
    };
  },

  onMouseMove: (e, { toCanvas, currentElement, shiftKey }) => {
    if (!currentElement) return null;

    const { x: currentX, y: currentY } = toCanvas(e.clientX, e.clientY);
    let width = currentX - currentElement.x;
    let height = currentY - currentElement.y;

    if (shiftKey) {
      // Constrain aspect ratio
      const size = Math.max(Math.abs(width), Math.abs(height));
      width = Math.sign(width) * size;
      height = Math.sign(height) * size;
    }

    return {
      ...currentElement,
      width,
      height,
    };
  },

  onMouseUp: (currentElement) => {
    if (!currentElement) return null;
    
    // Normalize coordinates if width/height are negative (for rect/circle)
    if (currentElement.type === 'rect' || currentElement.type === 'circle') {
      const normalized = { ...currentElement };
      if (normalized.width < 0) {
        normalized.x += normalized.width;
        normalized.width = Math.abs(normalized.width);
      }
      if (normalized.height < 0) {
        normalized.y += normalized.height;
        normalized.height = Math.abs(normalized.height);
      }
      return normalized;
    }

    return currentElement;
  }
};
