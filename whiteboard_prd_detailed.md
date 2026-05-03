# Product Requirements Document
## CollabBoard — Collaborative Whiteboard Application
**Version:** 2.0 | **Date:** May 3, 2026 | **Timeline:** 5 Hours | **Team:** 2 Members

---

## TABLE OF CONTENTS
1. Product Overview
2. Design System & Color Scheme
3. Full Folder Structure
4. State Architecture
5. Component Specifications
6. Feature Specifications
7. Step-by-Step Member Workplan
8. Integration Contracts
9. Tech Stack & Dependencies
10. Keyboard Shortcuts
11. Export Specification
12. Mock Collaboration Spec
13. Risk Register
14. Definition of Done

---

## 1. PRODUCT OVERVIEW

### 1.1 What We Are Building
A fully frontend-only collaborative whiteboard that feels alive. Users can draw, drop shapes, write text, pin sticky notes, move things around, zoom in/out, undo mistakes, and export the board — all while seeing simulated collaborator cursors and activity. No backend. No auth. Pure frontend state magic.

### 1.2 Core Value Props
- Zero-lag canvas interactions
- Feels like a real multi-user tool (via mock simulation)
- Works entirely in the browser, no install
- Exports a clean PNG or PDF of the board

### 1.3 Non-Goals
- No real-time sync (WebSocket, Firebase, etc.)
- No user authentication
- No database or persistence beyond sessionStorage
- No mobile/touch support in this sprint

---

## 2. DESIGN SYSTEM & COLOR SCHEME

### 2.1 Brand Palette

```
Primary Brand:      #5B6AF0   (Indigo — active states, highlights)
Primary Hover:      #4757E8
Primary Light:      #EEF0FD   (light bg tints)

Accent:             #F0A05B   (Amber — sticky notes highlight, warning)
Success:            #4CAF7D   (Green — online indicators)
Danger:             #F05B5B   (Red — delete hover, error)

Canvas Background:  #F8F9FB   (near-white with cool tint)
Dot Grid Color:     #DDE1EA   (subtle dots on canvas)

Toolbar Background: #1E1F2E   (dark navy sidebar)
Toolbar Icon:       #8B8FA8   (muted icon default)
Toolbar Icon Active:#FFFFFF   (white when selected)
Toolbar Hover BG:   #2C2D42

Top Bar Background: #FFFFFF
Top Bar Border:     #E8EAF0
Top Bar Shadow:     0 1px 3px rgba(0,0,0,0.08)

Panel Background:   #FFFFFF
Panel Border:       #E8EAF0
Panel Shadow:       0 4px 16px rgba(0,0,0,0.10)

Text Primary:       #1A1B2E
Text Secondary:     #6B7080
Text Muted:         #A0A5B8
Text Inverse:       #FFFFFF
```

### 2.2 Sticky Note Colors

```
Yellow:   background #FFF176  border #F9A825
Green:    background #C8E6C9  border #388E3C
Blue:     background #BBDEFB  border #1976D2
Pink:     background #F8BBD0  border #C2185B
Orange:   background #FFE0B2  border #E64A19
Purple:   background #E1BEE7  border #7B1FA2
```

### 2.3 Mock User Cursor Colors
```
User 1 (Alex):   #F05B5B  (coral red)
User 2 (Sara):   #5BF0A0  (mint green)
User 3 (Dev):    #F0D25B  (gold)
```

### 2.4 Typography

```
Font Family:      'Inter', system-ui, sans-serif  (import from Google Fonts)
Font Sizes:
  xs:   11px
  sm:   12px
  base: 14px
  md:   16px
  lg:   18px
  xl:   20px
  2xl:  24px
  3xl:  30px

Font Weights:
  Regular:   400
  Medium:    500
  Semibold:  600
  Bold:      700

Line Heights:
  tight:   1.25
  normal:  1.5
  loose:   1.75
```

### 2.5 Spacing Scale
```
4px base unit:
  1  →  4px
  2  →  8px
  3  →  12px
  4  →  16px
  5  →  20px
  6  →  24px
  8  →  32px
  10 →  40px
  12 →  48px
```

### 2.6 Border Radius
```
sm:   4px   (small chips, tags)
md:   8px   (buttons, inputs)
lg:   12px  (panels, modals)
xl:   16px  (cards, sticky notes)
full: 9999px (avatars, pills)
```

### 2.7 Shadows
```
sm:   0 1px 3px rgba(0,0,0,0.08)
md:   0 4px 12px rgba(0,0,0,0.10)
lg:   0 8px 24px rgba(0,0,0,0.14)
xl:   0 16px 48px rgba(0,0,0,0.18)
sticky: 3px 3px 10px rgba(0,0,0,0.12)
```

### 2.8 Canvas Default Tool Colors
```
Default Stroke:   #1A1B2E
Default Fill:     transparent
Default Width:    2px
Selection Color:  #5B6AF0
Selection Fill:   rgba(91,106,240,0.08)
Handle Color:     #FFFFFF
Handle Border:    #5B6AF0
```

---

## 3. FULL FOLDER STRUCTURE

```
collabboard/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root layout, keyboard shortcut bindings
│   ├── index.css                   # @import "tailwindcss" + custom CSS vars
│   │
│   ├── store/
│   │   ├── useStore.js             # Main Zustand store (all global state)
│   │   ├── useHistory.js           # Undo/redo history hook
│   │   └── constants.js            # Tool names, default values, enums
│   │
│   ├── canvas/
│   │   ├── WhiteboardCanvas.jsx    # Main canvas component (renders all elements)
│   │   ├── CanvasRenderer.js       # Pure JS: draws elements onto canvas ctx
│   │   ├── SelectionOverlay.jsx    # SVG overlay: selection box + resize handles
│   │   ├── GridBackground.jsx      # Dot grid background layer
│   │   └── useCanvasEvents.js      # Mouse event handlers for canvas interactions
│   │
│   ├── tools/
│   │   ├── PencilTool.js           # Freehand draw logic
│   │   ├── ShapeTool.js            # Rect/circle/line/arrow draw logic
│   │   ├── TextTool.js             # Text placement + inline editing
│   │   ├── StickyNoteTool.js       # Sticky note creation logic
│   │   ├── SelectTool.js           # Select, move, resize logic
│   │   ├── EraserTool.js           # Erase elements by contact
│   │   └── PanTool.js              # Canvas pan logic
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx       # Top bar + left toolbar + canvas + right panel
│   │   │   ├── TopBar.jsx          # Logo, avatars, zoom controls, export btn
│   │   │   └── RightPanel.jsx      # Activity feed, layer panel toggle
│   │   │
│   │   ├── toolbar/
│   │   │   ├── LeftToolbar.jsx     # Vertical tool sidebar
│   │   │   ├── ToolButton.jsx      # Single tool icon button (active state)
│   │   │   ├── ShapeDropdown.jsx   # Dropdown for shape sub-tools
│   │   │   └── BottomOptions.jsx   # Color picker, stroke width, opacity bar
│   │   │
│   │   ├── ui/
│   │   │   ├── ColorPicker.jsx     # Swatches + hex input + recent colors
│   │   │   ├── StrokeWidthPicker.jsx # Slider/presets for stroke size
│   │   │   ├── OpacitySlider.jsx   # Opacity 0–100%
│   │   │   ├── ZoomControls.jsx    # + / - / % display / fit-to-screen
│   │   │   ├── ExportModal.jsx     # Export PNG/PDF modal
│   │   │   ├── LayerControls.jsx   # z-order buttons
│   │   │   ├── Tooltip.jsx         # Generic tooltip wrapper
│   │   │   └── Modal.jsx           # Generic modal wrapper
│   │   │
│   │   ├── collaboration/
│   │   │   ├── MockCursors.jsx     # Renders 3 animated fake cursors
│   │   │   ├── AvatarRow.jsx       # Top bar collaborator avatars
│   │   │   ├── ActivityFeed.jsx    # Right panel: recent actions list
│   │   │   └── TypingIndicator.jsx # Animated dots on mock users
│   │   │
│   │   └── elements/
│   │       ├── StickyNote.jsx      # Editable sticky note DOM element
│   │       └── TextInput.jsx       # Inline text editing overlay
│   │
│   ├── utils/
│   │   ├── geometry.js             # Bounding box, hit testing, resize math
│   │   ├── smoothPath.js           # Bézier curve smoothing for freehand
│   │   ├── exportCanvas.js         # PNG + PDF export functions
│   │   ├── generateId.js           # nanoid wrapper for element IDs
│   │   └── mockActivity.js         # Fake activity event generator
│   │
│   └── hooks/
│       ├── useKeyboard.js          # Global keyboard shortcut handler
│       ├── useViewport.js          # Zoom + pan state and transforms
│       └── useMockCollaboration.js # Timer-based mock cursor movement
│
├── index.html
├── vite.config.js
└── package.json
```

---

## 4. STATE ARCHITECTURE

### 4.1 Main Store — `useStore.js` (Zustand)

```js
// Full shape of the Zustand store

const useStore = create((set, get) => ({

  // ─── ELEMENTS ─────────────────────────────────────────────
  elements: [],                   // Element[]
  selectedIds: [],                // string[]

  addElement: (element) => {},
  updateElement: (id, changes) => {},
  deleteElements: (ids) => {},
  duplicateElements: (ids) => {},
  setSelectedIds: (ids) => {},
  clearSelection: () => {},
  bringForward: (id) => {},
  sendBackward: (id) => {},
  bringToFront: (id) => {},
  sendToBack: (id) => {},

  // ─── ACTIVE TOOL ──────────────────────────────────────────
  activeTool: 'select',           // ToolType string
  setActiveTool: (tool) => {},

  // ─── ACTIVE SHAPE SUBTYPE ─────────────────────────────────
  activeShape: 'rect',            // 'rect' | 'circle' | 'line' | 'arrow'
  setActiveShape: (shape) => {},

  // ─── STYLE OPTIONS ────────────────────────────────────────
  strokeColor: '#1A1B2E',
  fillColor: 'transparent',
  strokeWidth: 2,
  opacity: 1,
  fontSize: 16,
  fontWeight: '400',
  recentColors: [],               // last 5 hex strings

  setStrokeColor: (color) => {},
  setFillColor: (color) => {},
  setStrokeWidth: (w) => {},
  setOpacity: (o) => {},
  setFontSize: (s) => {},
  addRecentColor: (color) => {},

  // ─── VIEWPORT ─────────────────────────────────────────────
  viewport: { x: 0, y: 0, zoom: 1 },
  setViewport: (vp) => {},
  zoomIn: () => {},
  zoomOut: () => {},
  resetZoom: () => {},
  fitToScreen: () => {},

  // ─── HISTORY (undo/redo) ──────────────────────────────────
  history: [],                    // Snapshot[]
  future: [],                     // Snapshot[]
  pushHistory: () => {},
  undo: () => {},
  redo: () => {},

  // ─── UI STATE ─────────────────────────────────────────────
  isExportModalOpen: false,
  isEditingText: false,
  editingElementId: null,
  showGrid: true,
  showActivityFeed: true,

  setExportModalOpen: (v) => {},
  setIsEditingText: (v, id) => {},
  toggleGrid: () => {},
  toggleActivityFeed: () => {},

  // ─── MOCK COLLABORATION ───────────────────────────────────
  mockUsers: [
    { id: 'u1', name: 'Alex', color: '#F05B5B', initials: 'AL', cursor: { x: 300, y: 200 } },
    { id: 'u2', name: 'Sara', color: '#5BF0A0', initials: 'SA', cursor: { x: 600, y: 400 } },
    { id: 'u3', name: 'Dev',  color: '#F0D25B', initials: 'DV', cursor: { x: 900, y: 300 } },
  ],
  updateMockCursor: (userId, pos) => {},
  activityLog: [],                // ActivityEvent[]
  addActivityEvent: (event) => {},

}))
```

### 4.2 Element Schema

```js
// Base element (all types share this)
{
  id: string,               // nanoid(8)
  type: ElementType,        // see below
  x: number,                // top-left x in canvas coords
  y: number,                // top-left y in canvas coords
  width: number,            // bounding box width
  height: number,           // bounding box height
  strokeColor: string,      // hex
  fillColor: string,        // hex or 'transparent'
  strokeWidth: number,      // px
  opacity: number,          // 0.0 – 1.0
  zIndex: number,           // layer order
  locked: boolean,          // if true, cannot be selected/moved
  createdAt: number,        // Date.now()
  createdBy: string,        // 'user' | 'u1' | 'u2' | 'u3'
}

// Freehand
{
  ...base,
  type: 'freehand',
  points: [[x,y], [x,y], ...],    // raw captured points
  smoothPoints: [[x,y], ...],     // bezier-smoothed points
}

// Shape
{
  ...base,
  type: 'rect' | 'circle' | 'line' | 'arrow',
  // For line/arrow: x,y = start point; width,height = end offset
  cornerRadius: number,           // for rect only, default 0
}

// Text
{
  ...base,
  type: 'text',
  content: string,
  fontSize: number,
  fontWeight: string,
  textAlign: 'left' | 'center' | 'right',
  color: string,                  // text color (uses strokeColor)
}

// Sticky Note
{
  ...base,
  type: 'sticky',
  content: string,
  noteColor: string,              // one of 6 sticky palette hex values
  width: 200,                     // fixed default
  height: 150,                    // fixed default
}
```

### 4.3 Viewport Transform

```js
// All canvas drawing uses this transform:
ctx.save()
ctx.translate(viewport.x, viewport.y)
ctx.scale(viewport.zoom, viewport.zoom)
// draw elements in canvas space
ctx.restore()

// Convert screen coords to canvas coords:
const toCanvas = (screenX, screenY) => ({
  x: (screenX - viewport.x) / viewport.zoom,
  y: (screenY - viewport.y) / viewport.zoom,
})

// Convert canvas coords to screen coords:
const toScreen = (canvasX, canvasY) => ({
  x: canvasX * viewport.zoom + viewport.x,
  y: canvasY * viewport.zoom + viewport.y,
})
```

### 4.4 History / Undo-Redo

```js
// Strategy: Full snapshot on every significant action
// Significant actions: add element, delete, move (on mouseup), resize (on mouseup),
//                      text edit (on confirm), style change

// pushHistory() called BEFORE making a change:
pushHistory: () => {
  const snapshot = JSON.parse(JSON.stringify(get().elements))
  set(state => ({
    history: [...state.history.slice(-49), snapshot],
    future: []
  }))
}

// undo():
undo: () => {
  const { history, elements, future } = get()
  if (!history.length) return
  const prev = history[history.length - 1]
  set({
    elements: prev,
    history: history.slice(0, -1),
    future: [JSON.parse(JSON.stringify(elements)), ...future.slice(0, 49)],
    selectedIds: []
  })
}

// redo():
redo: () => {
  const { future, elements, history } = get()
  if (!future.length) return
  const next = future[0]
  set({
    elements: next,
    history: [...history.slice(-49), JSON.parse(JSON.stringify(elements))],
    future: future.slice(1),
    selectedIds: []
  })
}
```

---

## 5. COMPONENT SPECIFICATIONS

### 5.1 AppLayout.jsx
```
Layout:
  - Full viewport (100vw × 100vh), overflow hidden
  - CSS Grid: [left toolbar 56px] [canvas flex-1] [right panel 0/280px toggle]
  - Top bar: position fixed, height 52px, z-index 50
  - Left toolbar: position fixed, top 52px, left 0, height calc(100vh - 52px), width 56px
  - Canvas area: margin-left 56px, margin-top 52px
  - Bottom options bar: position fixed, bottom 16px, left 50%, transform translateX(-50%)
    width fit-content, floating pill style
```

### 5.2 TopBar.jsx
```
Left section:
  - Logo: "CollabBoard" text with small icon, font-semibold, color #5B6AF0

Center section:
  - Nothing (reserved for future board title edit)

Right section (flex row, gap-3):
  - AvatarRow component (3 overlapping avatars)
  - Divider (1px vertical line, color #E8EAF0)
  - ZoomControls component
  - Divider
  - Share button (mock, just UI — grey outline button "Share")
  - Export button (filled #5B6AF0, "Export ↓")

Height: 52px
Background: #FFFFFF
Border-bottom: 1px solid #E8EAF0
Box-shadow: 0 1px 3px rgba(0,0,0,0.08)
Padding: 0 16px
```

### 5.3 LeftToolbar.jsx
```
Position: fixed left sidebar, 56px wide, dark bg #1E1F2E
Contains (top to bottom):
  [Tool Buttons - each 44×44px, centered]
  ───────────────────────────────
  ↖  Select      (shortcut: V)
  ✋  Pan         (shortcut: H or Space hold)
  ✏️  Pencil      (shortcut: P)
  ▭   Shape       (shortcut: S) → opens ShapeDropdown
  T   Text        (shortcut: T)
  📌  Sticky      (shortcut: N)
  ⬜  Eraser      (shortcut: E)
  ───────────────────────────────
  [Bottom of toolbar]
  🔲  Toggle Grid
  ❓  Help (tooltip shortcuts list)

Active state: bg #5B6AF0, icon white, border-radius 8px
Hover state: bg #2C2D42
Default: icon color #8B8FA8
Tooltip: appears to the right of each button on hover
```

### 5.4 BottomOptions.jsx (Floating Options Bar)
```
Position: fixed, bottom 16px, centered horizontally
Background: #FFFFFF
Border: 1px solid #E8EAF0
Border-radius: 12px
Box-shadow: 0 4px 16px rgba(0,0,0,0.12)
Padding: 8px 16px
Display: flex, align-items center, gap 12px

Contents (shown based on active tool):

[All tools except pan/select]:
  Stroke Color Dot → opens ColorPicker popover
  Fill Color Dot   → opens ColorPicker popover (hidden for pencil/text)
  | divider |
  Stroke Width     → StrokeWidthPicker (3 preset dots: thin/med/thick + slider)
  | divider |
  Opacity          → OpacitySlider (0–100%)

[Select tool, when element selected]:
  Stroke Color Dot
  Fill Color Dot
  | divider |
  Stroke Width
  | divider |
  Opacity
  | divider |
  LayerControls (↑ ↓ ⤒ ⤓ icons)
  | divider |
  🗑 Delete (red on hover)

[Text tool]:
  Text Color Dot
  | divider |
  Font Size dropdown (12/16/20/28/36)
  B (bold toggle)
  I (italic toggle)
```

### 5.5 ShapeDropdown.jsx
```
Appears above the Shape tool button on click
Background: #1E1F2E, border-radius 8px, padding 4px
Flex-col, gap 2px

Options (each 44×44px):
  ▭  Rectangle   → activeShape = 'rect'
  ○  Circle      → activeShape = 'circle'
  /  Line        → activeShape = 'line'
  →  Arrow       → activeShape = 'arrow'

Selected shape shown with #5B6AF0 background
Clicking a shape selects it AND closes dropdown
```

### 5.6 ColorPicker.jsx
```
Popover panel (appears above/below trigger):
  Background: #FFFFFF, border-radius 12px, shadow lg
  Width: 220px, padding 12px

Sections:
  1. Preset swatches (16 colors, 4×4 grid, each 24×24px circle):
     #000000 #1A1B2E #4A5568 #718096
     #F05B5B #F0A05B #F0D25B #5BF0A0
     #5B6AF0 #A05BF0 #F05BBF #5BBFF0
     #FFFFFF #F8F9FB #E8EAF0 transparent(⊘)

  2. Recent colors row (up to 5, 20×20px each)
     Label: "Recent" in text-xs text-muted

  3. Hex input:
     # prefix + 6-char input + color preview dot
     onChange updates in real-time

  4. Stroke / Fill tabs at top if triggered from bottom bar
```

### 5.7 AvatarRow.jsx
```
3 overlapping circular avatars (28px diameter)
Each overlaps previous by 8px (margin-left: -8px)
Avatar: bg = user.color, initials in white, font-size 10px font-bold
Green dot (8px) at bottom-right of each: bg #4CAF7D, border 2px white
Hover: shows tooltip with user name
```

### 5.8 ZoomControls.jsx
```
Flex row, gap 4px, align center

[-]  button (32×28px, border rounded-md)
[100%] percentage display, clickable → resets to 100%
[+]  button (32×28px, border rounded-md)
[⊡]  fit-to-screen icon button

Min zoom: 10%, Max zoom: 400%
Step: +/- 10% per click
Display format: "75%" / "100%" / "150%"
```

### 5.9 RightPanel.jsx
```
Width: 280px (slides in/out with CSS transition)
Background: #FFFFFF
Border-left: 1px solid #E8EAF0
Height: 100% (below top bar)
Padding: 12px

Sections:
  [Collaborators]
    Title "Online Now" — text-sm font-semibold
    List of 3 mock users:
      Avatar circle (24px) | Name | green dot
    Spacing: gap 8px between users

  [Divider]

  [Activity Feed]
    Title "Recent Activity" — text-sm font-semibold
    Scrollable list of ActivityEvent items
    Each item:
      Avatar circle (20px) | "{Name} {action}" | time ago
      e.g. "Alex added a sticky note · 2m ago"
    Max 20 items, newest first
    Auto-scrolls to top on new event
    Empty state: "No activity yet" text-muted centered

Toggle button: chevron icon on top bar right side
```

### 5.10 ExportModal.jsx
```
Modal overlay: rgba(0,0,0,0.4) backdrop
Modal card: 480px wide, border-radius 16px, bg white, padding 24px

Title: "Export Board"
Subtitle: "Download your whiteboard as an image or PDF"

Preview area: 
  240×135px (16:9 thumbnail)
  border-radius 8px, border 1px #E8EAF0
  Shows scaled-down canvas snapshot

Format selector (2 option cards side by side):
  [PNG Image]            [PDF Document]
  Selected: border #5B6AF0, bg #EEF0FD

Quality/Size note: "1920×1080px · ~2.4MB" (for PNG)

Options:
  ☑ Include background (checkbox)
  ☑ Crop to content     (checkbox)

Buttons:
  [Cancel] — ghost button
  [Download] — filled #5B6AF0

Close: X icon top-right
```

### 5.11 MockCursors.jsx
```
3 absolutely positioned cursor elements
Position: fixed, pointer-events none, z-index 999

Each cursor:
  - SVG cursor arrow icon (16×20px) in user.color
  - Name label: pill bg user.color, text white, 10px, padding 2px 6px
    appears to bottom-right of cursor point

Movement:
  - useMockCollaboration hook moves cursors every 800–1500ms
  - New target: random point within visible canvas area
  - CSS transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)
  - Occasionally pauses (30% chance) to simulate reading

Behavior:
  - Cursors stay within canvas area (not in toolbars)
  - Each cursor has independent interval timer
  - Interval ranges: u1=900ms, u2=1100ms, u3=1400ms
```

---

## 6. FEATURE SPECIFICATIONS

### 6.1 Freehand Pencil Tool

**Drawing:**
```
onMouseDown:
  - pushHistory()
  - Create new freehand element with first point
  - Set isDrawing = true

onMouseMove (while drawing):
  - Append point to element.points[]
  - Throttle to max 60 points/sec
  - Live-draw on canvas using lineTo

onMouseUp:
  - Run smoothPath(points) → Bézier curves
  - Store smoothPoints on element
  - Add element to store
  - isDrawing = false
```

**Rendering:**
```js
// In CanvasRenderer.js
function drawFreehand(ctx, el) {
  if (el.smoothPoints.length < 2) return
  ctx.beginPath()
  ctx.strokeStyle = el.strokeColor
  ctx.lineWidth = el.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = el.opacity
  ctx.moveTo(el.smoothPoints[0][0], el.smoothPoints[0][1])
  for (let i = 1; i < el.smoothPoints.length - 1; i++) {
    const mx = (el.smoothPoints[i][0] + el.smoothPoints[i+1][0]) / 2
    const my = (el.smoothPoints[i][1] + el.smoothPoints[i+1][1]) / 2
    ctx.quadraticCurveTo(el.smoothPoints[i][0], el.smoothPoints[i][1], mx, my)
  }
  ctx.stroke()
}
```

### 6.2 Shape Tools

**Rectangle:**
```
Draw: mousedown = origin, mousemove = resize, mouseup = confirm
Hold Shift: constrain to square
Hold Alt: draw from center
Render: ctx.roundRect() if cornerRadius > 0 else ctx.rect()
```

**Circle/Ellipse:**
```
Draw: mousedown = top-left of bounding box, mousemove = resize
Hold Shift: constrain to perfect circle
Render: ctx.ellipse()
```

**Line:**
```
Draw: mousedown = start point, mousemove = end point
Hold Shift: snap to 45° angles
Render: ctx.moveTo + ctx.lineTo
```

**Arrow:**
```
Same as line + draw arrowhead at end
Arrowhead: two lines at 30° angles, length = strokeWidth * 4
```

### 6.3 Text Tool

```
onClick on canvas:
  - Create text element at click position
  - Render <TextInput> div overlay at canvas position
  - Input: transparent bg, no border, matching font
  - Typing updates element.content in real-time
  - Enter key: confirm and commit (deselect)
  - Escape key: cancel (delete if empty)
  - Outside click: confirm

Double-click on existing text element:
  - Re-opens TextInput overlay for that element
  - Cursor placed at end of text

Render on canvas:
  ctx.font = `${el.fontWeight} ${el.fontSize}px Inter`
  ctx.fillStyle = el.strokeColor
  ctx.fillText(el.content, el.x, el.y + el.fontSize)
```

### 6.4 Sticky Notes

```
Click on canvas with Sticky tool:
  - Create sticky element at click position
  - Size: 200×150px fixed
  - Default noteColor: '#FFF176' (yellow)
  - Render as DOM div (not on canvas) — absolutely positioned

<StickyNote> component:
  - Positioned at toScreen(el.x, el.y)
  - Width/height scaled by viewport.zoom
  - Background: el.noteColor
  - Border: 1px solid (darker shade of noteColor)
  - Border-radius: 4px (top) 0px (fold corner) — optional
  - Box-shadow: 3px 3px 10px rgba(0,0,0,0.12)
  - Top strip (24px): darker shade of noteColor
  - Body: <textarea> transparent, no border, resize none, font-size 13px
  - Click outside: save content

Color picker for sticky:
  - 6 color dot swatches in BottomOptions bar when sticky tool active
```

### 6.5 Select Tool

**Single select:**
```
Click on element:
  - Hit test all elements (reverse z-order, highest first)
  - setSelectedIds([element.id])
  - Show SelectionOverlay

Click on empty canvas:
  - clearSelection()
```

**Drag select (marquee):**
```
MouseDown on empty space:
  - Start drawing selection rectangle (dashed #5B6AF0 border, rgba fill)
  - On mouseUp: select all elements whose bounding box overlaps selection rect
```

**Move:**
```
MouseDown on selected element + drag:
  - Update element x,y by (dx, dy) in canvas coords
  - pushHistory() on mouseUp only (not during drag)
```

**Resize:**
```
8 handles: NW, N, NE, E, SE, S, SW, W
Each handle: 8×8px white square, #5B6AF0 border, border-radius 2px
Cursor changes: nw-resize, n-resize, etc.

On handle drag:
  - Recalculate x, y, width, height based on which handle
  - Maintain aspect ratio if Shift held
  - Min size: 10×10px
  - pushHistory() on mouseUp
```

### 6.6 Eraser Tool

```
Draw path across canvas:
  - Check each element's bounding box vs eraser path
  - If freehand: check point proximity (radius = 10px)
  - If shape/text/sticky: check if eraser center hits bounding box
  - Delete matching elements
  - pushHistory() called once on mouseUp
```

### 6.7 Zoom & Pan

**Zoom:**
```
Mouse wheel on canvas:
  deltaY < 0 → zoom in (× 1.05 per tick)
  deltaY > 0 → zoom out (× 0.95 per tick)
  Zoom centered on cursor position (not canvas center)
  Formula:
    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95
    const newZoom = clamp(viewport.zoom * zoomFactor, 0.1, 4)
    const newX = e.clientX - (e.clientX - viewport.x) * (newZoom / viewport.zoom)
    const newY = e.clientY - (e.clientY - viewport.y) * (newZoom / viewport.zoom)
    setViewport({ x: newX, y: newY, zoom: newZoom })

Ctrl + scroll: zoom (same as above)
Ctrl + 0: reset to 100%
Ctrl + Shift + H: fit all elements to screen
```

**Pan:**
```
Space + drag (any tool):
  - Temporarily activates pan mode
  - cursor: grab → grabbing
  - viewport.x += dx, viewport.y += dy

Middle mouse button drag:
  - Same as Space + drag

Pan tool selected:
  - All drags pan the canvas
```

---

## 7. STEP-BY-STEP MEMBER WORKPLAN

---

### MEMBER A — Canvas Engine & Drawing
**Stack responsibility:** WhiteboardCanvas, CanvasRenderer, all Tools, useHistory, geometry utils, export

---

#### HOUR 1 (0:00 – 1:00) — Project Setup + Canvas Infrastructure

**Step 1 (0:00–0:15): Project setup**
```bash
npm create vite@latest collabboard -- --template react
cd collabboard
npm install tailwindcss @tailwindcss/vite zustand jspdf lucide-react nanoid
```
- Configure vite.config.js with tailwindcss plugin
- Add `@import "tailwindcss"` to index.css
- Add Inter font link to index.html
- Create folder structure (all folders, empty files)
- Delete boilerplate from App.jsx

**Step 2 (0:15–0:30): Zustand store skeleton**
- Create `src/store/useStore.js` with ALL state fields and stub actions
- Create `src/store/constants.js` with TOOL names, DEFAULT_STROKE_COLOR, etc.
- Create `src/utils/generateId.js`

**Step 3 (0:30–0:50): Canvas setup + dot grid**
- Create `WhiteboardCanvas.jsx` — a `<canvas>` element filling available space
- Hook up `useRef` for canvas, `useEffect` for resize observer
- Create `GridBackground.jsx` — draws dot grid on a separate background canvas
- Implement viewport transform in `WhiteboardCanvas`
- Wire mouse wheel → zoom via `useViewport.js`
- Wire Space+drag → pan

**Step 4 (0:50–1:00): Basic render loop**
- Create `CanvasRenderer.js` with empty `renderAll(ctx, elements, viewport)` function
- Call it from `useEffect` whenever `elements` or `viewport` changes
- Test: confirm canvas renders, grid shows, zoom/pan works

**✅ End of Hour 1 checkpoint:** Zoomable, pannable canvas with dot grid. Store initialized.

---

#### HOUR 2 (1:00 – 2:00) — Drawing Tools

**Step 5 (1:00–1:15): Freehand pencil**
- Create `tools/PencilTool.js` — exports `onMouseDown`, `onMouseMove`, `onMouseUp`
- Create `utils/smoothPath.js` — Bézier smoothing function
- Wire pencil events in `useCanvasEvents.js`
- Add `drawFreehand()` to `CanvasRenderer.js`
- Test: draw smooth curves

**Step 6 (1:15–1:35): Shape tools (rect, circle, line, arrow)**
- Create `tools/ShapeTool.js` with switch on `activeShape`
- Add live preview: draw ghost shape during drag before confirming
- Add `drawRect`, `drawCircle`, `drawLine`, `drawArrow` to CanvasRenderer
- Wire in `useCanvasEvents.js`
- Test: draw all 4 shapes

**Step 7 (1:35–1:50): Text tool**
- Create `tools/TextTool.js`
- Create `components/elements/TextInput.jsx` — floating div overlay at canvas position
- Calculate screen position from canvas coords using toScreen()
- Wire Enter/Escape/blur events
- Add `drawText()` to CanvasRenderer
- Test: click to type, confirm with Enter

**Step 8 (1:50–2:00): Eraser tool**
- Create `tools/EraserTool.js`
- Hit test elements during eraser drag path
- Remove on mouseUp, push history

**✅ End of Hour 2 checkpoint:** All drawing tools work. 10-min integration check with Member B.

---

#### HOUR 3 (2:00 – 3:00) — Selection, Move, Resize

**Step 9 (2:00–2:20): Select tool — single & marquee**
- Create `tools/SelectTool.js`
- Hit test in reverse z-order
- Marquee: draw selection rect on overlay canvas layer
- Update `selectedIds` in store

**Step 10 (2:20–2:40): Move elements**
- MouseDown on selected element → drag offset calculation
- Update element x,y on mousemove in canvas coords
- pushHistory() on mouseUp
- Multi-select: move all selected elements together

**Step 11 (2:40–3:00): Resize handles**
- Create `SelectionOverlay.jsx` — SVG layer over canvas
- Draw bounding box + 8 handles for selected element(s)
- Handle drag logic: recalculate x/y/w/h per handle direction
- Shift = aspect lock
- Apply changes to store on mouseUp

**✅ End of Hour 3 checkpoint:** Full select, move, resize working.

---

#### HOUR 4 (3:00 – 4:00) — Undo/Redo + Sticky Note Rendering

**Step 12 (3:00–3:20): Undo/Redo**
- Implement `pushHistory`, `undo`, `redo` in store
- Verify all tools call `pushHistory()` before mutations
- Test: draw → undo → redo cycle

**Step 13 (3:20–3:40): Sticky note rendering**
- Render sticky notes as positioned DOM `<div>` elements (not on canvas)
- `StickyNote.jsx`: draggable via mouse events, editable textarea
- Position sync: convert canvas x,y to screen on every viewport change
- Scale with zoom

**Step 14 (3:40–4:00): Layer z-order + duplicate**
- Implement bringForward/sendBackward/bringToFront/sendToBack in store
- Wire Ctrl+D → duplicateElements with offset (+20px, +20px)
- Wire Delete/Backspace → deleteElements(selectedIds)

**✅ End of Hour 4 checkpoint:** Full feature canvas. Undo/redo works. Stickies work.

---

#### HOUR 5 (4:00 – 5:00) — Export + Polish + Bug Fix

**Step 15 (4:00–4:30): Export**
- Create `utils/exportCanvas.js`
- PNG: create off-screen canvas, render all elements, toDataURL, trigger download
- PDF: use jsPDF, embed PNG data, letter size, trigger download
- Wire to `ExportModal` (Member B's component)

**Step 16 (4:30–5:00): Bug fixing + performance**
- Fix any hit-testing edge cases
- Ensure canvas re-renders correctly on all state changes
- Test undo/redo across all element types
- Test export output quality
- Final integration pass with Member B

---

### MEMBER B — UI, State Wiring & Collaboration
**Stack responsibility:** All layout components, toolbar, color picker, mock collaboration, keyboard shortcuts, export modal

---

#### HOUR 1 (0:00 – 1:00) — App Shell & Toolbar

**Step 1 (0:00–0:15): Setup (parallel with Member A)**
- Same project init — coordinate so one person creates repo and shares
- Member B: pull repo, run npm install, verify dev server starts

**Step 2 (0:15–0:40): App layout + top bar**
- Create `components/layout/AppLayout.jsx` — CSS Grid layout
- Create `components/layout/TopBar.jsx`
  - Logo ("CollabBoard" + simple SVG icon)
  - Placeholder for AvatarRow (empty div)
  - Placeholder for ZoomControls
  - Share button (grey outline, non-functional)
  - Export button (purple, onClick → setExportModalOpen(true))

**Step 3 (0:40–1:00): Left toolbar**
- Create `components/toolbar/LeftToolbar.jsx`
- Create `components/toolbar/ToolButton.jsx` — takes icon, tool name, shortcut, active state
- Add all 7 tool buttons (using Lucide icons: MousePointer, Hand, Pencil, Square, Type, StickyNote, Eraser)
- Wire onClick → `setActiveTool()` from store
- Active state styling (purple bg, white icon)
- Add `Tooltip.jsx` — hover tooltip to right of each button

**✅ End of Hour 1 checkpoint:** Full UI shell visible. Tools click and update store.

---

#### HOUR 2 (1:00 – 2:00) — State Wiring + Options Bar

**Step 4 (1:00–1:20): Shape dropdown**
- Create `components/toolbar/ShapeDropdown.jsx`
- 4 shape options with icons
- Toggle open/close when Shape tool button clicked
- Wire `setActiveShape()` to store
- Show currently active shape icon on the Shape tool button

**Step 5 (1:20–1:45): Bottom options bar**
- Create `components/toolbar/BottomOptions.jsx`
- Conditional rendering based on `activeTool`
- Create `components/ui/ColorPicker.jsx`
  - 16 swatches, recent colors row, hex input
  - Opens as popover on color dot click
  - Separate stroke/fill modes
- Create `components/ui/StrokeWidthPicker.jsx`
  - 3 preset dots (1px, 3px, 8px) + hidden range input
  - Wire to `setStrokeWidth()`
- Create `components/ui/OpacitySlider.jsx`
  - Range 0–100, wire to `setOpacity()`

**Step 6 (1:45–2:00): Layer controls & font options**
- Add `LayerControls.jsx` to BottomOptions (visible when element selected)
- Add font size dropdown for text tool
- Integration check with Member A at 2:00

**✅ End of Hour 2 checkpoint:** Full options bar connected to store. 10-min sync.

---

#### HOUR 3 (2:00 – 3:00) — Mock Collaboration

**Step 7 (2:00–2:20): Avatar row**
- Create `components/collaboration/AvatarRow.jsx`
- 3 overlapping avatars with online dots
- Hover tooltip with name
- Plug into TopBar

**Step 8 (2:20–2:50): Mock cursors**
- Create `hooks/useMockCollaboration.js`
  - 3 setInterval timers (900ms, 1100ms, 1400ms)
  - Each tick: random new target within canvas bounds
  - 30% chance to skip (simulate pause)
  - Call `updateMockCursor(userId, {x, y})`
- Create `components/collaboration/MockCursors.jsx`
  - Read `mockUsers` from store
  - Render 3 fixed-position div cursors
  - CSS transition: all 1s ease for smooth movement
  - SVG arrow + name pill per cursor

**Step 9 (2:50–3:00): Right panel + activity feed**
- Create `components/layout/RightPanel.jsx`
- Create `components/collaboration/ActivityFeed.jsx`
  - Read `activityLog` from store
  - Display max 20 entries, newest first
- Create `utils/mockActivity.js`
  - Random events every 8–15 seconds
  - Pool: "added a sticky note", "drew a shape", "moved an element", "added text"
  - Call `addActivityEvent()` in store

**✅ End of Hour 3 checkpoint:** Cursors moving, activity feed updating, avatars showing.

---

#### HOUR 4 (3:00 – 4:00) — Keyboard Shortcuts + Zoom Controls

**Step 10 (3:00–3:20): Keyboard shortcuts**
- Create `hooks/useKeyboard.js`
- Register in `App.jsx` via useEffect (addEventListener on window)
- Map:
  ```
  V → setActiveTool('select')
  H → setActiveTool('pan')
  P → setActiveTool('pencil')
  S → setActiveTool('shape')
  T → setActiveTool('text')
  N → setActiveTool('sticky')
  E → setActiveTool('eraser')
  Ctrl+Z → undo()
  Ctrl+Y / Ctrl+Shift+Z → redo()
  Ctrl+D → duplicateElements(selectedIds)
  Delete / Backspace → deleteElements(selectedIds) [if not editing text]
  Ctrl+A → select all
  Escape → clearSelection() / cancel active operation
  Ctrl+= → zoomIn()
  Ctrl+- → zoomOut()
  Ctrl+0 → resetZoom()
  ```

**Step 11 (3:20–3:40): Zoom controls UI**
- Create `components/ui/ZoomControls.jsx`
- + button, % display (clickable → resetZoom), - button, fit button
- Wire all 4 to store actions
- Display current `viewport.zoom` formatted as percentage

**Step 12 (3:40–4:00): Sticky note color picker + tool options polish**
- Show 6 sticky color swatches in BottomOptions when sticky tool active
- Wire selected swatch to `activeNoteColor` in store
- Polish: ensure BottomOptions shows correct options for each tool
- Test all tool switching edge cases

**✅ End of Hour 4 checkpoint:** All keyboard shortcuts work. Zoom controls wired.

---

#### HOUR 5 (4:00 – 5:00) — Export Modal + Final Polish

**Step 13 (4:00–4:30): Export modal**
- Create `components/ui/ExportModal.jsx`
- PNG / PDF format toggle cards
- "Include background" + "Crop to content" checkboxes
- Canvas preview thumbnail (use small canvas render)
- Download button → calls `exportCanvas(format, options)` from Member A's utils
- Close button and backdrop click to dismiss

**Step 14 (4:30–4:50): Right panel toggle**
- Wire chevron button in TopBar to toggle right panel
- CSS transition: width 0 → 280px with overflow hidden
- Ensure canvas area resizes when panel opens/closes

**Step 15 (4:50–5:00): Final QA pass**
- Test every tool end-to-end
- Test undo/redo with each tool
- Test export
- Fix any visual inconsistencies (spacing, colors off-spec)
- Remove any `console.log` statements

---

## 8. INTEGRATION CONTRACTS

These are the exact interfaces both members must agree to before Hour 2. Do not change these without telling the other person.

### Store Interface (Member B writes, Member A reads)
```js
// Member A reads these — do not rename
useStore.getState().activeTool        // 'select'|'pan'|'pencil'|'shape'|'text'|'sticky'|'eraser'
useStore.getState().activeShape       // 'rect'|'circle'|'line'|'arrow'
useStore.getState().strokeColor       // hex string
useStore.getState().fillColor         // hex string or 'transparent'
useStore.getState().strokeWidth       // number
useStore.getState().opacity           // 0.0–1.0
useStore.getState().fontSize          // number
useStore.getState().viewport          // { x, y, zoom }
useStore.getState().elements          // Element[]
useStore.getState().selectedIds       // string[]
useStore.getState().isExportModalOpen // bool
```

### Store Actions (Member A calls, Member B implements)
```js
// Member A calls these — implement in useStore.js
addElement(element)                   // adds to elements[]
updateElement(id, changes)            // merges changes into element
deleteElements(ids)                   // removes by id
setSelectedIds(ids)
clearSelection()
pushHistory()                         // MUST be called by Member A before mutations
undo()
redo()
setViewport({ x, y, zoom })
setIsEditingText(bool, id)
addActivityEvent({ userId, action })  // called when user performs an action
```

### Export Bridge (Member A exports function, Member B calls it)
```js
// exportCanvas.js (Member A writes)
export async function exportCanvas(format, options) {
  // format: 'png' | 'pdf'
  // options: { includeBackground: bool, cropToContent: bool }
  // returns: triggers browser download
}

// ExportModal.jsx (Member B calls)
import { exportCanvas } from '../../utils/exportCanvas'
<button onClick={() => exportCanvas(format, options)}>Download</button>
```

### Canvas-Sticky Communication
```js
// Sticky notes are DOM elements, not canvas elements
// Member A: skip rendering 'sticky' type in CanvasRenderer
// Member B: render StickyNote components in a div overlay on top of canvas
// Both: use same toScreen() / toCanvas() utils from utils/geometry.js
```

---

## 9. TECH STACK & DEPENDENCIES

### package.json dependencies
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^5.0.0",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.400.0",
    "nanoid": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^5.4.0"
  }
}
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### index.html (head section)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>CollabBoard</title>
```

### index.css
```css
@import "tailwindcss";

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #F8F9FB;
  overflow: hidden;
  user-select: none;
}

canvas {
  display: block;
}

:root {
  --color-primary: #5B6AF0;
  --color-primary-hover: #4757E8;
  --color-primary-light: #EEF0FD;
  --color-toolbar-bg: #1E1F2E;
  --color-toolbar-icon: #8B8FA8;
  --color-toolbar-active: #FFFFFF;
  --color-canvas-bg: #F8F9FB;
  --color-border: #E8EAF0;
  --color-text-primary: #1A1B2E;
  --color-text-secondary: #6B7080;
  --color-text-muted: #A0A5B8;
  --color-success: #4CAF7D;
  --color-danger: #F05B5B;
}
```

---

## 10. KEYBOARD SHORTCUTS REFERENCE

| Shortcut | Action |
|---|---|
| V | Select tool |
| H | Pan tool |
| P | Pencil tool |
| S | Shape tool |
| T | Text tool |
| N | Sticky note tool |
| E | Eraser tool |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + Shift + Z | Redo (alternate) |
| Ctrl + D | Duplicate selected |
| Ctrl + A | Select all |
| Delete / Backspace | Delete selected |
| Escape | Deselect / Cancel |
| Ctrl + = | Zoom in |
| Ctrl + - | Zoom out |
| Ctrl + 0 | Reset zoom to 100% |
| Ctrl + Shift + H | Fit to screen |
| Space + Drag | Pan canvas |

---

## 11. EXPORT SPECIFICATION

### PNG Export
```js
export async function exportToPNG(elements, viewport, options) {
  const { includeBackground, cropToContent } = options

  // 1. Calculate bounding box of all elements
  const bbox = cropToContent
    ? getContentBoundingBox(elements)
    : { x: 0, y: 0, width: 1920, height: 1080 }

  // 2. Create off-screen canvas
  const offscreen = document.createElement('canvas')
  offscreen.width = bbox.width * 2    // 2x for retina
  offscreen.height = bbox.height * 2
  const ctx = offscreen.getContext('2d')
  ctx.scale(2, 2)

  // 3. Draw background
  if (includeBackground) {
    ctx.fillStyle = '#F8F9FB'
    ctx.fillRect(0, 0, bbox.width, bbox.height)
    drawDotGrid(ctx, bbox.width, bbox.height)
  }

  // 4. Translate to crop origin
  ctx.translate(-bbox.x, -bbox.y)

  // 5. Render all elements
  renderAll(ctx, elements, { x: 0, y: 0, zoom: 1 })

  // 6. Trigger download
  const link = document.createElement('a')
  link.download = 'collabboard.png'
  link.href = offscreen.toDataURL('image/png')
  link.click()
}
```

### PDF Export
```js
export async function exportToPDF(elements, viewport, options) {
  // 1. Render to PNG first (same as above, full quality)
  const pngDataUrl = await renderToDataURL(elements, options)

  // 2. Create PDF with jsPDF
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] })
  pdf.addImage(pngDataUrl, 'PNG', 0, 0, 1920, 1080)
  pdf.save('collabboard.pdf')
}
```

---

## 12. MOCK COLLABORATION SPECIFICATION

### Mock Users Data
```js
export const MOCK_USERS = [
  {
    id: 'u1', name: 'Alex Kim', initials: 'AK', color: '#F05B5B',
    avatar: null,  // initials fallback
    actions: ['added a sticky note', 'drew a shape', 'moved an element'],
    intervalMs: 900,
  },
  {
    id: 'u2', name: 'Sara Chen', initials: 'SC', color: '#5BF0A0',
    actions: ['added text', 'drew a line', 'added a sticky note'],
    intervalMs: 1100,
  },
  {
    id: 'u3', name: 'Dev Patel', initials: 'DP', color: '#F0D25B',
    actions: ['drew a shape', 'moved an element', 'added text', 'drew a freehand'],
    intervalMs: 1400,
  }
]
```

### Mock Cursor Movement Algorithm
```js
function getNextCursorPosition(currentPos, canvasRect) {
  // 30% chance: stay in place (simulate reading)
  if (Math.random() < 0.3) return currentPos

  // Move to random position, biased toward center
  const cx = canvasRect.width / 2
  const cy = canvasRect.height / 2
  const spread = 0.6  // how spread out movements are

  return {
    x: cx + (Math.random() - 0.5) * canvasRect.width * spread,
    y: cy + (Math.random() - 0.5) * canvasRect.height * spread,
  }
}
```

### Activity Event Schema
```js
{
  id: string,           // nanoid
  userId: string,       // 'u1' | 'u2' | 'u3'
  userName: string,
  userColor: string,
  action: string,       // e.g. "added a sticky note"
  timestamp: number,    // Date.now()
  timeAgo: string,      // computed: "just now" / "2m ago" / "5m ago"
}
```

---

## 13. RISK REGISTER

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| Canvas performance drops with many elements | Medium | High | Use dirty rect, skip off-screen elements, RAF loop |
| Resize handle math bugs (negative width/height) | High | Medium | Clamp min width/height to 10px, swap handles if inverted |
| State desync between canvas render and store | Medium | High | Single source of truth in store; canvas only reads, never writes without store |
| Text input overlay misalignment on zoom | Medium | Medium | Recalculate screen position on every viewport change |
| Sticky notes not scaling with zoom | Low | Medium | Multiply DOM position and size by viewport.zoom |
| Export missing sticky note content | Medium | High | Render stickies onto off-screen canvas manually during export |
| Undo corrupting element IDs | Low | High | Deep clone (JSON.parse/stringify) on every snapshot |
| Member integration conflict in store | Medium | Medium | Define store interface before Hour 2, no unilateral renames |
| jsPDF producing blank output | Low | Medium | Test export by Hour 4, have PNG-only fallback |
| Over-engineering causes time overrun | High | High | Ship working > perfect; defer stretch goals ruthlessly |

---

## 14. DEFINITION OF DONE

### Per Feature
- [ ] Works without console errors in Chrome
- [ ] Connected to Zustand store (no local useState for shared state)
- [ ] Survives undo → redo cycle without corruption
- [ ] Matches color spec (no hardcoded off-brand colors)
- [ ] Does not break zoom/pan interaction
- [ ] Does not cause unrelated re-renders

### Sprint Done Criteria
- [ ] All 7 tools functional (select, pan, pencil, shapes, text, sticky, eraser)
- [ ] Move + resize working for all element types
- [ ] Undo / redo works across all tools
- [ ] Mock cursors visible and moving
- [ ] Activity feed updating
- [ ] Export produces valid PNG
- [ ] Export produces valid PDF
- [ ] Keyboard shortcuts all working
- [ ] No hard crashes during demo flow

---

## 15. STRETCH GOALS (Hour 5 buffer only)

| Feature | Effort | Owner |
|---|---|---|
| Snap to grid toggle | 30 min | A |
| Minimap (bottom-right corner) | 45 min | B |
| Image upload onto canvas | 40 min | A |
| Dark mode toggle | 30 min | B |
| Lock/unlock element | 20 min | A |
| Presentation mode (hide UI) | 25 min | B |
| Arrow connector (element-to-element) | 60 min | A |

---

*This PRD is the single source of truth for the 5-hour sprint. Both members should have it open at all times.*
