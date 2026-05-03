import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { TOOLS, SHAPES } from './constants';
import { clampGridSize } from '../utils/snap';
import {
  loadStoredMembers,
  saveMembersToStorage,
  loadThemePreference,
  saveThemePreference,
  loadGridSnapSize,
  saveGridSnapSize,
  loadPresentationFlag,
  savePresentationFlag,
} from '../utils/workspaceStorage';

const defaultMembersSeed = () => [
  { id: 'u1', name: 'Alex', email: 'alex@demo.io', role: 'owner', color: '#F05B5B', initials: 'AL', online: true },
  { id: 'u2', name: 'Sara', email: 'sara@demo.io', role: 'editor', color: '#5BF0A0', initials: 'SA', online: true },
  { id: 'u3', name: 'Dev', email: 'dev@demo.io', role: 'viewer', color: '#F0D25B', initials: 'DV', online: true },
];

function activityFromState(state, action, extra = {}) {
  const member = state.workspaceMembers.find((m) => m.id === state.currentUserId);
  return {
    id: nanoid(10),
    userId: state.currentUserId,
    userName: member?.name ?? 'You',
    userColor: member?.color ?? '#5B6AF0',
    action,
    timestamp: Date.now(),
    ...extra,
  };
}

const storedMembers = loadStoredMembers();
const workspaceMembers =
  Array.isArray(storedMembers) && storedMembers.length > 0 ? storedMembers : defaultMembersSeed();

const useStore = create((set, get) => ({
  // ELEMENTS
  elements: [],
  selectedIds: [],

  setElements: (elements) => set({ elements }),

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      activityLog: [
        activityFromState(state, `created ${element.type} on the board`, { kind: 'create', elementType: element.type }),
        ...state.activityLog,
      ].slice(0, 60),
    })),

  updateElement: (id, changes) =>
    set((state) => ({
      elements: state.elements.map((el) => (el.id === id ? { ...el, ...changes } : el)),
    })),

  deleteElements: (ids) =>
    set((state) => {
      if (!ids.length) return state;
      const labels = ids
        .map((id) => state.elements.find((e) => e.id === id)?.type)
        .filter(Boolean);
      const summary =
        labels.length === 1 ? `deleted ${labels[0]}` : `deleted ${ids.length} elements`;
      return {
        elements: state.elements.filter((el) => !ids.includes(el.id)),
        selectedIds: state.selectedIds.filter((id) => !ids.includes(id)),
        activityLog: [activityFromState(state, summary, { kind: 'delete', count: ids.length }), ...state.activityLog].slice(
          0,
          60
        ),
      };
    }),

  duplicateElements: (ids) =>
    set((state) => {
      if (ids.length === 0) return state;
      const newElements = [];
      const newSelectedIds = [];

      ids.forEach((id) => {
        const el = state.elements.find((e) => e.id === id);
        if (el) {
          const newId = Math.random().toString(36).substr(2, 9);
          const duplicated = {
            ...JSON.parse(JSON.stringify(el)),
            id: newId,
            x: el.x + 20,
            y: el.y + 20,
            zIndex: Date.now(),
            createdAt: Date.now(),
          };
          newElements.push(duplicated);
          newSelectedIds.push(newId);
        }
      });

      return {
        elements: [...state.elements, ...newElements],
        selectedIds: newSelectedIds,
        activityLog: [
          activityFromState(state, `duplicated ${ids.length} element(s)`, { kind: 'duplicate' }),
          ...state.activityLog,
        ].slice(0, 60),
      };
    }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  selectAll: () => set((state) => ({ selectedIds: state.elements.map((el) => el.id) })),
  clearSelection: () => set({ selectedIds: [] }),

  bringForward: (ids) =>
    set((state) => {
      const newElements = [...state.elements];
      ids.forEach((id) => {
        const idx = newElements.findIndex((el) => el.id === id);
        if (idx !== -1 && idx < newElements.length - 1) {
          [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
        }
      });
      return { elements: newElements };
    }),

  sendBackward: (ids) =>
    set((state) => {
      const newElements = [...state.elements];
      ids.forEach((id) => {
        const idx = newElements.findIndex((el) => el.id === id);
        if (idx > 0) {
          [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
        }
      });
      return { elements: newElements };
    }),

  bringToFront: (ids) =>
    set((state) => {
      const selected = state.elements.filter((el) => ids.includes(el.id));
      const unselected = state.elements.filter((el) => !ids.includes(el.id));
      return { elements: [...unselected, ...selected] };
    }),

  sendToBack: (ids) =>
    set((state) => {
      const selected = state.elements.filter((el) => ids.includes(el.id));
      const unselected = state.elements.filter((el) => !ids.includes(el.id));
      return { elements: [...selected, ...unselected] };
    }),

  toggleLockSelected: () =>
    set((state) => {
      const ids = state.selectedIds;
      if (!ids.length) return state;
      const touched = ids.map((id) => state.elements.find((e) => e.id === id)).filter(Boolean);
      const allLocked = touched.length && touched.every((e) => e.locked);
      const nextLocked = !allLocked;
      return {
        elements: state.elements.map((el) =>
          ids.includes(el.id) ? { ...el, locked: nextLocked } : el
        ),
        activityLog: [
          activityFromState(
            state,
            nextLocked ? `locked ${ids.length} element(s)` : `unlocked ${ids.length} element(s)`,
            { kind: 'lock' }
          ),
          ...state.activityLog,
        ].slice(0, 60),
      };
    }),

  logActivity: (action, extra = {}) =>
    set((state) => ({
      activityLog: [activityFromState(state, action, extra), ...state.activityLog].slice(0, 60),
    })),

  // ACTIVE TOOL
  activeTool: TOOLS.SELECT,
  setActiveTool: (tool) => set({ activeTool: tool }),

  activeShape: SHAPES.RECT,
  setActiveShape: (shape) => set({ activeShape: shape }),

  // STYLE OPTIONS
  strokeColor: '#1A1B2E',
  fillColor: 'transparent',
  strokeWidth: 2,
  eraserSize: 20,
  opacity: 1,
  fontSize: 16,
  fontWeight: '400',
  fontStyle: 'normal',
  recentColors: [],

  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (w) => set({ strokeWidth: w }),
  setEraserSize: (s) => set({ eraserSize: s }),
  setOpacity: (o) => set({ opacity: o }),
  setFontSize: (s) => set({ fontSize: s }),
  setFontWeight: (w) => set({ fontWeight: w }),
  setFontStyle: (s) => set({ fontStyle: s }),
  addRecentColor: (color) =>
    set((state) => ({
      recentColors: [color, ...state.recentColors.filter((c) => c !== color)].slice(0, 5),
    })),

  // GRID / SNAP
  snapToGrid: true,
  gridSnapSize: clampGridSize(loadGridSnapSize() ?? 20),
  setSnapToGrid: (v) => set({ snapToGrid: !!v }),
  setGridSnapSize: (n) => {
    const g = clampGridSize(n);
    saveGridSnapSize(g);
    set({ gridSnapSize: g });
  },

  // VIEWPORT
  viewport: { x: 0, y: 0, zoom: 1 },
  setViewport: (vp) => set({ viewport: vp }),

  zoomIn: () =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.min(state.viewport.zoom * 1.1, 4) },
    })),

  zoomOut: () =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.max(state.viewport.zoom * 0.9, 0.1) },
    })),

  resetZoom: () =>
    set((state) => ({
      viewport: { ...state.viewport, zoom: 1 },
    })),

  fitToScreen: () =>
    set(() => ({
      viewport: { x: 0, y: 0, zoom: 1 },
    })),

  // HISTORY
  history: [],
  future: [],

  pushHistory: () => {
    const { elements } = get();
    set((state) => ({
      history: [...state.history.slice(-49), JSON.parse(JSON.stringify(elements))],
      future: [],
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
      selectedIds: [],
    });
    get().logActivity('undid last change', { kind: 'history' });
  },

  redo: () => {
    const { history, elements, future } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      elements: next,
      history: [...history.slice(-49), JSON.parse(JSON.stringify(elements))],
      future: future.slice(1),
      selectedIds: [],
    });
    get().logActivity('redid change', { kind: 'history' });
  },

  // UI STATE
  isExportModalOpen: false,
  isEditingText: false,
  editingElementId: null,
  showGrid: true,
  showActivityFeed: true,
  presentationMode: loadPresentationFlag(),
  themeMode: loadThemePreference() || 'system',

  setExportModalOpen: (v) => set({ isExportModalOpen: v }),
  setIsEditingText: (v, id = null) => set({ isEditingText: v, editingElementId: id }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleActivityFeed: () => set((state) => ({ showActivityFeed: !state.showActivityFeed })),

  setPresentationMode: (v) => {
    savePresentationFlag(!!v);
    set({ presentationMode: !!v });
  },
  togglePresentationMode: () => {
    const next = !get().presentationMode;
    savePresentationFlag(next);
    set({ presentationMode: next });
  },

  setThemeMode: (mode) => {
    saveThemePreference(mode);
    set({ themeMode: mode });
  },

  // WORKSPACE / MEMBERS (mockUsers replaced for UI; cursors still use member colors)
  currentUserId: workspaceMembers[0]?.id ?? 'u1',
  workspaceMembers,
  setCurrentUserId: (id) => set({ currentUserId: id }),

  setWorkspaceMembers: (members) => {
    saveMembersToStorage(members);
    set({ workspaceMembers: members });
  },

  addWorkspaceMember: (member) =>
    set((state) => {
      const next = [...state.workspaceMembers, member];
      saveMembersToStorage(next);
      return {
        workspaceMembers: next,
        activityLog: [
          activityFromState(state, `invited ${member.name} (${member.role})`, { kind: 'member' }),
          ...state.activityLog,
        ].slice(0, 60),
      };
    }),

  updateWorkspaceMemberRole: (memberId, role) =>
    set((state) => {
      const next = state.workspaceMembers.map((m) => (m.id === memberId ? { ...m, role } : m));
      saveMembersToStorage(next);
      return {
        workspaceMembers: next,
        activityLog: [
          activityFromState(state, `updated member role to ${role}`, { kind: 'member', memberId }),
          ...state.activityLog,
        ].slice(0, 60),
      };
    }),

  removeWorkspaceMember: (memberId) =>
    set((state) => {
      if (memberId === state.currentUserId) return state;
      const next = state.workspaceMembers.filter((m) => m.id !== memberId);
      saveMembersToStorage(next);
      return {
        workspaceMembers: next,
        activityLog: [
          activityFromState(state, `removed a member from the workspace`, { kind: 'member' }),
          ...state.activityLog,
        ].slice(0, 60),
      };
    }),

  // Legacy mock cursor users — keep for MockCursors demo positions
  mockUsers: [
    { id: 'u1', name: 'Alex', color: '#F05B5B', initials: 'AL', cursor: { x: 300, y: 200 } },
    { id: 'u2', name: 'Sara', color: '#5BF0A0', initials: 'SA', cursor: { x: 600, y: 400 } },
    { id: 'u3', name: 'Dev', color: '#F0D25B', initials: 'DV', cursor: { x: 900, y: 300 } },
  ],
  updateMockCursor: (userId, pos) =>
    set((state) => ({
      mockUsers: state.mockUsers.map((u) => (u.id === userId ? { ...u, cursor: pos } : u)),
    })),

  activityLog: [],
  addActivityEvent: (event) =>
    set((state) => ({
      activityLog: [{ ...event, id: event.id || nanoid(10) }, ...state.activityLog].slice(0, 60),
    })),
}));

export default useStore;
