# NoteMesh Data Format Specification 📄

NoteMesh is committed to data transparency, local ownership, and open standards.

---

## 1. Note Format

Notes are authored in standard GitHub Flavored Markdown (GFM) with wikilink extensions:
- **Wikilinks**: `[[Target Note]]` or `[[Target Note|Custom Display Text]]`
- **Tags**: `#productivity`, `#deep-learning`
- **Metadata**: Embedded in the note domain model:

```json
{
  "id": "note-12345",
  "title": "Neural Networks",
  "content": "# Neural Networks\n\nConnected to [[Knowledge Graph Guide]].",
  "folder": "Research",
  "tags": ["ai", "deep-learning"],
  "isPinned": false,
  "isFavorite": true,
  "createdAt": 1729140000000,
  "updatedAt": 1729143600000
}
```

---

## 2. Canvas Document Format

Canvas drawings and diagrams are stored separately in structured JSON:

```json
{
  "id": "canvas-main",
  "title": "Project Architecture & Flow",
  "gridEnabled": true,
  "viewport": {
    "x": 50,
    "y": 50,
    "zoom": 1.0
  },
  "elements": [
    {
      "id": "el-1",
      "type": "note-card",
      "x": 80,
      "y": 120,
      "width": 240,
      "height": 120,
      "linkedNoteId": "note-12345",
      "linkedNoteTitle": "Neural Networks",
      "text": "Card preview snippet",
      "color": "#3b82f6"
    },
    {
      "id": "el-2",
      "type": "rectangle",
      "x": 400,
      "y": 130,
      "width": 180,
      "height": 90,
      "text": "Process Step",
      "color": "#1e293b",
      "strokeColor": "#3b82f6"
    },
    {
      "id": "el-3",
      "type": "connector",
      "x": 320,
      "y": 175,
      "width": 80,
      "height": 0,
      "fromId": "el-1",
      "toId": "el-2",
      "fromPoint": { "x": 320, "y": 175 },
      "toPoint": { "x": 400, "y": 175 }
    }
  ]
}
```

---

## 3. Full Workspace Export / Import

The complete workspace can be exported or imported as a single portable JSON file from **Settings > Export JSON**.
