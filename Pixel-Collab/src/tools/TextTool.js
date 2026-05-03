import { generateId } from '../utils/generateId';

export const TextTool = {
  onClick: (e, { toCanvas, pushHistory, strokeColor, fontSize, fontWeight, addElement, setIsEditingText }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);
    pushHistory();

    const id = generateId();
    const newElement = {
      id,
      type: 'text',
      x,
      y,
      content: '',
      fontSize,
      fontWeight,
      strokeColor, // text color uses strokeColor
      zIndex: Date.now(),
      createdAt: Date.now(),
      createdBy: 'user',
    };

    addElement(newElement);
    setIsEditingText(true, id);
    
    return null; // Text tool doesn't have a "current element" drag state in the same way
  }
};
