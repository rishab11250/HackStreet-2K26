export const EraserTool = {
  onMouseDown: () => {
    // pushHistory(); // Only push history once per erase path
    return { isErasing: true, erasedIds: new Set() };
  },

  onMouseMove: (e, { toCanvas, elements, deleteElements, state }) => {
    if (!state?.isErasing) return state;

    const { x, y } = toCanvas(e.clientX, e.clientY);
    const ERASE_RADIUS = 10;

    const hitIds = elements
      .filter(el => !state.erasedIds.has(el.id))
      .filter(el => {
        // Simple bounding box hit test for now
        // A more advanced one would check path proximity for freehand
        const minX = Math.min(el.x, el.x + (el.width || 0));
        const maxX = Math.max(el.x, el.x + (el.width || 0));
        const minY = Math.min(el.y, el.y + (el.height || 0));
        const maxY = Math.max(el.y, el.y + (el.height || 0));

        // For freehand, we should check points
        if (el.type === 'freehand') {
          return el.points.some(p => {
            const dx = p[0] - x;
            const dy = p[1] - y;
            return Math.sqrt(dx * dx + dy * dy) < ERASE_RADIUS;
          });
        }

        // For shapes/text/sticky
        return (
          x >= minX - ERASE_RADIUS &&
          x <= maxX + ERASE_RADIUS &&
          y >= minY - ERASE_RADIUS &&
          y <= maxY + ERASE_RADIUS
        );
      })
      .map(el => el.id);

    if (hitIds.length > 0) {
      deleteElements(hitIds);
      hitIds.forEach(id => state.erasedIds.add(id));
    }

    return state;
  },

  onMouseUp: (state, { pushHistory }) => {
    if (state?.erasedIds?.size > 0) {
      pushHistory();
    }
    return null;
  }
};
