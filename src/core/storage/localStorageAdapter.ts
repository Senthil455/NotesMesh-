import { Note } from '../domain/note';
import { CanvasDocument } from '../domain/canvas';
import { StorageAdapter } from './storageInterface';
import { SAMPLE_NOTES, SAMPLE_CANVAS } from './sampleData';

const NOTES_KEY = 'notemesh_notes_v4';
const CANVASES_KEY = 'notemesh_canvases_v4';

export function stripAllEmojis(text: string): string {
  if (!text) return '';
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\uFE00-\uFE0F\u200D]/g, '');
}

function cleanNote(note: Note): Note {
  return {
    ...note,
    title: stripAllEmojis(note.title) || 'Untitled Note',
    content: note.content
      ? note.content
          .split('\n')
          .map(line => stripAllEmojis(line))
          .join('\n')
      : '',
  };
}

export class LocalStorageAdapter implements StorageAdapter {
  async getNotes(): Promise<Note[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('notemesh_notes_v1');
        localStorage.removeItem('notemesh_notes_v2');
        localStorage.removeItem('notemesh_notes_v3');
      }

      const data = localStorage.getItem(NOTES_KEY);
      if (!data) {
        const cleaned = SAMPLE_NOTES.map(cleanNote);
        await this.setNotes(cleaned);
        return cleaned;
      }
      const parsed = JSON.parse(data) as Note[];
      return parsed.map(cleanNote);
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
      return SAMPLE_NOTES.map(cleanNote);
    }
  }

  private async setNotes(notes: Note[]): Promise<void> {
    const cleaned = notes.map(cleanNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(cleaned));
  }

  async saveNote(note: Note): Promise<void> {
    const notes = await this.getNotes();
    const cleaned = cleanNote(note);
    const index = notes.findIndex(n => n.id === cleaned.id);
    if (index >= 0) {
      notes[index] = { ...cleaned, updatedAt: Date.now() };
    } else {
      notes.unshift({ ...cleaned, createdAt: Date.now(), updatedAt: Date.now() });
    }
    await this.setNotes(notes);
  }

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    await this.setNotes(filtered);
  }

  async getCanvases(): Promise<CanvasDocument[]> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('notemesh_canvases_v1');
        localStorage.removeItem('notemesh_canvases_v2');
        localStorage.removeItem('notemesh_canvases_v3');
      }

      const data = localStorage.getItem(CANVASES_KEY);
      if (!data) {
        await this.setCanvases([SAMPLE_CANVAS]);
        return [SAMPLE_CANVAS];
      }
      return JSON.parse(data) as CanvasDocument[];
    } catch (e) {
      console.error('Failed to load canvases', e);
      return [SAMPLE_CANVAS];
    }
  }

  private async setCanvases(canvases: CanvasDocument[]): Promise<void> {
    localStorage.setItem(CANVASES_KEY, JSON.stringify(canvases));
  }

  async saveCanvas(canvas: CanvasDocument): Promise<void> {
    const canvases = await this.getCanvases();
    const index = canvases.findIndex(c => c.id === canvas.id);
    if (index >= 0) {
      canvases[index] = { ...canvas, updatedAt: Date.now() };
    } else {
      canvases.unshift({ ...canvas, createdAt: Date.now(), updatedAt: Date.now() });
    }
    await this.setCanvases(canvases);
  }

  async deleteCanvas(id: string): Promise<void> {
    const canvases = await this.getCanvases();
    const filtered = canvases.filter(c => c.id !== id);
    await this.setCanvases(filtered);
  }

  async exportAll(): Promise<string> {
    const notes = await this.getNotes();
    const canvases = await this.getCanvases();
    return JSON.stringify({
      version: '4.0.0',
      exportedAt: new Date().toISOString(),
      notes,
      canvases,
    }, null, 2);
  }

  async importAll(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.notes)) {
        await this.setNotes(data.notes);
      }
      if (Array.isArray(data.canvases)) {
        await this.setCanvases(data.canvases);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
}

export const storage = new LocalStorageAdapter();
