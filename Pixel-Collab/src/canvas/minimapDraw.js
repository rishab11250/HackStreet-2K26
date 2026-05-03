import { getElementBounds } from '../utils/geometry';

/** Visible stroke in world space: never thinner than ~1px on the minimap tile. */
export function minimapStrokeWidth(el, mapScale) {
  const w = el.strokeWidth ?? 2;
  return Math.max(w, 1.35 / Math.max(mapScale, 0.0001));
}

function strokePaint(el) {
  if (el.locked) return 'rgba(100, 100, 115, 0.9)';
  return el.strokeColor || '#1A1B2E';
}

function fillPaint(color, alpha) {
  if (!color || color === 'transparent') return null;
  if (typeof color === 'string' && color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return color;
}

/**
 * Draw one element in world space. Context is already in world coords (minimap transform applied).
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} el
 * @param {number} mapScale - pixels per world unit on minimap surface
 */
export function drawMinimapElement(ctx, el, mapScale) {
  ctx.save();
  ctx.globalAlpha = el.opacity ?? 1;
  const lw = minimapStrokeWidth(el, mapScale);

  switch (el.type) {
    case 'freehand': {
      const pts =
        el.smoothPoints && el.smoothPoints.length >= 2 ? el.smoothPoints : el.points;
      if (!pts || pts.length < 2) {
        ctx.restore();
        return;
      }
      ctx.strokeStyle = strokePaint(el);
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i += 1) {
        ctx.lineTo(pts[i][0], pts[i][1]);
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    case 'rect': {
      const fill = fillPaint(el.fillColor, 0.22);
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokePaint(el);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(el.x, el.y, el.width, el.height);
      }
      ctx.strokeRect(el.x, el.y, el.width, el.height);
      ctx.restore();
      return;
    }

    case 'circle': {
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      const rx = Math.abs(el.width / 2);
      const ry = Math.abs(el.height / 2);
      ctx.lineWidth = lw;
      ctx.strokeStyle = strokePaint(el);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      const fill = fillPaint(el.fillColor, 0.22);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      ctx.stroke();
      ctx.restore();
      return;
    }

    case 'line': {
      ctx.strokeStyle = strokePaint(el);
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(el.x, el.y);
      ctx.lineTo(el.x + el.width, el.y + el.height);
      ctx.stroke();
      ctx.restore();
      return;
    }

    case 'arrow': {
      const startX = el.x;
      const startY = el.y;
      const endX = el.x + el.width;
      const endY = el.y + el.height;
      ctx.strokeStyle = strokePaint(el);
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      const angle = Math.atan2(endY - startY, endX - startX);
      const headLen = Math.max(el.strokeWidth ?? 2, lw) * 5;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 6),
        endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 6),
        endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
      ctx.restore();
      return;
    }

    case 'text': {
      const text = String(el.content ?? '').trim();
      const b = getElementBounds(el);
      ctx.strokeStyle = strokePaint(el);
      ctx.lineWidth = Math.max(1, lw * 0.65);
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(b.x, b.y, Math.max(b.width, 10), Math.max(b.height, 10));
      ctx.setLineDash([]);
      if (text && text !== 'New Text') {
        const fs = Math.max((el.fontSize ?? 16) * 0.42, 6);
        ctx.fillStyle = strokePaint(el);
        const style = el.fontStyle || 'normal';
        const weight = el.fontWeight ?? '400';
        ctx.font = `${style} ${weight} ${fs}px Inter, system-ui, sans-serif`;
        ctx.textBaseline = 'top';
        const preview = text.length > 40 ? `${text.slice(0, 38)}…` : text;
        const line = preview.split('\n')[0];
        ctx.fillText(line, b.x + 2, b.y + 2);
      }
      ctx.restore();
      return;
    }

    case 'sticky': {
      const w = el.width ?? 200;
      const h = el.height ?? 150;
      const note = el.noteColor || '#FFF176';
      const fill = fillPaint(note, 0.45);
      ctx.lineWidth = Math.max(lw * 0.85, minimapStrokeWidth(el, mapScale) * 0.5);
      if (fill) ctx.fillStyle = fill;
      ctx.strokeStyle = 'rgba(50,52,72,0.75)';
      if (fill) ctx.fillRect(el.x, el.y, w, h);
      ctx.strokeRect(el.x, el.y, w, h);
      ctx.restore();
      return;
    }

    default: {
      const b = getElementBounds(el);
      if (b.width <= 0 && b.height <= 0) {
        ctx.restore();
        return;
      }
      ctx.strokeStyle = 'rgba(91,106,240,0.55)';
      ctx.lineWidth = Math.max(1, lw * 0.55);
      ctx.strokeRect(b.x, b.y, Math.max(b.width, 2), Math.max(b.height, 2));
      ctx.restore();
    }
  }
}
