import React from 'react';
import useStore from '../../store/useStore';

const PRESET_COLORS = [
  '#000000', '#1A1B2E', '#4A5568', '#718096',
  '#F05B5B', '#F0A05B', '#F0D25B', '#5BF0A0',
  '#5B6AF0', '#A05BF0', '#F05BBF', '#5BBFF0',
  '#FFFFFF', '#F8F9FB', '#E8EAF0', 'transparent'
];

const ColorPicker = ({ value, onChange, label }) => {
  const recentColors = useStore((state) => state.recentColors);
  const addRecentColor = useStore((state) => state.addRecentColor);

  const handleColorSelect = (color) => {
    onChange(color);
    if (color !== 'transparent') {
      addRecentColor(color);
    }
  };

  return (
    <div className="w-[220px] bg-white rounded-xl shadow-2xl border border-[var(--color-border)] p-3 flex flex-col gap-3 animate-in fade-in zoom-in duration-200">
      <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-1">
        {label || 'Select Color'}
      </div>
      
      {/* Grid of presets */}
      <div className="grid grid-cols-4 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${
              value === color ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''
            }`}
            style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
          >
            {color === 'transparent' && (
              <div className="w-full h-[2px] bg-red-500 rotate-45" />
            )}
          </button>
        ))}
      </div>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <div className="pt-2 border-t border-gray-50">
          <div className="text-[10px] text-[var(--color-text-muted)] mb-2 px-1">Recent</div>
          <div className="flex gap-2">
            {recentColors.map((color, idx) => (
              <button
                key={`${color}-${idx}`}
                onClick={() => handleColorSelect(color)}
                className={`w-6 h-6 rounded-full border border-gray-100 transition-transform hover:scale-110 ${
                  value === color ? 'ring-1 ring-[var(--color-primary)] ring-offset-1' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hex Input */}
      <div className="flex items-center gap-2 mt-1">
        <div 
          className="w-6 h-6 rounded border border-gray-200" 
          style={{ backgroundColor: value === 'transparent' ? 'white' : value }}
        />
        <input 
          type="text" 
          value={value === 'transparent' ? '' : value}
          onChange={(e) => handleColorSelect(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[var(--color-primary)] font-mono"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
