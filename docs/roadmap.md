# NoteMesh Product Roadmap & Open-Source Milestone Tracker 🗺️

**Current Completion Level: ~55% (Solid Core Foundation Shipped)**

This document details what is completed, what is in active development, and what is ready for community contributors, Google Summer of Code (GSoC) applicants, and Hacktoberfest participants.

---

## 📊 Milestone Summary

```
[████████████████████████████░░░░░░░░░░░░░░░░░░░░░░] 55% Core Foundation Shipped
```

---

## 🟢 1. Shipped Features (55% Base)

### 📝 Notes & Knowledge Management
- [x] Full Markdown GFM editor with split live preview (`src/features/notes/NoteEditor.tsx`)
- [x] `[[Wikilinks]]` parsing with alias syntax (`[[Target Note|Alias]]`) (`src/core/markdown/wikilinks.ts`)
- [x] Automatic Backlinks discovery with contextual preview snippets (`src/features/notes/BacklinksPanel.tsx`)
- [x] Multi-folder hierarchy and folder grouping (`src/components/Sidebar.tsx`)
- [x] Tag extractor (`#tag`) and real-time tag filtering (`src/core/markdown/wikilinks.ts`)
- [x] Reusable Note Templates: Daily Note, Meeting Minutes, ADR, Research note (`src/core/templates/`)
- [x] Quick "Today's Daily Note" generator (`src/App.tsx`)
- [x] Markdown File (.md) Import & Single Note Download (`src/features/notes/NoteEditor.tsx`)
- [x] LocalStorage persistence with sample interconnected notes (`src/core/storage/`)

### 🕸️ Knowledge Graph
- [x] HTML5 Canvas real-time physics engine (Hooke spring attraction + Coulomb repulsion) (`src/features/graph/`)
- [x] Interactive node dragging, pan, and smooth zoom (`src/features/graph/KnowledgeGraphView.tsx`)
- [x] Physical force adjustment sliders (Repel force, Link distance, Collision radius)
- [x] Node color schemes: **Color by Node Type**, **Color by Folder**, and **Color by Tag**
- [x] Search inside graph with real-time node highlighting
- [x] Orphan nodes detection and show/hide toggle
- [x] Missing link nodes detection and display
- [x] Clicking any graph node navigates directly to that note

### 🎨 Visual Canvas & Diagrams
- [x] Freeform diagramming workspace inspired by Miro & Excalidraw (`src/features/canvas/`)
- [x] Rectangles (Process), Diamonds (Decision), Circles (Concepts), Sticky Notes, Connectors
- [x] **Linked Note Cards**: embed notes on board and click to jump directly into the note editor
- [x] Curved cubic bezier connector paths
- [x] Element duplication (`Duplicate` button)
- [x] SVG diagram export (`.svg`)
- [x] Multi-step Undo / Redo history stack
- [x] Grid background with snap toggle

### 🔌 Extensibility & System Architecture
- [x] Sandboxed Plugin Manifest and lifecycle (`onLoad`, `onUnload`) (`src/core/plugins/`)
- [x] Extension points: Status Bar items, Command Palette actions, active note subscription
- [x] Three built-in working sample plugins:
  - *Word Count & Reading Time*
  - *Quick Markdown Exporter*
  - *Table of Contents Generator*
- [x] In-app Plugin Manager modal to toggle plugins
- [x] Global Command Palette (`Ctrl+K` / `Cmd+K`)
- [x] Dark / Light theme toggle with Tailwind CSS tokens and custom CSS variables
- [x] Full workspace JSON backup export and import
- [x] 11 Vitest automated unit tests passing with 0 warnings
- [x] Strict ESLint and TypeScript compilation passing with 0 warnings

---

## 🟡 2. In-Progress Features (~15%)

| Feature | Target Area | Description | Priority |
| :--- | :--- | :--- | :--- |
| **KaTeX Math Preview** | Notes | Render `$E=mc^2$` and `$$\int f(x)dx$$` in markdown preview | High |
| **Mermaid.js Flowcharts** | Notes & Preview | Render ````mermaid blocks inside markdown notes | High |
| **Multi-Canvas Switcher** | Canvas | Create and manage multiple named canvas boards | Medium |
| **Note Card Mini-Editor** | Canvas | Edit linked note content directly from canvas card | Medium |
| **Graph 2-Hop Neighborhood** | Graph | Filter graph to only show 1st and 2nd degree neighbors of active note | Medium |

---

## 🔵 3. Planned Community Features (~30% Ready for Open-Source Contributors)

These tasks are open for pull requests! Read [CONTRIBUTING.md](../CONTRIBUTING.md) to pick an issue.

### 🌟 Good First Issues (Beginner)
1. **Issue #101: Nord and Solarized Themes**
   - Add new theme presets to `src/styles/index.css` and a theme selector dropdown in Settings.
2. **Issue #102: Pomodoro Timer Plugin**
   - Build a sample plugin registering a 25-minute focus timer in the bottom status bar.
3. **Issue #103: Canvas Shape Color Presets**
   - Expand the canvas color picker with 6 curated pastel tones for sticky notes.
4. **Issue #104: Note Word Goal Tracker**
   - Allow users to set a target word count (e.g. 500 words) with a progress bar.

### 🛠️ Intermediate Features
1. **Issue #201: File System Access API Adapter**
   - Implement a new `StorageAdapter` in `src/core/storage/fileSystemAdapter.ts` reading/writing to a real local folder on disk in Chromium browsers.
2. **Issue #202: Canvas Selection Bounding Box**
   - Drag to select multiple canvas elements and move them together.
3. **Issue #203: Graph Hierarchical Layout**
   - Add a tree / Dagre layout option to the Knowledge Graph in addition to force-directed.
4. **Issue #204: Bi-directional Canvas Links**
   - Allow linking a Canvas inside a Note using syntax `![[Canvas: Architecture Flow]]`.

### 🚀 Advanced Features
1. **Issue #301: Desktop Packaging with Tauri**
   - Package NoteMesh as a lightweight cross-platform desktop app using Tauri v2 and Rust.
2. **Issue #302: Local Embedding & Semantic Similarity (Optional AI Plugin)**
   - Create an opt-in plugin running a small WebAssembly embedding model (e.g. Transformers.js) locally on device to suggest related notes without sending any data over the internet.
