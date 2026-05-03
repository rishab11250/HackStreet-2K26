import { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import useViewport from '../../hooks/useViewport';

const TextInput = () => {
  const { 
    isEditingText, 
    editingElementId, 
    elements, 
    updateElement, 
    setIsEditingText,
    deleteElements
  } = useStore();
  const { toScreen } = useViewport();
  const inputRef = useRef(null);

  const element = elements.find(el => el.id === editingElementId);

  useEffect(() => {
    if (isEditingText && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingText]);

  if (!isEditingText || !element) return null;

  const { x, y } = toScreen(element.x, element.y);
  
  const handleBlur = () => {
    if (!element.content.trim()) {
      deleteElements([element.id]);
    }
    setIsEditingText(false, null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      if (!element.content.trim()) {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    }
  };

  const handleChange = (e) => {
    updateElement(element.id, { content: e.target.value });
  };

  return (
    <div 
      className="absolute z-[100] pointer-events-none"
      style={{ 
        left: x, 
        top: y,
      }}
    >
      <textarea
        ref={inputRef}
        value={element.content}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="pointer-events-auto bg-transparent border-none outline-none resize-none p-0 overflow-hidden"
        style={{
          color: element.strokeColor,
          fontSize: `${element.fontSize}px`,
          fontWeight: element.fontWeight,
          fontFamily: 'Inter, sans-serif',
          minWidth: '10px',
          width: 'auto',
          height: 'auto',
        }}
        rows={1}
      />
    </div>
  );
};

export default TextInput;
