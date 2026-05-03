import { isPointInElement, isElementInBox } from '../utils/geometry';

export const SelectTool = {
  onMouseDown: (e, { toCanvas, elements, selectedIds, setSelectedIds, clearSelection }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);
    
    // Check if we clicked on an element (reverse order for top-most)
    const clickedElement = [...elements].reverse().find(el => isPointInElement(x, y, el));
    
    if (clickedElement) {
      if (e.shiftKey) {
        // Toggle selection with Shift
        if (selectedIds.includes(clickedElement.id)) {
          setSelectedIds(selectedIds.filter(id => id !== clickedElement.id));
        } else {
          setSelectedIds([...selectedIds, clickedElement.id]);
        }
      } else {
        // Normal selection: replace if not already selected
        if (!selectedIds.includes(clickedElement.id)) {
          setSelectedIds([clickedElement.id]);
        }
      }
      
      return { 
        type: 'move', 
        startX: x, 
        startY: y,
        initialElements: elements.filter(el => selectedIds.includes(el.id) || el.id === clickedElement.id)
      };
    } else {
      // Clicked empty space: start marquee
      if (!e.shiftKey) clearSelection();
      return { type: 'marquee', startX: x, startY: y, x, y, width: 0, height: 0 };
    }
  },

  onMouseMove: (e, { toCanvas, elements, setSelectedIds, state }) => {
    if (!state) return null;
    
    const { x, y } = toCanvas(e.clientX, e.clientY);
    
    if (state.type === 'marquee') {
      const width = x - state.startX;
      const height = y - state.startY;
      
      // Update marquee visual
      const newState = { ...state, x: Math.min(state.startX, x), y: Math.min(state.startY, y), width: Math.abs(width), height: Math.abs(height) };
      
      // Find elements in box
      const inBoxIds = elements
        .filter(el => isElementInBox(el, newState.x, newState.y, newState.width, newState.height))
        .map(el => el.id);
      
      setSelectedIds(inBoxIds);
      return newState;
    }
    
    if (state.type === 'move') {
      const dx = x - state.startX;
      const dy = y - state.startY;
      
      return { ...state, dx, dy };
    }
    
    if (state.type === 'resize') {
      // Resize logic will be handled by the handle drag in useCanvasEvents
    }
    
    return state;
  },

  onMouseUp: (state, { pushHistory, updateElement, selectedIds, elements }) => {
    if (!state) return null;
    
    const dx = state.dx ?? 0;
    const dy = state.dy ?? 0;
    if (state.type === 'move' && (dx !== 0 || dy !== 0)) {
      pushHistory();
      // Apply movement to all selected elements
      selectedIds.forEach(id => {
        const el = elements.find(e => e.id === id);
        if (el) {
          if (el.type === 'freehand') {
            const newPoints = el.points.map(p => [p[0] + state.dx, p[1] + state.dy]);
            const newSmoothPoints = el.smoothPoints?.map(p => [p[0] + state.dx, p[1] + state.dy]);
            updateElement(id, { 
              x: el.x + dx, 
              y: el.y + dy, 
              points: newPoints,
              smoothPoints: newSmoothPoints
            });
          } else {
            updateElement(id, { x: el.x + dx, y: el.y + dy });
          }
        }
      });
    }
    
    return null;
  }
};
