import { generateId } from '../utils/generateId';
import { isPointInElement } from '../utils/geometry';
import useStore from '../store/useStore';

const placeholderSize = (content, fontSize) => {
  const fs = fontSize ?? 16;
  const lines = String(content).split('\n');
  const lineHeight = fs * 1.2;
  const charW = fs * 0.58;
  const longest = lines.reduce((m, line) => Math.max(m, line.length), 0);
  return {
    width: Math.max(longest * charW, fs * 2),
    height: Math.max(lines.length * lineHeight, lineHeight),
  };
};

export const TextTool = {
  onClick: (e, { toCanvas, pushHistory, strokeColor, fontSize, fontWeight, fontStyle, addElement, deleteElements, setIsEditingText, elements }) => {
    const { x, y } = toCanvas(e.clientX, e.clientY);

    const existing = [...elements].reverse().find(
      (el) => el.type === 'text' && isPointInElement(x, y, el)
    );
    if (existing) {
      setIsEditingText(true, existing.id);
      return null;
    }

    const { editingElementId: prevEditId, elements: latestEls } = useStore.getState();
    if (prevEditId) {
      const prev = latestEls.find((el) => el.id === prevEditId);
      if (prev?.type === 'text' && !String(prev.content ?? '').trim()) {
        deleteElements([prevEditId]);
      }
    }

    pushHistory();

    // Empty content: canvas draws only user-typed text; textarea uses placeholder for guidance.
    const content = '';
    const { width, height } = placeholderSize(content, fontSize);

    const id = generateId();
    const newElement = {
      id,
      type: 'text',
      x,
      y,
      content,
      width,
      height,
      fontSize,
      fontWeight,
      fontStyle: fontStyle || 'normal',
      strokeColor, // text color uses strokeColor
      zIndex: Date.now(),
      createdAt: Date.now(),
      createdBy: 'user',
    };

    addElement(newElement);
    setIsEditingText(true, id);

    return null;
  }
};
