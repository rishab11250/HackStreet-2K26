/**
 * Pure JS renderer that draws elements onto the canvas context
 */
export const renderAll = (ctx, elements, viewport) => {
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

  // Render elements
  elements.forEach((el) => {
    drawElement(ctx, el);
  });

  ctx.restore();
};

const drawElement = (ctx, el) => {
  // To be implemented in Hour 2
  // For now, this is a placeholder
  switch (el.type) {
    case 'freehand':
      // drawFreehand(ctx, el);
      break;
    case 'rect':
    case 'circle':
    case 'line':
    case 'arrow':
      // drawShape(ctx, el);
      break;
    case 'text':
      // drawText(ctx, el);
      break;
    default:
      break;
  }
};
