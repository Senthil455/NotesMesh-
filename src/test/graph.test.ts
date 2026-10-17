import { describe, it, expect } from 'vitest';
import { buildGraphData } from '../core/graph/graphBuilder';
import { Note } from '../core/domain/note';
import { GraphFilterConfig } from '../core/domain/graph';

describe('Knowledge Graph Builder', () => {
  const sampleNotes: Note[] = [
    {
      id: '1',
      title: 'Graph Theory',
      content: 'Refers to [[Algorithms]] and [[Topology]].',
      tags: ['math'],
      createdAt: 0,
      updatedAt: 0,
    },
    {
      id: '2',
      title: 'Algorithms',
      content: 'Core computer science.',
      tags: ['cs'],
      createdAt: 0,
      updatedAt: 0,
    },
    {
      id: '3',
      title: 'Orphan Note',
      content: 'Nothing links to this.',
      tags: [],
      createdAt: 0,
      updatedAt: 0,
    },
  ];

  const defaultConfig: GraphFilterConfig = {
    showTags: true,
    showOrphans: true,
    showMissingLinks: true,
    searchFilter: '',
    tagFilter: null,
    colorMode: 'type',
    linkDistance: 100,
    repelForce: 300,
    collisionRadius: 20,
  };

  it('generates nodes and edges connecting linked notes', () => {
    const data = buildGraphData(sampleNotes, defaultConfig);

    expect(data.nodes.length).toBeGreaterThanOrEqual(3);
    const edge = data.edges.find(e => e.source === '1' && e.target === '2');
    expect(edge).toBeDefined();
  });

  it('hides orphan nodes when showOrphans is false', () => {
    const configWithoutOrphans = { ...defaultConfig, showOrphans: false };
    const data = buildGraphData(sampleNotes, configWithoutOrphans);

    const orphanNode = data.nodes.find(n => n.id === '3');
    expect(orphanNode).toBeUndefined();
  });

  it('adds missing link nodes when showMissingLinks is true', () => {
    const data = buildGraphData(sampleNotes, defaultConfig);
    const missingNode = data.nodes.find(n => n.id === 'missing:topology');
    expect(missingNode).toBeDefined();
    expect(missingNode?.type).toBe('missing');
  });
});
