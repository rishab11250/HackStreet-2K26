import { useEffect, useRef, useMemo, useState } from 'react';
import useStore from '../store/useStore';
import { getContentBoundingBox, getElementBounds } from '../utils/geometry';

const MAP_W = 168;
const MAP_H = 120;
const PAD = 8;

export default function Minimap({ containerRef, presentationMode }) {
  const elements = useStore((s) => s.elements);
  const viewport = useStore((s) => s.viewport);
  const setViewport = useStore((s) => s.setViewport);
  const [dims, setDims] = useState({ cw: 800, ch: 600 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDims({ cw: Math.max(1, r.width), ch: Math.max(1, r.height) });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setDims({ cw: Math.max(1, r.width), ch: Math.max(1, r.height) });
    return () => ro.disconnect();
  }, [containerRef]);

  const world = useMemo(() => {
    const b = getContentBoundingBox(elements);
    if (elements.length === 0 || b.width < 8 || b.height < 8) {
      return { x: -400, y: -300, width: 1600, height: 1200 };
    }
    return b;
  }, [elements]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || presentationMode) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    c.width = MAP_W * dpr;
    c.height = MAP_H * dpr;
    c.style.width = `${MAP_W}px`;
    c.style.height = `${MAP_H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, MAP_W, MAP_H);

    const css = getComputedStyle(document.documentElement);
    const bg = css.getPropertyValue('--color-minimap-bg').trim() || '#e4e6ef';
    const dot = css.getPropertyValue('--color-minimap-dot').trim() || '#c5cad8';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, MAP_W, MAP_H);

    const scale = Math.min((MAP_W - PAD * 2) / world.width, (MAP_H - PAD * 2) / world.height);
    const ox = PAD + (MAP_W - PAD * 2 - world.width * scale) / 2;
    const oy = PAD + (MAP_H - PAD * 2 - world.height * scale) / 2;

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    ctx.translate(-world.x, -world.y);

    elements.forEach((el) => {
      const b = getElementBounds(el);
      ctx.fillStyle = el.locked ? 'rgba(160, 160, 180, 0.45)' : 'rgba(91, 106, 240, 0.4)';
      ctx.fillRect(b.x, b.y, Math.max(b.width, 3), Math.max(b.height, 3));
    });
    ctx.restore();

    const vx = -viewport.x / viewport.zoom;
    const vy = -viewport.y / viewport.zoom;
    const vw = dims.cw / viewport.zoom;
    const vh = dims.ch / viewport.zoom;

    ctx.strokeStyle = css.getPropertyValue('--color-primary').trim() || '#5B6AF0';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox + (vx - world.x) * scale, oy + (vy - world.y) * scale, vw * scale, vh * scale);

    ctx.fillStyle = dot;
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText('Map', 6, 12);
  }, [elements, viewport, world, dims, presentationMode]);

  const handleClick = (e) => {
    if (presentationMode) return;
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const scale = Math.min((MAP_W - PAD * 2) / world.width, (MAP_H - PAD * 2) / world.height);
    const ox = PAD + (MAP_W - PAD * 2 - world.width * scale) / 2;
    const oy = PAD + (MAP_H - PAD * 2 - world.height * scale) / 2;
    const wx = world.x + (mx - ox) / scale;
    const wy = world.y + (my - oy) / scale;
    setViewport({
      ...viewport,
      x: dims.cw / 2 - wx * viewport.zoom,
      y: dims.ch / 2 - wy * viewport.zoom,
    });
  };

  if (presentationMode) return null;

  return (
    <div
      className="absolute bottom-4 right-4 z-50 rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden transition-all duration-300 ease-out bg-[var(--color-panel-bg)]"
      style={{ width: MAP_W, height: MAP_H }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Canvas minimap, click to navigate"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
          }
        }}
        className="block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      />
    </div>
  );
}
