# 🎨 Pixel-Collab (CollabBoard)

[![Deployed Link](https://img.shields.io/badge/Deployed%20Link-Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://pixel-collab-chi.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://docs.pmnd.rs/zustand/)

**Pixel-Collab** is a high-performance, professional-grade collaborative whiteboard application built for the modern web. It features a custom-built HTML5 Canvas engine, advanced drawing tools, and a sophisticated "mock" collaboration system that simulates a real-time multi-user environment.

---

## 🚀 Live Demo
**Experience the board:** [https://pixel-collab-chi.vercel.app/](https://pixel-collab-chi.vercel.app/)

---

## 📺 Feature Deep-Dive

### 🖌️ Advanced Canvas Engine
Built from the ground up with a pure JS renderer ([CanvasRenderer.js](Pixel-Collab/src/canvas/CanvasRenderer.js)), Pixel-Collab offers:
- **Professional Toolset**: Pencil (with smoothing), Shapes (Rect, Circle, Line, Arrow), Text, and Sticky Notes.
- **Infinite Canvas feel**: Seamless **Zoom (10% - 400%)** and **Pan** support.
- **Dynamic Minimap**: A persistent viewport overview that renders real-time stroke previews using a specialized low-fidelity drawer ([minimapDraw.js](Pixel-Collab/src/canvas/minimapDraw.js)).
- **High-DPI Support**: Automatically scales for Retina/4K displays for crisp lines.

### 📐 Precision & Alignment (The "Pro" Touch)
- **Magnetic Snapping**: Figma-style alignment that "snaps" elements to edges and centers of other elements with visual guide rails ([snapAlignment.js](Pixel-Collab/src/utils/snapAlignment.js)).
- **Snap-to-Grid**: A customizable dot grid that guides placement while remaining visually subtle.
- **Z-Index Controls**: Full "Bring to Front" / "Send to Back" stack management.
- **Element Locking**: Secure your work by locking elements to prevent accidental modifications.

### 👥 Living Collaboration System
- **Mock Presence**: Simulated multi-user activity with dynamic cursors, name tags, and color-coded avatars.
- **Typing Indicators**: Real-time visual feedback when other "users" are adding text.
- **Activity Feed**: A scrolling sidebar log capturing every move, resize, and creation on the board.
- **URL Persistence**: Share your entire board state via compressed URL hashes. We use the **CompressionStream API (GZIP)** to keep links short and shareable even with complex drawings.

---

## 🏗️ Architecture & Folder Structure

The project follows a modular architecture designed for performance and maintainability:

```text
Pixel-Collab/
├── src/
│   ├── canvas/          # Core rendering engine
│   │   ├── CanvasRenderer.js    # Pure JS drawing logic (High Performance)
│   │   ├── minimapDraw.js       # Optimized drawer for the viewport overview
│   │   ├── useCanvasEvents.js   # Event orchestration (The Brain of the canvas)
│   │   └── SelectionOverlay.jsx # DOM-based handles for resizing/moving
│   ├── components/      # React UI Layer
│   │   ├── collaboration/       # Cursors, Activity Feed, Typing Indicators
│   │   ├── elements/            # Canvas-aligned DOM overlays (Text inputs, Stickies)
│   │   ├── layout/              # Shell, TopBar, Side panels
│   │   └── toolbar/             # Main tools, color pickers, and tool options
│   ├── hooks/           # Custom Logic
│   │   ├── useKeyboard.js       # Global hotkeys (V, H, T, P, Ctrl+Z, etc.)
│   │   ├── useMockCollaboration.js # The simulation engine
│   │   └── useViewport.js       # Camera math (Zoom/Pan transformations)
│   ├── store/           # Global State
│   │   └── useStore.js          # Central Zustand store with undo/redo & history
│   ├── tools/           # Modular Tool Logic
│   │   ├── SelectTool.js        # Complex selection/move/marquee logic
│   │   └── ... (Pencil, Shape, Text, Eraser, Pan)
│   └── utils/           # Math & System Helpers
│       ├── snapAlignment.js     # Magnetic alignment math
│       ├── persistence.js       # GZIP compression for URL state
│       └── geometry.js          # Hit-testing and bounding box math
└── tests/               # Vitest + React Testing Library suite
```

---

## 🛠️ Tech Stack & Credits

| Technology | Usage |
| :--- | :--- |
| **React 19** | Modern UI components and hooks |
| **Vite 8** | Ultra-fast build tool and HMR |
| **Zustand** | Lightweight, high-performance state management |
| **Tailwind CSS 4** | Utility-first styling with the new v4 engine |
| **Lucide React** | Clean, consistent iconography |
| **CompressionStream** | Native browser GZIP for URL state serialization |
| **jsPDF** | Professional PDF export capabilities |
| **Vitest** | Reliable unit and integration testing |

---

## 📦 Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/rishab11250/HackStreet-2K26.git
    cd HackStreet-2K26/Pixel-Collab
    ```

2.  **Install Dependencies:**
    ```bash
    npm install # or pnpm install
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

---

## 🧪 Quality Assurance
We maintain high code quality with 27+ automated tests.
```bash
npm run test
```

---

## 📄 License
Created for **HackStreet 2026**. Open source under the [MIT License](LICENSE).
