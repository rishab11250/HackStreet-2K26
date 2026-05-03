import React from 'react';
import { Square, Circle, Minus, MoveRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { SHAPES } from '../../store/constants';

const ShapeDropdown = ({ onClose }) => {
  const { activeShape, setActiveShape } = useStore();

  const shapes = [
    { id: SHAPES.RECT, name: 'Rectangle', icon: Square },
    { id: SHAPES.CIRCLE, name: 'Circle', icon: Circle },
    { id: SHAPES.LINE, name: 'Line', icon: Minus },
    { id: SHAPES.ARROW, name: 'Arrow', icon: MoveRight },
  ];

  return (
    <div className="absolute left-[64px] top-0 bg-[var(--color-toolbar-bg)] rounded-lg p-1.5 shadow-2xl border border-white/10 flex flex-col gap-1 z-50">
      {shapes.map((shape) => (
        <button
          key={shape.id}
          onClick={() => {
            setActiveShape(shape.id);
            onClose();
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
            activeShape === shape.id 
              ? 'bg-[var(--color-primary)] text-white' 
              : 'text-[var(--color-toolbar-icon)] hover:bg-white/10 hover:text-white'
          }`}
          title={shape.name}
        >
          <shape.icon size={20} />
        </button>
      ))}
    </div>
  );
};

export default ShapeDropdown;
