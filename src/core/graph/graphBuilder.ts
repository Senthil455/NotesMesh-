import { Note } from '../domain/note';
import { GraphData, GraphNode, GraphEdge, GraphFilterConfig } from '../domain/graph';
import { extractWikilinks, resolveWikilinks } from '../markdown/wikilinks';

const FOLDER_COLORS: Record<string, string> = {
  Research: '#8b5cf6', // purple
  Guides: '#10b981',   // emerald
  'Daily Notes': '#f59e0b', // amber
  Architecture: '#f43f5e', // rose
  General: '#3b82f6',  // blue
  Engineering: '#06b6d4', // cyan
  'Getting Started': '#3b82f6',
};

/**
 * Builds the graph dataset (nodes and edges) from the current list of notes.
 */
export function buildGraphData(
  notes: Note[],
  filterConfig: GraphFilterConfig
): GraphData {
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  // 1. Initialize note nodes
  for (const note of notes) {
    // Check search / tag filter
    if (filterConfig.searchFilter) {
      const q = filterConfig.searchFilter.toLowerCase();
      if (!note.title.toLowerCase().includes(q) && !note.content.toLowerCase().includes(q)) {
        continue;
      }
    }

    if (filterConfig.tagFilter && !note.tags.includes(filterConfig.tagFilter)) {
      continue;
    }

    let nodeColor = '#3b82f6';
    if (filterConfig.colorMode === 'folder') {
      const folderKey = note.folder || 'General';
      nodeColor = FOLDER_COLORS[folderKey] || '#3b82f6';
    } else if (filterConfig.colorMode === 'tag' && note.tags.length > 0) {
      // Deterministic color from primary tag name hash
      const tagStr = note.tags[0];
      const hues = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];
      let hash = 0;
      for (let i = 0; i < tagStr.length; i++) hash += tagStr.charCodeAt(i);
      nodeColor = hues[hash % hues.length];
    }

    nodesMap.set(note.id, {
      id: note.id,
      label: note.title,
      type: 'note',
      tags: note.tags,
      folder: note.folder || 'General',
      connectionsCount: 0,
      isOrphan: true,
      color: nodeColor,
      radius: 8,
    });
  }

  // 2. Extract and resolve wikilinks for each note
  for (const note of notes) {
    if (!nodesMap.has(note.id)) continue;

    const rawLinks = extractWikilinks(note.content, note.id);
    const resolvedLinks = resolveWikilinks(rawLinks, notes);

    for (const link of resolvedLinks) {
      if (link.targetNoteId && nodesMap.has(link.targetNoteId)) {
        // Edge between two existing notes
        const edgeId = `${note.id}->${link.targetNoteId}`;
        const reverseEdgeId = `${link.targetNoteId}->${note.id}`;

        if (!edgeSet.has(edgeId) && !edgeSet.has(reverseEdgeId)) {
          edgeSet.add(edgeId);
          edges.push({
            id: edgeId,
            source: note.id,
            target: link.targetNoteId,
          });

          // Increase connection counts
          const sourceNode = nodesMap.get(note.id);
          const targetNode = nodesMap.get(link.targetNoteId);
          if (sourceNode) {
            sourceNode.connectionsCount += 1;
            sourceNode.isOrphan = false;
          }
          if (targetNode) {
            targetNode.connectionsCount += 1;
            targetNode.isOrphan = false;
          }
        }
      } else if (!link.targetNoteId && filterConfig.showMissingLinks) {
        // Target doesn't exist yet: show as missing node if enabled
        const missingNodeId = `missing:${link.targetTitle.toLowerCase()}`;
        if (!nodesMap.has(missingNodeId)) {
          nodesMap.set(missingNodeId, {
            id: missingNodeId,
            label: link.targetTitle,
            type: 'missing',
            tags: [],
            connectionsCount: 1,
            isOrphan: false,
            color: '#f59e0b', // amber for missing
            radius: 6,
          });
        }

        const edgeId = `${note.id}->${missingNodeId}`;
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);
          edges.push({
            id: edgeId,
            source: note.id,
            target: missingNodeId,
          });

          const sourceNode = nodesMap.get(note.id);
          if (sourceNode) {
            sourceNode.connectionsCount += 1;
            sourceNode.isOrphan = false;
          }
        }
      }
    }
  }

  // 3. Filter orphan notes if toggle is off
  let nodes = Array.from(nodesMap.values());
  if (!filterConfig.showOrphans) {
    nodes = nodes.filter(n => !n.isOrphan);
  }

  // Scale node radius based on connection counts
  nodes.forEach(n => {
    n.radius = Math.min(18, Math.max(6, 6 + n.connectionsCount * 2));
  });

  return { nodes, edges };
}
