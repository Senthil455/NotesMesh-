import { NoteTemplate } from '../domain/template';

export const BUILT_IN_TEMPLATES: NoteTemplate[] = [
  {
    id: 'tpl-daily',
    name: 'Daily Note',
    description: 'Structure daily thoughts, priorities, logs, and evening reflection.',
    folder: 'Daily Notes',
    tags: ['daily-log', 'journal'],
    templateContent: ({ title, dateStr }) => `# ${title || `Daily Note - ${dateStr}`}

📅 **Date**: ${dateStr}
🔗 **Related**: [[Welcome to NoteMesh]], [[Project Roadmap]]

---

### 🎯 Primary Goals for Today
- [ ] Complete priority task 1
- [ ] Review pending pull requests
- [ ] Connect ideas across recent notes

### 📝 Scratchpad & Meeting Logs
- Notes from morning standup...
- Ideas discovered while exploring [[Knowledge Graph Guide]]

### 💡 Evening Reflection
- What went well today?
- Key takeaways or new concepts learned:
`,
  },
  {
    id: 'tpl-meeting',
    name: 'Meeting Minutes',
    description: 'Track attendees, discussion points, decisions, and action items.',
    folder: 'Meetings',
    tags: ['meeting', 'action-items'],
    templateContent: ({ title, dateStr }) => `# Meeting: ${title || 'Architecture Sync'}

📅 **Date**: ${dateStr}
👥 **Attendees**: @tejas, @community-contributor
🎯 **Objective**: Align on NoteMesh modular architecture and plugin API

---

### 📋 Agenda Items
1. Review open pull requests and contribution guidelines
2. Design discussions for canvas SVG export
3. Planning upcoming community roadmap milestones

### 💬 Discussion Points
- Discussed the separation between storage interfaces and UI components.
- Decided to support standard Markdown format to prevent user lock-in.

### ✅ Action Items
- [ ] @tejas: Merge initial foundation PR
- [ ] @contributor: Implement KaTeX math preview support
`,
  },
  {
    id: 'tpl-adr',
    name: 'Architecture Decision Record (ADR)',
    description: 'Document crucial architectural decisions, trade-offs, and consequences.',
    folder: 'Architecture',
    tags: ['architecture', 'adr', 'decision'],
    templateContent: ({ title, dateStr }) => `# ADR: ${title || 'Adopt IndexedDB Storage Abstraction'}

📅 **Date**: ${dateStr}
🚦 **Status**: Accepted
🏷️ **Deciders**: NoteMesh Core Architecture Team

---

### Context & Problem Statement
We need a storage mechanism that works locally in standard modern web browsers without requiring users to log in or configure cloud backends, while maintaining an approachable boundary for a future desktop filesystem adapter.

### Decision Outcome
We adopted an asynchronous \`StorageAdapter\` interface backed by local storage and IndexedDB.

### Consequences
- **Positive**: 100% offline functionality and zero telemetry.
- **Positive**: Direct migration path to Tauri/Rust filesystem access without altering UI components.
- **Negative**: Browser storage quotas require clear export/import backup tools.
`,
  },
  {
    id: 'tpl-research',
    name: 'Literature & Research Note',
    description: 'Capture core findings, citations, and bidirectional connections to your notes.',
    folder: 'Research',
    tags: ['research', 'literature', 'pkm'],
    templateContent: ({ title, dateStr }) => `# Research: ${title || 'Topic Exploration'}

📅 **Date**: ${dateStr}
📚 **Source / Reference**:
🔗 **Related Concepts**: [[Neural Networks]], [[Knowledge Graph Guide]]

---

### 📌 Core Thesis
Summary of the main argument or hypothesis in 2-3 sentences.

### 🔍 Key Findings & Evidence
1. Finding 1: Context and significance.
2. Finding 2: Experimental data or citations.

### 💡 Connections to Existing Workspace
- How does this connect to our current projects?
- What questions or follow-ups does this raise?
`,
  },
];
