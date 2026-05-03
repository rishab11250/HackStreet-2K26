import { jsPDF } from 'jspdf';
import { getContentBoundingBox } from './geometry';
import { renderAll } from '../canvas/CanvasRenderer';

export const exportCanvas = async (format, elements, options) => {
  const { includeBackground, cropToContent } = options;

  // 1. Calculate bounding box
  const bbox = cropToContent
    ? getContentBoundingBox(elements)
    : { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

  // 2. Create off-screen canvas
  const offscreen = document.createElement('canvas');
  const dpr = 2; // Higher quality export
  offscreen.width = bbox.width * dpr;
  offscreen.height = bbox.height * dpr;
  const ctx = offscreen.getContext('2d');
  ctx.scale(dpr, dpr);

  // 3. Draw background
  if (includeBackground) {
    ctx.fillStyle = '#F8F9FB';
    ctx.fillRect(0, 0, bbox.width, bbox.height);
    
    // Draw subtle dot grid for export if needed
    ctx.fillStyle = '#DDE1EA';
    const gridSize = 20;
    for (let x = 0; x < bbox.width; x += gridSize) {
      for (let y = 0; y < bbox.height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 4. Translate to crop origin and render
  ctx.save();
  ctx.translate(-bbox.x, -bbox.y);
  
  // Render all elements (excluding stickies which are DOM-based)
  // Note: For a true production export, we'd need to manually render stickies onto this canvas
  renderAll(ctx, elements.filter(el => el.type !== 'sticky'), { x: 0, y: 0, zoom: 1 });
  
  // Manually render sticky notes for export
  elements.filter(el => el.type === 'sticky').forEach(sticky => {
    ctx.save();
    ctx.translate(sticky.x, sticky.y);
    
    // Draw sticky background
    ctx.fillStyle = sticky.noteColor || '#FFF176';
    ctx.shadowColor = 'rgba(0,0,0,0.12)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillRect(0, 0, sticky.width, sticky.height);
    
    // Draw sticky content
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#1A1B2E';
    ctx.font = '13px Inter, sans-serif';
    ctx.textBaseline = 'top';
    const padding = 10;
    const lines = (sticky.content || '').split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * 16);
    });
    
    ctx.restore();
  });

  ctx.restore();

  // 5. Trigger download
  if (format === 'png') {
    const dataUrl = offscreen.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `collabboard-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } else if (format === 'pdf') {
    const dataUrl = offscreen.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: bbox.width > bbox.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [bbox.width, bbox.height]
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, bbox.width, bbox.height);
    pdf.save(`collabboard-${Date.now()}.pdf`);
  }
};
