import { useEffect, useLayoutEffect, useRef } from 'react';
import useStore from '../../store/useStore';

/** After opening, ignore blur briefly so the same pointer gesture / StrictMode remount cannot close the editor. */
const BLUR_IGNORE_MS = 550;
const BLUR_COMMIT_MS = 150;

const TextInput = () => {
  const {
    isEditingText,
    editingElementId,
    elements,
    updateElement,
    deleteElements,
    setIsEditingText,
    viewport,
  } = useStore();

  const element = elements.find((el) => el.id === editingElementId);
  const inputRef = useRef(null);
  const blurTimerRef = useRef(null);
  const ignoreBlurUntilRef = useRef(0);
  const textCommittedRef = useRef(false);

  const fs = element ? (element.fontSize ?? 16) : 16;
  const lineHeightPx = fs * 1.2;

  const x = element ? element.x * viewport.zoom + viewport.x : 0;
  const y = element ? element.y * viewport.zoom + viewport.y : 0;

  const clearBlurTimer = () => {
    if (blurTimerRef.current != null) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  };

  // When the editing target appears or changes — not on every content keystroke (avoids focus/caret resets).
  useLayoutEffect(() => {
    if (!isEditingText || !editingElementId || !element) return;

    ignoreBlurUntilRef.current = performance.now() + BLUR_IGNORE_MS;
    textCommittedRef.current = false;
    clearBlurTimer();

    const el = inputRef.current;
    if (!el) return;

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        el.focus({ preventScroll: true });
        try {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        } catch {
          /* ignore */
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // Intentionally omit `element`: its reference changes every keystroke; `element?.id` is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-focus when editing target id changes
  }, [isEditingText, editingElementId, element?.id]);

  useEffect(() => {
    if (!isEditingText || !inputRef.current || !element) return;
    const el = inputRef.current;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    el.style.width = 'auto';
    el.style.width = `${Math.max(200, el.scrollWidth)}px`;
  }, [isEditingText, editingElementId, viewport.x, viewport.y, viewport.zoom, element?.content]);

  useEffect(() => () => clearBlurTimer(), []);

  if (!isEditingText || !element) return null;

  const stroke = element.strokeColor || '#1A1B2E';

  const handleChange = (e) => {
    const content = e.target.value;
    const t = e.target;
    t.style.height = 'auto';
    t.style.height = `${t.scrollHeight}px`;
    t.style.width = 'auto';
    const width = Math.max(200, t.scrollWidth);
    t.style.width = `${width}px`;

    updateElement(element.id, {
      content,
      width: width / viewport.zoom,
      height: t.scrollHeight / viewport.zoom,
    });
  };

  const handleBlur = () => {
    // Only clear if we are still editing THIS element
    if (useStore.getState().editingElementId === element.id) {
      if (!element.content.trim() || element.content === 'New Text') {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    }
  };

  const handleFocus = () => {
    // No-op
  };

  const handleKeyDown = (e) => {
    const latest = useStore.getState().elements.find((el) => el.id === element.id);
    const text = (latest?.content ?? '').trim();

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!text || text === 'New Text') {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (!text || text === 'New Text') {
        deleteElements([element.id]);
      }
      setIsEditingText(false, null);
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="absolute z-[100]"
      style={{
        left: x - 2,
        top: y - 2,
      }}
    >
      <div className="rounded-lg shadow-2xl ring-4 ring-[#5B6AF0]/20 border-2 border-[#5B6AF0] bg-white">
        <textarea
          ref={inputRef}
          spellCheck={false}
          placeholder="Start typing..."
          value={element.content}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={stop}
          onClick={stop}
          className="block w-auto min-w-[200px] bg-white outline-none resize-none px-2 py-1 rounded-md selection:bg-[#5B6AF0]/35 placeholder:text-gray-500"
          style={{
            color: stroke,
            fontSize: `${fs}px`,
            fontWeight: element.fontWeight ?? '400',
            fontStyle: element.fontStyle || 'normal',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: `${lineHeightPx}px`,
            width: 'auto',
            height: 'auto',
          }}
          rows={1}
        />
      </div>
      <div className="absolute -top-6 left-0 bg-[#5B6AF0] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider shadow-sm pointer-events-none">
        Editing Text
      </div>
    </div>
  );
};

export default TextInput;
