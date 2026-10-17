/**
 * Core Domain Models for Notes in NoteMesh
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  folder?: string;
  tags: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  linkedNoteIds?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface NoteLink {
  sourceNoteId: string;
  targetTitle: string;
  targetNoteId?: string; // resolved Note ID, or undefined if missing link
  rawText: string;
}

export interface BacklinkItem {
  sourceNoteId: string;
  sourceNoteTitle: string;
  previewSnippet: string;
}

export interface NoteFilterOptions {
  searchQuery?: string;
  folder?: string;
  tag?: string;
  pinnedOnly?: boolean;
}
