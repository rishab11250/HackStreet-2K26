/**
 * Utility functions for hit testing and bounding box calculations
 */

export const getElementBounds = (el) => {
  if (el.type === 'freehand') {
    const points = el.points;
    if (!points.length) return { x: el.x, y: el.y, width: 0, height: 0 };
    
    let minX = points[0][0];
    let maxX = points[0][0];
    let minY = points[0][1];
    let maxY = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
      minX = Math.min(minX, points[i][0]);
      maxX = Math.max(maxX, points[i][0]);
      minY = Math.min(minY, points[i][1]);
      maxY = Math.max(maxY, points[i][1]);
    }
    
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  // For shapes, text, sticky notes
  const minX = Math.min(el.x, el.x + (el.width || 0));
  const maxX = Math.max(el.x, el.x + (el.width || 0));
  const minY = Math.min(el.y, el.y + (el.height || 0));
  const maxY = Math.max(el.y, el.y + (el.height || 0));
  
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};

export const isPointInElement = (x, y, el) => {
  const bounds = getElementBounds(el);
  const padding = 5; // Extra padding for easier selection
  
  if (el.type === 'freehand') {
    // Check if point is near any line segment of the freehand path
    const points = el.points;
    for (let i = 0; i < points.length - 1; i++) {
      const dist = distToSegment([x, y], points[i], points[i + 1]);
      if (dist < padding + (el.strokeWidth || 2)) return true;
    }
    return false;
  }
  
  // Standard bounding box check for other elements
  return (
    x >= bounds.x - padding &&
    x <= bounds.x + bounds.width + padding &&
    y >= bounds.y - padding &&
    y <= bounds.y + bounds.height + padding
  );
};

export const isElementInBox = (el, boxX, boxY, boxWidth, boxHeight) => {
  const bounds = getElementBounds(el);
  
  // Normalized box coordinates
  const minBoxX = Math.min(boxX, boxX + boxWidth);
  const maxBoxX = Math.max(boxX, boxX + boxWidth);
  const minBoxY = Math.min(boxY, boxY + boxHeight);
  const maxBoxY = Math.max(boxY, boxY + boxHeight);
  
  return (
    bounds.x >= minBoxX &&
    bounds.x + bounds.width <= maxBoxX &&
    bounds.y >= minBoxY &&
    bounds.y + bounds.height <= maxBoxY
  );
};

// Helper: Distance from point to line segment
function distToSegment(p, v, w) {
  const l2 = distSq(v, w);
  if (l2 === 0) return Math.sqrt(distSq(p, v));
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.sqrt(distSq(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]));
}

function distSq(v, w) {
  return (v[0] - w[0]) ** 2 + (v[1] - w[1]) ** 2;
}

export const getContentBoundingBox = (elements) => {
  if (elements.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    const bounds = getElementBounds(el);
    minX = Math.min(minX, bounds.x);
    minY = Math.min(minY, bounds.y);
    maxX = Math.max(maxX, bounds.x + bounds.width);
    maxY = Math.max(maxY, bounds.y + bounds.height);
  });

  return {
    x: minX - 20, // Padding
    y: minY - 20,
    width: maxX - minX + 40,
    height: maxY - minY + 40,
  };
};
