/**
 * Smooths a path of points using Catmull-Rom to Bézier conversion
 * or simple midpoint smoothing. Midpoint smoothing is more performant
 * for live drawing.
 */
export const smoothPath = (points) => {
  if (points.length < 3) return points;

  const smoothed = [];
  smoothed.push(points[0]);

  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Midpoint between current point and next point
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    
    smoothed.push([mx, my]);
  }

  smoothed.push(points[points.length - 1]);
  return smoothed;
};
