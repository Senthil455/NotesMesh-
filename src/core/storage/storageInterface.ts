import { Note } from '../domain/note';
import { CanvasDocument } from '../domain/canvas';

export interface StorageAdapter {
  // Notes
  getNotes(): Promise<Note[]>;
  saveNote(note: Note): Promise<void>;
  deleteNote(id: string): Promise<void>;
  
  // Canvases
  getCanvases(): Promise<CanvasDocument[]>;
  saveCanvas(canvas: CanvasDocument): Promise<void>;
  deleteCanvas(id: string): Promise<void>;

  // Export / Import
  exportAll(): Promise<string>;
  importAll(jsonString: string): Promise<boolean>;
}
