import { useEffect } from 'react';
import useStore from '../store/useStore';
import { TOOLS } from '../store/constants';

export const useKeyboard = () => {
    const { 
    setActiveTool, 
    undo, 
    redo, 
    deleteElements, 
    selectedIds, 
    clearSelection,
    selectAll,
    zoomIn,
    zoomOut,
    resetZoom,
    isEditingText,
    duplicateElements
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const t = e.target;
      const ae = typeof document !== 'undefined' ? document.activeElement : null;
      const inEditable =
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA' ||
        ae?.tagName === 'TEXTAREA' ||
        ae?.tagName === 'INPUT' ||
        t?.isContentEditable ||
        ae?.isContentEditable;
      if (inEditable || isEditingText) return;

      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // TOOL SHORTCUTS
      if (!ctrl && !shift) {
        switch (e.key.toLowerCase()) {
          case 'v': setActiveTool(TOOLS.SELECT); break;
          case 'h': setActiveTool(TOOLS.PAN); break;
          case 'p': setActiveTool(TOOLS.PENCIL); break;
          case 's': setActiveTool(TOOLS.SHAPE); break;
          case 't': setActiveTool(TOOLS.TEXT); break;
          case 'n': setActiveTool(TOOLS.STICKY); break;
          case 'e': setActiveTool(TOOLS.ERASER); break;
          case 'escape': clearSelection(); break;
          case 'delete':
          case 'backspace': 
            if (selectedIds.length > 0) deleteElements(selectedIds); 
            break;
        }
      }

      // COMMAND SHORTCUTS
      if (ctrl) {
        switch (e.key.toLowerCase()) {
          case 'z': 
            if (shift) redo();
            else undo();
            e.preventDefault();
            break;
          case 'y': 
            redo(); 
            e.preventDefault();
            break;
          case 'd':
            if (selectedIds.length > 0) {
              duplicateElements(selectedIds);
              e.preventDefault();
            }
            break;
          case 'a':
            selectAll();
            e.preventDefault();
            break;
          case '=': 
          case '+':
            zoomIn(); 
            e.preventDefault(); 
            break;
          case '-': 
            zoomOut(); 
            e.preventDefault(); 
            break;
          case '0': 
            resetZoom(); 
            e.preventDefault(); 
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTool, undo, redo, deleteElements, selectedIds, clearSelection, selectAll, zoomIn, zoomOut, resetZoom, isEditingText, duplicateElements]);
};
