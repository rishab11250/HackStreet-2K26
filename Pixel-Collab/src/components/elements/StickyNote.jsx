import useStore from '../../store/useStore';
import useViewport from '../../hooks/useViewport';

const StickyNote = ({ element }) => {
  const { updateElement, setSelectedIds, selectedIds } = useStore();
  const { toScreen, viewport } = useViewport();
  
  const isSelected = selectedIds.includes(element.id);
  const screenPos = toScreen(element.x, element.y);

  const handleChange = (e) => {
    updateElement(element.id, { content: e.target.value });
  };

  const handleBlur = () => {
    // Content is already updated via handleChange
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedIds([element.id]);
  };

  const style = {
    position: 'absolute',
    left: screenPos.x,
    top: screenPos.y,
    width: 200 * viewport.zoom,
    height: 150 * viewport.zoom,
    backgroundColor: element.noteColor || '#FFF176',
    boxShadow: '3px 3px 10px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
    transformOrigin: 'top left',
    border: isSelected ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.1)',
  };

  const headerStyle = {
    height: 24 * viewport.zoom,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  };

  const textareaStyle = {
    flex: 1,
    padding: 8 * viewport.zoom,
    backgroundColor: 'transparent',
    border: 'none',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 13 * viewport.zoom,
    color: '#1A1B2E',
    lineHeight: 1.4,
  };

  return (
    <div style={style} onClick={handleClick}>
      <div style={headerStyle} />
      <textarea
        style={textareaStyle}
        value={element.content || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Type something..."
      />
    </div>
  );
};

export default StickyNote;
