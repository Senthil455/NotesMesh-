/**
 * NoteMesh Reusable Note Templates
 */

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  folder: string;
  tags: string[];
  templateContent: (context: { title: string; dateStr: string }) => string;
}
