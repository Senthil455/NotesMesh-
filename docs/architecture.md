# NoteMesh Architecture Overview

NoteMesh is engineered as a **local-first, modular knowledge workspace**. This document explains the system boundaries, design choices, and data flow across subsystems.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       App Shell & UI                        │
│   Navbar  │  Sidebar  │  CommandPalette  │  SettingsModal    │
├───────────────┬──────────────────────────┬──────────────────┤
│ Notes Feature │   Knowledge Graph View   │ Canvas Workspace │
│ Editor/Preview│ Physics Simulation       │ Visual Diagram   │
│ Backlinks     │ Node & Edge Visualizer   │ Linked Note Cards│
├───────────────┴──────────────────────────┴──────────────────┤
│                        Core Layer                           │
│  Domain Models  │  Wikilink Parser  │  Graph Data Engine    │
├─────────────────────────────────────────────────────────────┤
│                    Plugin Runtime Engine                    │
│   PluginManager │ Sandboxed Context │ Commands & Status Bar │
├─────────────────────────────────────────────────────────────┤
│                     Storage Abstraction                     │
│   StorageAdapter Interface  ──►  LocalStorage / IndexedDB   │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Domain Models (`src/core/domain/`)

- `Note`: Identifiers, title, markdown body, folders, tags, pin/favorite flags, timestamps.
- `NoteLink` & `BacklinkItem`: Captured targets `[[Target Note]]`, source notes, and context snippets.
- `GraphNode` & `GraphEdge`: Graph structure with calculated connection degrees, collision radii, and orphan flags.
- `CanvasDocument` & `CanvasElement`: Freeform whiteboard documents with process rectangles, decision diamonds, sticky notes, connectors, and **Linked Note Cards**.
- `PluginManifest` & `PluginContext`: Versioning, permissions, and plugin runtime contracts.

---

## 2. Storage Abstraction (`src/core/storage/`)

All persistence runs through the `StorageAdapter` interface:
```typescript
export interface StorageAdapter {
  getNotes(): Promise<Note[]>;
  saveNote(note: Note): Promise<void>;
  deleteNote(id: string): Promise<void>;
  getCanvases(): Promise<CanvasDocument[]>;
  saveCanvas(canvas: CanvasDocument): Promise<void>;
  deleteCanvas(id: string): Promise<void>;
  exportAll(): Promise<string>;
  importAll(jsonString: string): Promise<boolean>;
}
```
This enables future contributors to easily add a desktop filesystem adapter (Tauri/Electron) or SQLite adapter without rewriting UI components!

---

## 3. Markdown & Wikilinks Engine (`src/core/markdown/`)

- `extractWikilinks`: Regular expression matching `[[Target]]` or `[[Target|Alias]]`.
- `resolveWikilinks`: Case-insensitive resolution against active note titles; highlights missing targets cleanly.
- `buildBacklinks`: Scans workspace notes to discover referring links and extracts live preview snippets.

---

## 4. Knowledge Graph Simulation (`src/core/graph/`)

- Custom HTML5 Canvas physics engine using Hooke's law for spring attraction along edges and Coulomb repulsion between nodes.
- Filter layer supporting tag isolation, orphan node toggles, and missing link visualization.

---

## 5. Plugin Runtime (`src/core/plugins/`)

- Sandboxed `PluginContext` exposing controlled extension points:
  - `registerCommand`: Injects actions into the global Command Palette (`Ctrl+K`).
  - `addStatusBarItem` & `updateStatusBarItem`: Injects live indicators into the bottom footer.
  - `onNoteChange`: Subscribes to live active note edits.
