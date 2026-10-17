import { Note } from '../domain/note';
import { CanvasDocument } from '../domain/canvas';

export const SAMPLE_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: 'Welcome to NoteMesh',
    tags: ['getting-started', 'pkm'],
    folder: 'Getting Started',
    isPinned: true,
    isFavorite: true,
    content: `# Welcome to NoteMesh

NoteMesh is your local-first knowledge workspace combining:
- Markdown notes with [[Bidirectional Links]]
- Interactive [[Knowledge Graph Guide]]
- Freeform visual [[Canvas Workflows]]
- Open community [[Plugin Architecture]]

### Core Capabilities

1. **Wikilinks**: Type \`[[Note Name]]\` anywhere to connect ideas seamlessly. NoteMesh automatically discovers backlinks.
2. **Local-first**: All your data lives right in your browser storage. Zero accounts, zero tracking, total data sovereignty.
3. **Canvas Note Cards**: Drag note cards onto a visual board and build diagrams that link directly back to your writing.

Check out [[Neural Networks]] to see an interconnected topic, or navigate using the top tabs above.`,
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'note-kg-guide',
    title: 'Knowledge Graph Guide',
    tags: ['graph', 'visualization', 'pkm'],
    folder: 'Guides',
    isPinned: false,
    content: `# Knowledge Graph Guide

The Knowledge Graph reveals hidden relationships across your notes.

### How it works:
- Every note is represented as an interactive node.
- When you link notes with \`[[Note Title]]\`, an edge forms between them.
- Nodes with multiple connections scale proportionally.
- Orphan notes (notes without any connections) can be filtered or highlighted.

Explore related concepts like [[Neural Networks]] and [[Bidirectional Links]], or visit [[Welcome to NoteMesh]].`,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note-bidirectional-links',
    title: 'Bidirectional Links',
    tags: ['pkm', 'links'],
    folder: 'Guides',
    content: `# Bidirectional Links

In NoteMesh, links are bidirectional. When Note A links to Note B via \`[[Note B]]\`, Note B automatically displays Note A in its Backlinks panel.

### Why this matters:
- Eliminates manual index maintenance.
- Surfaces unexpected connections across your research.
- Review the backlinks section at the bottom of this note to see incoming references from [[Welcome to NoteMesh]] and [[Knowledge Graph Guide]].`,
    createdAt: Date.now() - 3600000 * 20,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note-neural-networks',
    title: 'Neural Networks',
    tags: ['ai', 'deep-learning', 'research'],
    folder: 'Research',
    content: `# Neural Networks

Artificial Neural Networks (ANNs) are computational models inspired by biological neural structures.

- Related: [[Knowledge Graph Guide]]
- Architecture: [[Deep Learning Architecture]]

Commonly applied across machine learning, natural language processing, and automated reasoning systems.`,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'note-canvas-workflows',
    title: 'Canvas Workflows',
    tags: ['canvas', 'diagramming', 'visuals'],
    folder: 'Guides',
    content: `# Canvas Workflows

Diagrams should stay connected to the notes they explain.

NoteMesh includes a visual diagramming canvas where you can:
1. Place process boxes, decision diamonds, and sticky notes.
2. Embed Linked Note Cards that open [[Welcome to NoteMesh]] or any other note directly upon clicking.
3. Connect elements with directional curved connectors.`,
    createdAt: Date.now() - 3600000 * 10,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note-plugin-arch',
    title: 'Plugin Architecture',
    tags: ['dev', 'plugins', 'architecture'],
    folder: 'Engineering',
    content: `# Plugin Architecture

NoteMesh is designed for modular community extensions.

### Extension Points:
- Custom Commands (registered into Command Palette)
- Status Bar indicators
- Themes and custom color tokens
- Import and Export adapters

See the documentation in docs/plugin-development.md to author custom extensions.`,
    createdAt: Date.now() - 3600000 * 8,
    updatedAt: Date.now() - 3600000 * 1,
  },
];

export const SAMPLE_CANVAS: CanvasDocument = {
  id: 'canvas-main',
  title: 'Project Architecture & Flow',
  gridEnabled: true,
  viewport: { x: 50, y: 50, zoom: 1 },
  createdAt: Date.now() - 3600000 * 12,
  updatedAt: Date.now() - 3600000 * 2,
  elements: [
    {
      id: 'el-1',
      type: 'note-card',
      x: 80,
      y: 120,
      width: 240,
      height: 120,
      linkedNoteId: 'note-welcome',
      linkedNoteTitle: 'Welcome to NoteMesh',
      text: 'Root workspace overview and entry point',
      color: '#3b82f6',
    },
    {
      id: 'el-2',
      type: 'rectangle',
      x: 400,
      y: 130,
      width: 180,
      height: 90,
      text: 'Markdown Parser & Wikilink Resolver',
      color: '#1e293b',
      strokeColor: '#3b82f6',
    },
    {
      id: 'el-3',
      type: 'diamond',
      x: 660,
      y: 125,
      width: 120,
      height: 100,
      text: 'Target Exists?',
      color: '#8b5cf6',
    },
    {
      id: 'el-4',
      type: 'sticky',
      x: 400,
      y: 280,
      width: 180,
      height: 140,
      text: 'Tip: Double-click shapes to edit text, drag connectors between nodes.',
      color: '#fef08a',
    },
    {
      id: 'el-5',
      type: 'connector',
      x: 320,
      y: 175,
      width: 80,
      height: 0,
      fromId: 'el-1',
      toId: 'el-2',
      fromPoint: { x: 320, y: 175 },
      toPoint: { x: 400, y: 175 },
    },
    {
      id: 'el-6',
      type: 'connector',
      x: 580,
      y: 175,
      width: 80,
      height: 0,
      fromId: 'el-2',
      toId: 'el-3',
      fromPoint: { x: 580, y: 175 },
      toPoint: { x: 660, y: 175 },
    },
  ],
};
