# 🎨 Pixel-Collab (CollabBoard)

[![Deployed Link](https://img.shields.io/badge/Deployed%20Link-Live%20Demo-blue?style=for-the-badge&logo=vercel)](https://pixel-collab-chi.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Pixel-Collab** is a high-performance, professional-grade collaborative whiteboard application built for the modern web. It features a snappy HTML5 Canvas engine, advanced drawing tools, and a rich "mock" collaboration system that makes the board feel alive even without a real backend.

---

## 🚀 Live Demo
**Access the app here:** [https://pixel-collab-chi.vercel.app/](https://pixel-collab-chi.vercel.app/)

---

## ✨ Key Features

### 🖌️ Advanced Canvas Engine
- **Professional Drawing Tools**: Pencil, Shapes (Rect, Circle, Line, Arrow), Text, and Sticky Notes.
- **Smart Text Tool**: Auto-resizing input with multi-line support and instant canvas rendering.
- **High-Performance Rendering**: Pure JS renderer optimized for smooth strokes and complex scenes.
- **Infinite Viewport**: Zoom (10% to 400%) and Pan (Hand tool or Spacebar) support.
- **Minimap**: Bottom-left persistent navigation map with real-time synchronized stroke previews.

### 📐 Precision & Alignment
- **Magnetic Snapping**: Figma-style element-to-element alignment with visual guide rails.
- **Snap-to-Grid**: Customizable dot grid for perfectly aligned layouts.
- **Z-Index Management**: Move elements forward, backward, to front, or to back.
- **Element Locking**: Lock important elements to prevent accidental moves or deletions.

### 👥 Mock Collaboration System
- **Living Board**: Simulated multi-user activity with mock cursors and typing indicators.
- **Activity Feed**: Real-time log of all board actions (elements added, moved, resized).
- **Custom Profiles**: Change your display name and avatar directly from the top bar.
- **Deep-Link Sharing**: Share your board state via compressed URL hashes (GZIP + Base64).

### 🛠️ Developer & Power User Tools
- **Keyboard Shortcuts**: `V` (Select), `H` (Pan), `P` (Pencil), `T` (Text), `Ctrl+Z/Y` (Undo/Redo), `Ctrl+A` (Select All).
- **Export Options**: Save your work as high-quality PNG or multi-page PDF.
- **Dark Mode**: System-aware theme switching with persistent storage.
- **Robust State**: Powered by Zustand with full undo/redo history.

---

## 📂 Project Structure

```text
Pixel-Collab/
├── src/
│   ├── canvas/          # Core rendering engine & viewport logic
│   │   ├── CanvasRenderer.js    # Pure JS drawing logic
│   │   ├── Minimap.jsx          # Navigation overview
│   │   └── useCanvasEvents.js   # Main event orchestration
│   ├── components/      # UI Layer
│   │   ├── collaboration/       # Cursors, activity feed, avatars
│   │   ├── elements/            # DOM-based canvas overlays (Text, Stickies)
│   │   ├── layout/              # Shell, TopBar, RightPanel
│   │   └── toolbar/             # Main drawing tools & options
│   ├── hooks/           # Custom React logic (Keyboard, Viewport, Theme)
│   ├── store/           # Global state (Zustand)
│   ├── tools/           # Modular tool implementations (Select, Pencil, etc.)
│   └── utils/           # Math, Persistence, and Geometry helpers
├── public/              # Static assets
└── tests/               # Vitest + RTL test suite
```

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Compression**: [CompressionStream API](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream) (GZIP)
- **PDF Generation**: [jspdf](https://github.com/parallax/jsPDF)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📦 Getting Started

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/rishab11250/HackStreet-2K26.git
    cd HackStreet-2K26/Pixel-Collab
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 🧪 Running Tests
The project includes 27+ unit and integration tests covering geometry, snapping, and state management.
```bash
npm run test
```

---

## 📄 License
Built for **HackStreet 2026**. Open source under the [MIT License](LICENSE).
