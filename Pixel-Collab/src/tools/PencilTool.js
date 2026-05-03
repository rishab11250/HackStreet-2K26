import { generateId } from '../utils/generateId';
import { smoothPath } from '../utils/smoothPath';

export const PencilTool = {
  onMouseDown: (e, { toCanvas, pushHistory, strokeColor, strokeWidth, opacity }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);
    pushHistory();
    
    return {
      id: generateId(),
      type: 'freehand',
      x,
      y,
      points: [[x, y]],
      smoothPoints: [[x, y]],
      strokeColor,
      strokeWidth,
      opacity,
      zIndex: Date.now(),
      createdAt: Date.now(),
      createdBy: 'user',
    };
  },

  onMouseMove: (e, { toCanvas, currentElement }) => {
    if (!currentElement) return null;
    
    const { x, y } = toCanvas(e.clientX, e.clientY);
    const newPoints = [...currentElement.points, [x, y]];
    
    // Throttling or basic optimization could go here if needed
    // For now we just return the updated element with new points
    return {
      ...currentElement,
      points: newPoints,
      // We don't smooth during drawing for performance, 
      // just use raw points for live preview
      smoothPoints: newPoints 
    };
  },

  onMouseUp: (currentElement) => {
    if (!currentElement) return null;
    
    // Final smoothing on mouse up
    const smoothed = smoothPath(currentElement.points);
    
    return {
      ...currentElement,
      smoothPoints: smoothed
    };
  }
};
