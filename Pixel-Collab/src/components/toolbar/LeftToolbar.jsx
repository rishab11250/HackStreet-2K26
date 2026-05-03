import { useState } from 'react';

import { 
  MousePointer2, 
  Hand, 
  Pencil, 
  Square, 
  Circle,
  Minus,
  MoveRight,
  Type, 
  StickyNote, 
  Eraser, 
  Grid3X3, 
  HelpCircle 
} from 'lucide-react';
import useStore from '../../store/useStore';
import { TOOLS, SHAPES } from '../../store/constants';
import ToolButton from './ToolButton';
import ShapeDropdown from './ShapeDropdown';

const LeftToolbar = () => {
  const { activeTool, setActiveTool, activeShape, toggleGrid, showGrid } = useStore();
  const [isShapeDropdownOpen, setIsShapeDropdownOpen] = useState(false);

  const getShapeIcon = () => {
    switch (activeShape) {
      case SHAPES.CIRCLE: return Circle;
      case SHAPES.LINE: return Minus;
      case SHAPES.ARROW: return MoveRight;
      default: return Square;
    }
  };

  const handleToolClick = (toolId) => {
    if (toolId === TOOLS.SHAPE) {
      if (activeTool === TOOLS.SHAPE) {
        setIsShapeDropdownOpen(!isShapeDropdownOpen);
      } else {
        setActiveTool(TOOLS.SHAPE);
        setIsShapeDropdownOpen(true);
      }
    } else {
      setActiveTool(toolId);
      setIsShapeDropdownOpen(false);
    }
  };

  const mainTools = [
    { id: TOOLS.SELECT, name: 'Select', icon: MousePointer2, shortcut: 'V' },
    { id: TOOLS.PAN, name: 'Pan', icon: Hand, shortcut: 'H' },
    { id: TOOLS.PENCIL, name: 'Pencil', icon: Pencil, shortcut: 'P' },
    { id: TOOLS.SHAPE, name: 'Shape', icon: getShapeIcon(), shortcut: 'S' },
    { id: TOOLS.TEXT, name: 'Text', icon: Type, shortcut: 'T' },
    { id: TOOLS.STICKY, name: 'Sticky', icon: StickyNote, shortcut: 'N' },
    { id: TOOLS.ERASER, name: 'Eraser', icon: Eraser, shortcut: 'E' },
  ];

  return (
    <aside className="w-[56px] h-full bg-[var(--color-toolbar-bg)] flex flex-col items-center py-4 border-r border-white/5 z-20 shadow-2xl relative">
      <div className="flex flex-col gap-1 w-full px-2">
        {mainTools.map((tool) => (
          <div key={tool.id} className="relative">
            <ToolButton
              icon={tool.icon}
              name={tool.name}
              shortcut={tool.shortcut}
              active={activeTool === tool.id}
              onClick={() => handleToolClick(tool.id)}
            />
            {tool.id === TOOLS.SHAPE && isShapeDropdownOpen && (
              <ShapeDropdown onClose={() => setIsShapeDropdownOpen(false)} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-1 w-full px-2 border-t border-white/10 pt-4">
        <ToolButton
          icon={Grid3X3}
          name="Toggle Grid"
          shortcut="G"
          active={showGrid}
          onClick={toggleGrid}
        />
        <ToolButton
          icon={HelpCircle}
          name="Help"
          shortcut="?"
          active={false}
          onClick={() => {}}
        />
      </div>
    </aside>
  );
};

export default LeftToolbar;
