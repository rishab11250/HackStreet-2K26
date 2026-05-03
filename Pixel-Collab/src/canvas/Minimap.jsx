import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { getContentBoundingBox } from '../utils/geometry';
import { drawMinimapElement } from './minimapDraw';

const MAP_W = 168;
const MAP_H = 120;
const PAD = 8;

export default function Minimap({ containerRef, presentationMode }) {
  const elements = useStore((s) => s.elements);
  const viewport = useStore((s) => s.viewport);
  const showGrid = useStore((s) => s.showGrid);
  const snapToGrid = useStore((s) => s.snapToGrid);
  const gridSnapSize = useStore((s) => s.gridSnapSize);
  const setViewport = useStore((s) => s.setViewport);
  const [dims, setDims] = useState({ cw: 800, ch: 600 });
  const canvasRef = useRef(null);
  const dimsRef = useRef(dims);

  useEffect(() => {
    dimsRef.current = dims;
  }, [dims]);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setDims({ cw: Math.max(1, r.width), ch: Math.max(1, r.height) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [containerRef]);

  const world = useMemo(() => {
    const b = getContentBoundingBox(elements);
    if (elements.length === 0 || b.width < 8 || b.height < 8) {
      return { x: -400, y: -300, width: 1600, height: 1200 };
    }
    return {
      ...b,
      x: b.x - 160,
      y: b.y - 120,
      width: b.width + 320,
      height: b.height + 240,
    };
  }, [elements]);

  const redraw = useCallback(() => {
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

    if (showGrid && snapToGrid && gridSnapSize >= 10) {
      ctx.strokeStyle = 'rgba(120,125,155,0.12)';
      ctx.lineWidth = 1 / Math.max(scale, 0.0001);
      const step = gridSnapSize;
      const gx0 = Math.floor(world.x / step) * step;
      const gy0 = Math.floor(world.y / step) * step;
      for (let gx = gx0; gx <= world.x + world.width + step; gx += step) {
        ctx.beginPath();
        ctx.moveTo(gx, world.y - 10000);
        ctx.lineTo(gx, world.y + world.height + 10000);
        ctx.stroke();
      }
      for (let gy = gy0; gy <= world.y + world.height + step; gy += step) {
        ctx.beginPath();
        ctx.moveTo(world.x - 10000, gy);
        ctx.lineTo(world.x + world.width + 10000, gy);
        ctx.stroke();
      }
    }

    elements.forEach((el) => {
      drawMinimapElement(ctx, el, scale);
    });
    ctx.restore();

    const vpSnapshot = useStore.getState().viewport;
    const dim = dimsRef.current;
    const vx = -vpSnapshot.x / vpSnapshot.zoom;
    const vy = -vpSnapshot.y / vpSnapshot.zoom;
    const vw = dim.cw / vpSnapshot.zoom;
    const vh = dim.ch / vpSnapshot.zoom;

    const ix = ox + (vx - world.x) * scale;
    const iy = oy + (vy - world.y) * scale;
    const iw = vw * scale;
    const ih = vh * scale;

    ctx.strokeStyle = css.getPropertyValue('--color-primary').trim() || '#5B6AF0';
    ctx.lineWidth = 2;
    ctx.strokeRect(ix, iy, Math.max(iw, 2), Math.max(ih, 2));

    ctx.fillStyle = dot;
    ctx.font = '10px Inter, system-ui, sans-serif';
    ctx.fillText('Map', 6, 12);
  }, [elements, world, presentationMode, showGrid, snapToGrid, gridSnapSize]);

  useEffect(() => {
    if (!presentationMode) redraw();
  }, [redraw, presentationMode, viewport, dims]);

  const focusWorldPoint = useCallback(
    (wx, wy) => {
      if (presentationMode) return;
      setViewport((vp) => ({
        zoom: vp.zoom,
        x: dimsRef.current.cw / 2 - wx * vp.zoom,
        y: dimsRef.current.ch / 2 - wy * vp.zoom,
      }));
    },
    [setViewport, presentationMode]
  );

  const handleClick = (e) => {
    if (presentationMode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    const w = world;
    if (!rect) return;

    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const scale = Math.min((MAP_W - PAD * 2) / w.width, (MAP_H - PAD * 2) / w.height);
    const ox = PAD + (MAP_W - PAD * 2 - w.width * scale) / 2;
    const oy = PAD + (MAP_H - PAD * 2 - w.height * scale) / 2;
    const wx = w.x + (mx - ox) / scale;
    const wy = w.y + (my - oy) / scale;

    focusWorldPoint(wx, wy);
  };

  const onKeyNavigate = useCallback(
    (e) => {
      if (presentationMode || e.target !== canvasRef.current) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      focusWorldPoint(world.x + world.width / 2, world.y + world.height / 2);
    },
    [focusWorldPoint, presentationMode, world]
  );

  if (presentationMode) return null;

  return (
    <div
      className="absolute bottom-4 left-4 z-50 rounded-xl shadow-lg border border-[var(--color-border)] overflow-hidden transition-all duration-300 ease-out bg-[var(--color-panel-bg)]"
      style={{ width: MAP_W, height: MAP_H }}
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Canvas minimap. Click or press Enter to navigate to that region."
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={onKeyNavigate}
        className="block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-opacity duration-300"
      />
    </div>
  );
}
