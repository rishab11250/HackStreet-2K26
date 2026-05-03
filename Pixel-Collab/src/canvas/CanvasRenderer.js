/**
 * Pure JS renderer that draws elements onto the canvas context
 */
export const renderAll = (ctx, elements, viewport, liveElement = null) => {
  if (!ctx) return;

  const { x, y, zoom } = viewport;

  // Clear canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();

  ctx.save();
  
  // Apply viewport transform
  ctx.translate(x, y);
  ctx.scale(zoom, zoom);

  // Render elements from store (sorted by z-index if needed, but elements array is our order)
  elements.forEach((el) => {
    drawElement(ctx, el);
  });

  // Render live drawing element (preview)
  if (liveElement) {
    drawElement(ctx, liveElement);
  }

  ctx.restore();
};

const drawElement = (ctx, el) => {
  ctx.save();
  ctx.globalAlpha = el.opacity ?? 1;

  switch (el.type) {
    case 'freehand':
      drawFreehand(ctx, el);
      break;
    case 'rect':
      drawRect(ctx, el);
      break;
    case 'circle':
      drawCircle(ctx, el);
      break;
    case 'line':
      drawLine(ctx, el);
      break;
    case 'arrow':
      drawArrow(ctx, el);
      break;
    case 'text':
      drawText(ctx, el);
      break;
    default:
      break;
  }
  ctx.restore();
};

const drawFreehand = (ctx, el) => {
  const points = el.smoothPoints || el.points;
  if (!points || points.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.moveTo(points[0][0], points[0][1]);
  
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i][0] + points[i+1][0]) / 2;
    const my = (points[i][1] + points[i+1][1]) / 2;
    ctx.quadraticCurveTo(points[i][0], points[i][1], mx, my);
  }
  
  if (points.length > 2) {
    const last = points[points.length - 1];
    ctx.lineTo(last[0], last[1]);
  }
  
  ctx.stroke();
};

const drawRect = (ctx, el) => {
  ctx.strokeStyle = el.strokeColor;
  ctx.fillStyle = el.fillColor;
  ctx.lineWidth = el.strokeWidth;

  if (el.fillColor !== 'transparent') {
    ctx.fillRect(el.x, el.y, el.width, el.height);
  }
  ctx.strokeRect(el.x, el.y, el.width, el.height);
};

const drawCircle = (ctx, el) => {
  ctx.strokeStyle = el.strokeColor;
  ctx.fillStyle = el.fillColor;
  ctx.lineWidth = el.strokeWidth;

  const centerX = el.x + el.width / 2;
  const centerY = el.y + el.height / 2;
  const radiusX = Math.abs(el.width / 2);
  const radiusY = Math.abs(el.height / 2);

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  
  if (el.fillColor !== 'transparent') {
    ctx.fill();
  }
  ctx.stroke();
};

const drawLine = (ctx, el) => {
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(el.x, el.y);
  ctx.lineTo(el.x + el.width, el.y + el.height);
  ctx.stroke();
};

const drawArrow = (ctx, el) => {
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const startX = el.x;
  const startY = el.y;
  const endX = el.x + el.width;
  const endY = el.y + el.height;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = el.strokeWidth * 6;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};

const drawText = (ctx, el) => {
  // Only render real user content (no placeholder strings on canvas)
  const text = String(el.content ?? '').trim();
  if (!text) return;
  
  ctx.fillStyle = el.strokeColor;
  const style = el.fontStyle || 'normal';
  const weight = el.fontWeight ?? '400';
  ctx.font = `${style} ${weight} ${el.fontSize}px Inter, sans-serif`;
  ctx.textBaseline = 'top';
  
  const lines = String(el.content).split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, el.x, el.y + i * el.fontSize * 1.2);
  });
};
