import { useState } from 'react';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine, 
  ArrowDownToLine,
  Bold,
  Italic,
  Type
} from 'lucide-react';
import useStore from '../../store/useStore';
import { TOOLS } from '../../store/constants';
import ColorPicker from '../ui/ColorPicker';

const STICKY_COLORS = [
  { name: 'Yellow', bg: '#FFF176' },
  { name: 'Green', bg: '#C8E6C9' },
  { name: 'Blue', bg: '#BBDEFB' },
  { name: 'Pink', bg: '#F8BBD0' },
  { name: 'Orange', bg: '#FFE0B2' },
  { name: 'Purple', bg: '#E1BEE7' },
];

const BottomOptions = () => {
  const { 
    activeTool, 
    strokeColor, setStrokeColor,
    fillColor, setFillColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    fontSize, setFontSize,
    selectedIds, deleteElements,
    bringForward, sendBackward, bringToFront, sendToBack,
    elements, updateElement
  } = useStore();

  const [activePicker, setActivePicker] = useState(null);

  const isTextTool = activeTool === TOOLS.TEXT;
  const isSelectTool = activeTool === TOOLS.SELECT;
  const isStickyTool = activeTool === TOOLS.STICKY;
  const isDrawingTool = [TOOLS.PENCIL, TOOLS.SHAPE].includes(activeTool);
  
  const showOptions = isDrawingTool || isTextTool || isStickyTool || (isSelectTool && selectedIds.length > 0);

  if (!showOptions) return null;

  const selectedId = selectedIds[0];
  const selectedElement = elements.find(el => el.id === selectedId);

  const handleStickyColorChange = (color) => {
    if (isSelectTool && selectedElement?.type === 'sticky') {
      updateElement(selectedId, { noteColor: color });
    } else {
      // Logic for setting default sticky color if added to store later
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[var(--color-border)] rounded-2xl shadow-2xl p-2 flex items-center gap-3 z-40 animate-in slide-in-from-bottom-4 duration-300">
      
      {/* Sticky Colors (shown when sticky tool or a sticky note is selected) */}
      {(isStickyTool || (isSelectTool && selectedElement?.type === 'sticky')) ? (
        <div className="flex items-center gap-2 px-2">
          {STICKY_COLORS.map((color) => (
            <button
              key={color.bg}
              onClick={() => handleStickyColorChange(color.bg)}
              className={`w-6 h-6 rounded-md border border-black/5 transition-transform hover:scale-110 ${
                (selectedElement?.noteColor === color.bg) ? 'ring-2 ring-[var(--color-primary)] ring-offset-1' : ''
              }`}
              style={{ backgroundColor: color.bg }}
              title={color.name}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Stroke Color */}
          <div className="relative">
            <button 
              onClick={() => setActivePicker(activePicker === 'stroke' ? null : 'stroke')}
              className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center hover:scale-105 transition-transform"
              style={{ backgroundColor: strokeColor === 'transparent' ? 'white' : strokeColor }}
              title="Stroke Color"
            >
              {strokeColor === 'transparent' && <div className="w-full h-[2px] bg-red-500 rotate-45" />}
            </button>
            {activePicker === 'stroke' && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2">
                <ColorPicker 
                  value={strokeColor} 
                  onChange={(c) => { setStrokeColor(c); setActivePicker(null); }} 
                  label="Stroke Color"
                />
              </div>
            )}
          </div>

          {/* Fill Color */}
          {activeTool !== TOOLS.PENCIL && !isTextTool && (
            <div className="relative">
              <button 
                onClick={() => setActivePicker(activePicker === 'fill' ? null : 'fill')}
                className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center hover:scale-105 transition-transform"
                style={{ backgroundColor: fillColor === 'transparent' ? 'white' : fillColor }}
                title="Fill Color"
              >
                {fillColor === 'transparent' && <div className="w-full h-[2px] bg-red-500 rotate-45" />}
              </button>
              {activePicker === 'fill' && (
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2">
                  <ColorPicker 
                    value={fillColor} 
                    onChange={(c) => { setFillColor(c); setActivePicker(null); }} 
                    label="Fill Color"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="w-[1px] h-6 bg-gray-100 mx-1" />

      {/* Stroke Width */}
      {!isTextTool && !isStickyTool && !(isSelectTool && selectedElement?.type === 'sticky') && (
        <div className="flex items-center gap-3 px-2">
          {[1, 3, 8].map((w) => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-50 transition-colors ${
                strokeWidth === w ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'text-gray-400'
              }`}
            >
              <div className="bg-current rounded-full" style={{ width: w + 2, height: w + 2 }} />
            </button>
          ))}
          <input 
            type="range" min="1" max="20" step="1"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
        </div>
      )}

      {/* Font Size for Text */}
      {isTextTool && (
        <div className="flex items-center gap-2 px-2">
          <Type size={14} className="text-gray-400" />
          <select 
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="text-xs font-medium border-none focus:ring-0 cursor-pointer"
          >
            {[12, 16, 20, 24, 32, 48, 64].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Bold size={14} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Italic size={14} /></button>
        </div>
      )}

      {/* Z-Order & Delete for Selection */}
      {isSelectTool && selectedIds.length > 0 && (
        <>
          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
          <div className="flex items-center gap-1">
            <button onClick={() => bringToFront(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bring to Front"><ArrowUpToLine size={16} /></button>
            <button onClick={() => bringForward(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bring Forward"><ArrowUp size={16} /></button>
            <button onClick={() => sendBackward(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Send Backward"><ArrowDown size={16} /></button>
            <button onClick={() => sendToBack(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Send to Back"><ArrowDownToLine size={16} /></button>
          </div>
          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
          <button 
            onClick={() => deleteElements(selectedIds)}
            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            title="Delete Selected"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}

      {/* Opacity */}
      {!(isStickyTool || (isSelectTool && selectedElement?.type === 'sticky')) && (
        <div className="flex items-center gap-2 px-2 border-l border-gray-100 ml-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Op</span>
          <input 
            type="range" min="0" max="1" step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <span className="text-[10px] font-medium text-gray-500 w-8">{Math.round(opacity * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default BottomOptions;
