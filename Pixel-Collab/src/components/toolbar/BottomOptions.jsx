import { useState } from 'react';
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine, 
  ArrowDownToLine,
  Bold,
  Italic,
  Type,
  Lock,
  Unlock,
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
    fontWeight, setFontWeight,
    fontStyle, setFontStyle,
    eraserSize, setEraserSize,
    selectedIds, deleteElements,
    bringForward, sendBackward, bringToFront, sendToBack,
    elements, updateElement,
    isEditingText,
    editingElementId,
    presentationMode,
    snapToGrid,
    setSnapToGrid,
    gridSnapSize,
    setGridSnapSize,
    toggleLockSelected,
  } = useStore();

  const [activePicker, setActivePicker] = useState(null);

  const isTextTool = activeTool === TOOLS.TEXT;
  const isSelectTool = activeTool === TOOLS.SELECT;
  const isStickyTool = activeTool === TOOLS.STICKY;
  const isDrawingTool = [TOOLS.PENCIL, TOOLS.SHAPE].includes(activeTool);
  const isEraserTool = activeTool === TOOLS.ERASER;
  
  const showOptions =
    isDrawingTool ||
    isTextTool ||
    isStickyTool ||
    isEraserTool ||
    isSelectTool ||
    activeTool === TOOLS.PAN;

  if (presentationMode) return null;
  if (!showOptions) return null;

  const selectedId = selectedIds[0];
  const selectedElement = elements.find(el => el.id === selectedId);
  const isTextFormatting =
    isTextTool || (isSelectTool && selectedElement?.type === 'text');

  const targetTextElementId =
    isSelectTool && selectedElement?.type === 'text'
      ? selectedId
      : isTextTool && isEditingText && editingElementId
        ? editingElementId
        : null;

  const applyTextPatch = (patch) => {
    if (targetTextElementId) updateElement(targetTextElementId, patch);
  };

  const editingElement =
    isTextTool && isEditingText && editingElementId
      ? elements.find((e) => e.id === editingElementId)
      : null;

  const displayStrokeColor =
    isSelectTool && selectedElement?.type === 'text'
      ? (selectedElement.strokeColor ?? strokeColor)
      : editingElement
        ? (editingElement.strokeColor ?? strokeColor)
        : strokeColor;

  const uiFontSize =
    isSelectTool && selectedElement?.type === 'text'
      ? (selectedElement.fontSize ?? fontSize)
      : editingElement
        ? (editingElement.fontSize ?? fontSize)
        : fontSize;

  const uiFontWeight =
    isSelectTool && selectedElement?.type === 'text'
      ? String(selectedElement.fontWeight ?? fontWeight)
      : editingElement
        ? String(editingElement.fontWeight ?? fontWeight)
        : String(fontWeight);

  const uiFontStyle =
    isSelectTool && selectedElement?.type === 'text'
      ? (selectedElement.fontStyle ?? fontStyle)
      : editingElement
        ? (editingElement.fontStyle ?? fontStyle)
        : fontStyle;

  const handleStickyColorChange = (color) => {
    if (isSelectTool && selectedElement?.type === 'sticky') {
      updateElement(selectedId, { noteColor: color });
    } else {
      // Logic for setting default sticky color if added to store later
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-[var(--color-border)] rounded-2xl shadow-2xl p-2 flex items-center gap-3 z-40 animate-in slide-in-from-bottom-4 duration-300">
      
      {/* Eraser Size */}
      {isEraserTool && (
        <div className="flex items-center gap-3 px-3 border-r border-gray-100 mr-1">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
            SIZE
          </div>
          <input 
            type="range" 
            min="5" 
            max="100" 
            value={eraserSize} 
            onChange={(e) => setEraserSize(parseInt(e.target.value))}
            className="w-24 accent-[var(--color-primary)]"
          />
          <span className="text-[10px] font-bold text-gray-500 min-w-[24px]">{eraserSize}px</span>
        </div>
      )}

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
      ) : !isEraserTool && (
        <>
          {/* Stroke Color */}
          <div className="relative">
            <button 
              onClick={() => setActivePicker(activePicker === 'stroke' ? null : 'stroke')}
              className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center hover:scale-105 transition-transform"
              style={{ backgroundColor: displayStrokeColor === 'transparent' ? 'white' : displayStrokeColor }}
              title="Stroke Color"
            >
              {displayStrokeColor === 'transparent' && <div className="w-full h-[2px] bg-red-500 rotate-45" />}
            </button>
            {activePicker === 'stroke' && (
              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2">
                <ColorPicker 
                  value={displayStrokeColor} 
                  onChange={(c) => {
                    setStrokeColor(c);
                    applyTextPatch({ strokeColor: c });
                    setActivePicker(null);
                  }} 
                  label="Stroke Color"
                />
              </div>
            )}
          </div>

          {/* Fill Color */}
          {activeTool !== TOOLS.PENCIL && !isTextTool && !(isSelectTool && selectedElement?.type === 'text') && (
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

      {!isEraserTool && (
        <>
          <div className="flex items-center gap-2 px-2">
            <label className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-text-muted)] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={snapToGrid}
                onChange={(e) => setSnapToGrid(e.target.checked)}
                className="rounded border-gray-300 accent-[var(--color-primary)]"
              />
              Snap
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={gridSnapSize}
              onChange={(e) => setGridSnapSize(parseInt(e.target.value, 10))}
              title="Grid spacing (10–100px). Hold Alt while dragging to bypass snap."
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
            <span className="text-[10px] font-medium text-[var(--color-text-secondary)] w-9 tabular-nums">
              {gridSnapSize}px
            </span>
          </div>
          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
        </>
      )}

      {/* Stroke Width */}
      {!isTextTool && !isStickyTool && !isEraserTool && !(isSelectTool && selectedElement?.type === 'sticky') && (
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

      {/* Font size / weight / style for text tool or selected text */}
      {isTextFormatting && !isEraserTool && (
        <div className="flex items-center gap-2 px-2">
          <Type size={14} className="text-gray-400" />
          <select 
            value={uiFontSize}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setFontSize(v);
              applyTextPatch({ fontSize: v });
            }}
            className="text-xs font-medium border-none focus:ring-0 cursor-pointer"
          >
            {[12, 16, 20, 24, 32, 48, 64].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
          <button
            type="button"
            title="Bold"
            onClick={() => {
              const next = uiFontWeight === '700' ? '400' : '700';
              setFontWeight(next);
              applyTextPatch({ fontWeight: next });
            }}
            className={`p-1.5 rounded transition-colors ${
              uiFontWeight === '700' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => {
              const next = uiFontStyle === 'italic' ? 'normal' : 'italic';
              setFontStyle(next);
              applyTextPatch({ fontStyle: next });
            }}
            className={`p-1.5 rounded transition-colors ${
              uiFontStyle === 'italic' ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Italic size={14} />
          </button>
        </div>
      )}

      {/* Z-Order & Delete for Selection */}
      {isSelectTool && selectedIds.length > 0 && !isEraserTool && (
        <>
          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
          <button
            type="button"
            onClick={() => toggleLockSelected()}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            title="Lock or unlock selected elements"
            aria-label="Toggle lock on selection"
          >
            {selectedIds.length > 0 &&
            selectedIds.every((id) => elements.find((e) => e.id === id)?.locked) ? (
              <Unlock size={18} />
            ) : (
              <Lock size={18} />
            )}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => bringToFront(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bring to Front"><ArrowUpToLine size={16} /></button>
            <button onClick={() => bringForward(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Bring Forward"><ArrowUp size={16} /></button>
            <button onClick={() => sendBackward(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Send Backward"><ArrowDown size={16} /></button>
            <button onClick={() => sendToBack(selectedId)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Send to Back"><ArrowDownToLine size={16} /></button>
          </div>
          <div className="w-[1px] h-6 bg-gray-100 mx-1" />
          <button 
            onClick={() => {
              const removable = selectedIds.filter((id) => !elements.find((e) => e.id === id)?.locked);
              if (removable.length) deleteElements(removable);
            }}
            className="p-2 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            title="Delete selected (locked items skipped)"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}

      {/* Opacity */}
      {!isEraserTool && !(isStickyTool || (isSelectTool && selectedElement?.type === 'sticky')) && (
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
