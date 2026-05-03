export const PanTool = {
  onMouseDown: (e, { viewport }) => {
    return {
      type: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      initialViewportX: viewport.x,
      initialViewportY: viewport.y
    };
  },

  onMouseMove: (e, { setViewport, viewport, state }) => {
    if (!state || state.type !== 'pan') return state;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    setViewport({
      ...viewport,
      x: state.initialViewportX + dx,
      y: state.initialViewportY + dy
    });

    return state;
  },

  onMouseUp: () => {
    return null;
  }
};
