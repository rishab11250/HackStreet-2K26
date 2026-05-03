import { useEffect } from 'react';
import useStore from '../store/useStore';
import { TOOLS } from '../store/constants';

export const useKeyboard = () => {
  const { 
    undo, 
    redo, 
    setActiveTool, 
    deleteElements, 
    duplicateElements,
    selectedIds, 
    clearSelection,
    toggleGrid,
    toggleActivityFeed
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') || ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Duplicate: Ctrl/Cmd + D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          duplicateElements(selectedIds);
        }
      }

      // Tool Shortcuts
      switch (e.key.toLowerCase()) {
        case 'v': setActiveTool(TOOLS.SELECT); break;
        case 'h': setActiveTool(TOOLS.PAN); break;
        case 'p': setActiveTool(TOOLS.PENCIL); break;
        case 's': setActiveTool(TOOLS.SHAPE); break;
        case 't': setActiveTool(TOOLS.TEXT); break;
        case 'n': setActiveTool(TOOLS.STICKY); break;
        case 'e': setActiveTool(TOOLS.ERASER); break;
        case 'g': toggleGrid(); break;
        case 'a': toggleActivityFeed(); break;
        case 'escape': clearSelection(); break;
        case 'backspace':
        case 'delete':
          if (selectedIds.length > 0) {
            deleteElements(selectedIds);
          }
          break;
        default: break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, setActiveTool, deleteElements, duplicateElements, selectedIds, clearSelection, toggleGrid, toggleActivityFeed]);
};
