import { generateId } from '../utils/generateId';

export const StickyNoteTool = {
  onClick: (e, { toCanvas, pushHistory, addElement }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);
    pushHistory();

    const id = generateId();
    const newElement = {
      id,
      type: 'sticky',
      x: x - 100, // Center the 200px sticky note
      y: y - 75,  // Center the 150px sticky note
      width: 200,
      height: 150,
      content: '',
      noteColor: '#FFF176', // Default yellow
      zIndex: Date.now(),
      createdAt: Date.now(),
      createdBy: 'user',
    };

    addElement(newElement);
    return null;
  }
};
