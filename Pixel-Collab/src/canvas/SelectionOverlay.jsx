import useStore from '../store/useStore';
import useViewport from '../hooks/useViewport';
import { getElementBounds } from '../utils/geometry';

const SelectionOverlay = ({ onStartResizing }) => {
  const { elements, selectedIds } = useStore();
  const { toScreen } = useViewport();

  if (selectedIds.length === 0) return null;

  // Calculate bounding box of all selected elements
  const selectedElements = elements.filter(el => selectedIds.includes(el.id));
  if (selectedElements.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  selectedElements.forEach(el => {
    const bounds = getElementBounds(el);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  const screenTopLeft = toScreen(minX, minY);
  const screenBottomRight = toScreen(maxX, maxY);

  const width = screenBottomRight.x - screenTopLeft.x;
  const height = screenBottomRight.y - screenTopLeft.y;

  const handles = [
    { pos: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { pos: 'n', x: width / 2, y: 0, cursor: 'ns-resize' },
    { pos: 'ne', x: width, y: 0, cursor: 'nesw-resize' },
    { pos: 'e', x: width, y: height / 2, cursor: 'ew-resize' },
    { pos: 'se', x: width, y: height, cursor: 'nwse-resize' },
    { pos: 's', x: width / 2, y: height, cursor: 'ns-resize' },
    { pos: 'sw', x: 0, y: height, cursor: 'nesw-resize' },
    { pos: 'w', x: 0, y: height / 2, cursor: 'ew-resize' },
  ];

  return (
    <div 
      className="absolute pointer-events-none z-30"
      style={{
        left: screenTopLeft.x - 2,
        top: screenTopLeft.y - 2,
        width: width + 4,
        height: height + 4,
        border: '1.5px solid #5B6AF0',
        boxSizing: 'border-box'
      }}
    >
      {selectedIds.length === 1 && handles.map(h => (
        <div
          key={h.pos}
          className="absolute w-2.5 h-2.5 bg-white border border-[#5B6AF0] rounded-sm pointer-events-auto shadow-sm"
          style={{
            left: h.x,
            top: h.y,
            transform: 'translate(-50%, -50%)',
            cursor: h.cursor
          }}
          onMouseDown={(e) => {
            onStartResizing(e, h.pos);
          }}
        />
      ))}
    </div>
  );
};

export default SelectionOverlay;
