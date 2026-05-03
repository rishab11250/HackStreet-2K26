/**
 * Snap a world-space coordinate to the nearest grid step.
 * @param {number} value
 * @param {number} gridSize - pixel step (e.g. 20)
 * @returns {number}
 */
export function snapScalar(value, gridSize) {
  if (!gridSize || gridSize <= 0 || !Number.isFinite(value)) return value;
  return Math.round(value / gridSize) * gridSize;
}

/**
 * @param {{ x: number, y: number }} point
 * @param {number} gridSize
 * @returns {{ x: number, y: number }}
 */
export function snapPoint(point, gridSize) {
  return {
    x: snapScalar(point.x, gridSize),
    y: snapScalar(point.y, gridSize),
  };
}

/**
 * Clamp grid size to allowed UI range.
 * @param {number} n
 * @returns {number}
 */
export function clampGridSize(n) {
  return Math.min(100, Math.max(10, Math.round(n)));
}
