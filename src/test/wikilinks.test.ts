import { describe, it, expect } from 'vitest';
import { 
  extractWikilinks, 
  extractTags, 
  resolveWikilinks, 
  buildBacklinks 
} from '../core/markdown/wikilinks';
import { Note } from '../core/domain/note';

describe('Wikilinks Parser & Backlink Resolver', () => {
  it('extracts standard and aliased wikilinks', () => {
    const text = 'Check out [[Neural Networks]] and [[Deep Learning|DL Architecture]].';
    const links = extractWikilinks(text, 'note-1');

    expect(links).toHaveLength(2);
    expect(links[0].targetTitle).toBe('Neural Networks');
    expect(links[1].targetTitle).toBe('Deep Learning');
  });

  it('extracts hashtags from content', () => {
    const text = 'This note covers #machine-learning, #ai, and #deep_learning.';
    const tags = extractTags(text);

    expect(tags).toContain('machine-learning');
    expect(tags).toContain('ai');
    expect(tags).toContain('deep_learning');
  });

  it('resolves existing note targets and marks missing ones', () => {
    const mockNotes: Note[] = [
      {
        id: 'note-1',
        title: 'Neural Networks',
        content: '',
        tags: [],
        createdAt: 0,
        updatedAt: 0,
      },
    ];

    const links = [
      { sourceNoteId: 'note-2', targetTitle: 'Neural Networks', rawText: '[[Neural Networks]]' },
      { sourceNoteId: 'note-2', targetTitle: 'Quantum Computing', rawText: '[[Quantum Computing]]' },
    ];

    const resolved = resolveWikilinks(links, mockNotes);

    expect(resolved[0].targetNoteId).toBe('note-1');
    expect(resolved[1].targetNoteId).toBeUndefined(); // Missing link target
  });

  it('builds backlinks for a given note', () => {
    const noteA: Note = {
      id: 'a',
      title: 'Note A',
      content: 'Here is a reference to [[Note B]] in my research.',
      tags: [],
      createdAt: 0,
      updatedAt: 0,
    };

    const noteB: Note = {
      id: 'b',
      title: 'Note B',
      content: 'Some standalone thoughts.',
      tags: [],
      createdAt: 0,
      updatedAt: 0,
    };

    const backlinks = buildBacklinks(noteB, [noteA, noteB]);
    expect(backlinks).toHaveLength(1);
    expect(backlinks[0].sourceNoteId).toBe('a');
    expect(backlinks[0].sourceNoteTitle).toBe('Note A');
    expect(backlinks[0].previewSnippet).toContain('Note B');
  });
});
