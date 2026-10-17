import { NoteTemplate } from '../domain/template';

export const BUILT_IN_TEMPLATES: NoteTemplate[] = [
  {
    id: 'tpl-daily',
    name: 'Daily Note',
    description: 'Structure daily priorities, meeting notes, work logs, and reflections.',
    folder: 'Daily Notes',
    tags: ['daily-log', 'journal'],
    templateContent: ({ title, dateStr }) => `# ${title || `Daily Note - ${dateStr}`}

**Date**: ${dateStr}
**Related**: [[Welcome to NoteMesh]]

---

### Primary Objectives
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Work Logs & Discussions
- Standup discussion notes...
- Technical observations...

### Review & Summary
- Key accomplishments:
- Next steps for tomorrow:
`,
  },
  {
    id: 'tpl-meeting',
    name: 'Meeting Minutes',
    description: 'Document meeting participants, agenda, discussion points, and action items.',
    folder: 'Meetings',
    tags: ['meeting', 'action-items'],
    templateContent: ({ title, dateStr }) => `# Meeting: ${title || 'Architecture Review'}

**Date**: ${dateStr}
**Participants**: @team
**Objective**: Synchronize on project architecture and deliverables

---

### Agenda
1. Review open pull requests and code style guidelines
2. Design discussions for canvas diagramming
3. Review upcoming milestone roadmap

### Discussion Notes
- Architectural boundaries between storage and UI layers.
- Extension interface security and manifest permissions.

### Action Items
- [ ] Implement task item
- [ ] Review documentation
`,
  },
  {
    id: 'tpl-adr',
    name: 'Architecture Decision Record (ADR)',
    description: 'Record architectural decisions, design context, and technical trade-offs.',
    folder: 'Architecture',
    tags: ['architecture', 'adr', 'decision'],
    templateContent: ({ title, dateStr }) => `# ADR: ${title || 'Adopt IndexedDB Storage Abstraction'}

**Date**: ${dateStr}
**Status**: Accepted
**Deciders**: Architecture Team

---

### Context & Problem Statement
Provide a local-first persistence layer that functions offline across modern browsers without mandatory cloud accounts, while allowing an eventual desktop filesystem adapter.

### Decision Outcome
Implemented a generic StorageAdapter interface backed by browser storage.

### Consequences
- Positive: Total data sovereignty and offline availability.
- Positive: Seamless migration path to desktop filesystem adapters.
- Negative: Requires in-app export tools for workspace backups.
`,
  },
  {
    id: 'tpl-research',
    name: 'Literature & Research Note',
    description: 'Capture core findings, citations, and bidirectional connections to your notes.',
    folder: 'Research',
    tags: ['research', 'literature', 'pkm'],
    templateContent: ({ title, dateStr }) => `# Research: ${title || 'Topic Exploration'}

**Date**: ${dateStr}
**Reference**:
**Related Notes**: [[Neural Networks]], [[Knowledge Graph Guide]]

---

### Core Thesis
Summary of the central concept or hypothesis.

### Key Observations
1. Observation 1
2. Observation 2

### Workspace Integration
- Relationship to ongoing projects
- Open questions for follow-up
`,
  },
];
