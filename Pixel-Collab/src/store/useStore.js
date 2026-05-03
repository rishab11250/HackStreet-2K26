import { create } from 'zustand';
import { TOOLS, SHAPES } from './constants';

const useStore = create((set, get) => ({
  // ELEMENTS
  elements: [],
  selectedIds: [],

  addElement: (element) => set((state) => ({
    elements: [...state.elements, element]
  })),

  updateElement: (id, changes) => set((state) => ({
    elements: state.elements.map((el) => el.id === id ? { ...el, ...changes } : el)
  })),

  deleteElements: (ids) => set((state) => ({
    elements: state.elements.filter((el) => !ids.includes(el.id)),
    selectedIds: state.selectedIds.filter((id) => !ids.includes(id))
  })),

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  bringForward: (ids) => set((state) => {
    const newElements = [...state.elements];
    ids.forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx !== -1 && idx < newElements.length - 1) {
        [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      }
    });
    return { elements: newElements };
  }),

  sendBackward: (ids) => set((state) => {
    const newElements = [...state.elements];
    ids.forEach(id => {
      const idx = newElements.findIndex(el => el.id === id);
      if (idx > 0) {
        [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      }
    });
    return { elements: newElements };
  }),

  bringToFront: (ids) => set((state) => {
    const selected = state.elements.filter(el => ids.includes(el.id));
    const unselected = state.elements.filter(el => !ids.includes(el.id));
    return { elements: [...unselected, ...selected] };
  }),

  sendToBack: (ids) => set((state) => {
    const selected = state.elements.filter(el => ids.includes(el.id));
    const unselected = state.elements.filter(el => !ids.includes(el.id));
    return { elements: [...selected, ...unselected] };
  }),


  // ACTIVE TOOL
  activeTool: TOOLS.SELECT,
  setActiveTool: (tool) => set({ activeTool: tool }),

  activeShape: SHAPES.RECT,
  setActiveShape: (shape) => set({ activeShape: shape }),

  // STYLE OPTIONS
  strokeColor: '#1A1B2E',
  fillColor: 'transparent',
  strokeWidth: 2,
  opacity: 1,
  fontSize: 16,
  fontWeight: '400',
  recentColors: [],

  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),
  setOpacity: (o) => set({ opacity: o }),
  setFontSize: (s) => set({ fontSize: s }),
  addRecentColor: (color) => set((state) => ({
    recentColors: [color, ...state.recentColors.filter(c => c !== color)].slice(0, 5)
  })),

  // VIEWPORT
  viewport: { x: 0, y: 0, zoom: 1 },
  setViewport: (vp) => set({ viewport: vp }),
  
  zoomIn: () => set((state) => ({
    viewport: { ...state.viewport, zoom: Math.min(state.viewport.zoom * 1.1, 4) }
  })),
  
  zoomOut: () => set((state) => ({
    viewport: { ...state.viewport, zoom: Math.max(state.viewport.zoom * 0.9, 0.1) }
  })),
  
  resetZoom: () => set((state) => ({
    viewport: { ...state.viewport, zoom: 1 }
  })),

  // HISTORY
  history: [],
  future: [],

  pushHistory: () => {
    const { elements } = get();
    set((state) => ({
      history: [...state.history.slice(-49), JSON.parse(JSON.stringify(elements))],
      future: []
    }));
  },

  undo: () => {
    const { history, elements, future } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set({
      elements: prev,
      history: history.slice(0, -1),
      future: [JSON.parse(JSON.stringify(elements)), ...future.slice(0, 49)],
      selectedIds: []
    });
  },

  redo: () => {
    const { history, elements, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      elements: next,
      history: [...history.slice(-49), JSON.parse(JSON.stringify(elements))],
      future: future.slice(1),
      selectedIds: []
    });
  },

  // UI STATE
  isExportModalOpen: false,
  isEditingText: false,
  editingElementId: null,
  showGrid: true,
  showActivityFeed: true,

  setExportModalOpen: (v) => set({ isExportModalOpen: v }),
  setIsEditingText: (v, id = null) => set({ isEditingText: v, editingElementId: id }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleActivityFeed: () => set((state) => ({ showActivityFeed: !state.showActivityFeed })),

  // MOCK COLLABORATION
  mockUsers: [
    { id: 'u1', name: 'Alex', color: '#F05B5B', initials: 'AL', cursor: { x: 300, y: 200 } },
    { id: 'u2', name: 'Sara', color: '#5BF0A0', initials: 'SA', cursor: { x: 600, y: 400 } },
    { id: 'u3', name: 'Dev',  color: '#F0D25B', initials: 'DV', cursor: { x: 900, y: 300 } },
  ],
  updateMockCursor: (userId, pos) => set((state) => ({
    mockUsers: state.mockUsers.map(u => u.id === userId ? { ...u, cursor: pos } : u)
  })),
  activityLog: [],
  addActivityEvent: (event) => set((state) => ({
    activityLog: [{ ...event, id: Math.random().toString(36).substr(2, 9) }, ...state.activityLog].slice(0, 20)
  })),
}));

export default useStore;
