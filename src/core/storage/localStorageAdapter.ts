import { Note } from '../domain/note';
import { CanvasDocument } from '../domain/canvas';
import { StorageAdapter } from './storageInterface';
import { SAMPLE_NOTES, SAMPLE_CANVAS } from './sampleData';

const NOTES_KEY = 'notemesh_notes_v1';
const CANVASES_KEY = 'notemesh_canvases_v1';

export class LocalStorageAdapter implements StorageAdapter {
  async getNotes(): Promise<Note[]> {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      if (!data) {
        // Initialize with rich sample data
        await this.setNotes(SAMPLE_NOTES);
        return SAMPLE_NOTES;
      }
      return JSON.parse(data) as Note[];
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
      return SAMPLE_NOTES;
    }
  }

  private async setNotes(notes: Note[]): Promise<void> {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }

  async saveNote(note: Note): Promise<void> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = { ...note, updatedAt: Date.now() };
    } else {
      notes.unshift({ ...note, createdAt: Date.now(), updatedAt: Date.now() });
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
      version: '1.0.0',
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
