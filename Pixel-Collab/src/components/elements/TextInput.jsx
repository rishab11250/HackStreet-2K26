import { useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import useViewport from '../../hooks/useViewport';

const TextInput = () => {
  const { 
    isEditingText, 
    editingElementId, 
    elements, 
    updateElement, 
    deleteElements, 
    setIsEditingText,
    viewport
  } = useStore();

  const element = elements.find(el => el.id === editingElementId);
  const inputRef = useRef(null);

  // Calculate screen position
  const x = element ? (element.x * viewport.zoom + viewport.x) : 0;
  const y = element ? (element.y * viewport.zoom + viewport.y) : 0;

  useEffect(() => {
    if (isEditingText && inputRef.current && element) {
      inputRef.current.focus();
      if (element.content === 'New Text') {
        inputRef.current.select();
      }
      
      // Auto-resize
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
      inputRef.current.style.width = 'auto';
      inputRef.current.style.width = Math.max(200, inputRef.current.scrollWidth) + 'px';
    }
  }, [isEditingText, editingElementId, viewport.zoom]);

  if (!isEditingText || !element) return null;

  const handleChange = (e) => {
    const content = e.target.value;
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    const height = e.target.scrollHeight;
    e.target.style.height = height + 'px';
    
    e.target.style.width = 'auto';
    const width = Math.max(200, e.target.scrollWidth);
    e.target.style.width = width + 'px';

    updateElement(element.id, { 
      content,
      width: width / viewport.zoom,
      height: height / viewport.zoom
    });
  };

  const handleBlur = () => {
    if (useStore.getState().editingElementId === element.id) {
      setIsEditingText(false, null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Use direct store access to avoid closure issues
      if (!element.content.trim()) {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    } else if (e.key === 'Escape') {
      if (!element.content.trim()) {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    }
  };

  return (
    <div 
      className="absolute z-[100]"
      style={{ 
        left: x, 
        top: y,
      }}
    >
      <textarea
        ref={inputRef}
        autoFocus
        placeholder="Start typing..."
        value={element.content}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
        className="block bg-white border-2 border-[#5B6AF0] outline-none resize-none p-3 rounded-lg shadow-2xl ring-4 ring-[#5B6AF0]/20"
        style={{
          color: element.strokeColor || '#1A1B2E',
          fontSize: `${element.fontSize}px`,
          fontWeight: element.fontWeight,
          fontFamily: 'Inter, sans-serif',
          minWidth: '200px',
          width: 'auto',
          height: 'auto',
        }}
        rows={1}
      />
      <div className="absolute -top-6 left-0 bg-[#5B6AF0] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm">
        Editing Text
      </div>
    </div>
  );
};

export default TextInput;
