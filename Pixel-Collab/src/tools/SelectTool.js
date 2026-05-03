import { isPointInElement, isElementInBox } from '../utils/geometry';
import { snapScalar } from '../utils/snap';

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

  onMouseUp: (state, { pushHistory, updateElement, selectedIds, elements, snapToGrid, gridSnapSize, peerSnapConsumed = false }) => {
    if (!state) return null;
    
    const dx = state.dx ?? 0;
    const dy = state.dy ?? 0;
    if (state.type === 'move' && (dx !== 0 || dy !== 0)) {
      pushHistory();
      const useGridSnap = snapToGrid && gridSnapSize > 0 && !peerSnapConsumed;
      const grid = useGridSnap ? gridSnapSize : 0;
      selectedIds.forEach(id => {
        const el = elements.find(e => e.id === id);
        if (!el || el.locked) return;
        if (el.type === 'freehand') {
          const nx = grid ? snapScalar(el.x + dx, grid) : el.x + dx;
          const ny = grid ? snapScalar(el.y + dy, grid) : el.y + dy;
          const rdx = nx - el.x;
          const rdy = ny - el.y;
          const newPoints = el.points.map(p => [p[0] + rdx, p[1] + rdy]);
          const newSmoothPoints = el.smoothPoints?.map(p => [p[0] + rdx, p[1] + rdy]);
          updateElement(id, {
            x: nx,
            y: ny,
            points: newPoints,
            smoothPoints: newSmoothPoints
          });
        } else {
          const nx = grid ? snapScalar(el.x + dx, grid) : el.x + dx;
          const ny = grid ? snapScalar(el.y + dy, grid) : el.y + dy;
          updateElement(id, { x: nx, y: ny });
        }
      });
    }
    
    return null;
  }
};
