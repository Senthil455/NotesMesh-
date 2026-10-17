import React, { useState, useRef } from 'react';
import { Note, BacklinkItem } from '../../core/domain/note';
import { MarkdownPreview } from './MarkdownPreview';
import { BacklinksPanel } from './BacklinksPanel';
import { BUILT_IN_TEMPLATES } from '../../core/templates/builtInTemplates';
import { 
  Columns, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Link, 
  List, 
  Code, 
  Tag as TagIcon,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Folder
} from 'lucide-react';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (updated: Note) => void;
  allNotes: Note[];
  backlinks: BacklinkItem[];
  onNavigateNote: (noteIdOrTitle: string) => void;
}

type EditorViewMode = 'split' | 'edit' | 'preview';

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  allNotes,
  backlinks,
  onNavigateNote,
}) => {
  const [viewMode, setViewMode] = useState<EditorViewMode>('split');
  const [newTagInput, setNewTagInput] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const existingTitles = new Set(allNotes.map(n => n.title.toLowerCase().trim()));

  const handleTitleChange = (newTitle: string) => {
    onUpdateNote({ ...note, title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    onUpdateNote({ ...note, content: newContent });
  };

  const handleFolderChange = (folder: string) => {
    onUpdateNote({ ...note, folder });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim().replace(/^#/, '');
      if (!note.tags.includes(clean)) {
        onUpdateNote({ ...note, tags: [...note.tags, clean] });
      }
      setNewTagInput('');
      setIsTagInputOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateNote({ ...note, tags: note.tags.filter(t => t !== tagToRemove) });
  };

  const handleApplyTemplate = (templateId: string) => {
    const tpl = BUILT_IN_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;

    const dateStr = new Date().toISOString().slice(0, 10);
    const generated = tpl.templateContent({
      title: note.title,
      dateStr,
    });

    // Merge tags and folder
    const mergedTags = Array.from(new Set([...note.tags, ...tpl.tags]));
    onUpdateNote({
      ...note,
      content: generated,
      folder: tpl.folder,
      tags: mergedTags,
    });
    setIsTemplateMenuOpen(false);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([note.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.trim().replace(/[^\w\s-]/g, '') || 'note'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper for inserting markdown formatting
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const nextContent = text.substring(0, start) + replacement + text.substring(end);

    handleContentChange(nextContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 0);
  };

  const handleWikilinkNavigation = (targetTitle: string) => {
    const found = allNotes.find(
      n => n.title.toLowerCase().trim() === targetTitle.toLowerCase().trim()
    );
    if (found) {
      onNavigateNote(found.id);
    } else {
      if (confirm(`Note "${targetTitle}" does not exist yet. Would you like to create it?`)) {
        onNavigateNote(targetTitle);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-background overflow-hidden">
      {/* Note Header / Meta Bar */}
      <div className="px-6 pt-4 pb-2 border-b border-border bg-surface shrink-0">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={note.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Untitled Note..."
            className="text-2xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 w-full"
          />

          <div className="flex items-center space-x-3 shrink-0">
            {/* Template Inserter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-surface-hover hover:bg-border text-xs font-medium text-gray-700 dark:text-gray-300 border border-border transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />
                <span>Templates</span>
              </button>

              {isTemplateMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-surface border border-border rounded-xl shadow-xl p-1 z-30 space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase">
                    Insert Template
                  </div>
                  {BUILT_IN_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => handleApplyTemplate(tpl.id)}
                      className="w-full text-left p-2 rounded-lg hover:bg-surface-hover text-xs transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{tpl.name}</span>
                      <span className="text-[10px] text-gray-400">{tpl.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Download Note Button */}
            <button
              onClick={handleDownloadMarkdown}
              title="Download Note as .md"
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-surface-hover transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Save indicator */}
            <div className="flex items-center space-x-1 text-[11px] text-emerald-500 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved locally</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface-hover p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setViewMode('edit')}
                title="Edit Only"
                className={`p-1.5 rounded ${viewMode === 'edit' ? 'bg-surface text-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                title="Split View (Editor + Live Preview)"
                className={`p-1.5 rounded ${viewMode === 'split' ? 'bg-surface text-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                title="Preview Only"
                className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-surface text-primary shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Folder and Tags row */}
        <div className="flex items-center flex-wrap gap-2 mt-2.5 text-xs">
          {/* Folder badge */}
          <div className="flex items-center space-x-1 text-gray-500 bg-surface-hover px-2 py-0.5 rounded-md border border-border">
            <Folder className="w-3 h-3 text-amber-500" />
            <input
              type="text"
              value={note.folder || 'General'}
              onChange={e => handleFolderChange(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-[11px] font-medium text-gray-700 dark:text-gray-300 w-24"
              placeholder="Folder..."
            />
          </div>

          <div className="h-3 w-[1px] bg-border" />

          {/* Tags */}
          <TagIcon className="w-3 h-3 text-gray-400" />
          {note.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-rose-500 font-bold"
              >
                ×
              </button>
            </span>
          ))}

          {isTagInputOpen ? (
            <input
              type="text"
              autoFocus
              placeholder="Tag name (hit Enter)..."
              value={newTagInput}
              onChange={e => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              onBlur={() => setIsTagInputOpen(false)}
              className="text-[11px] px-2 py-0.5 rounded bg-surface-hover border border-border focus:outline-none focus:border-primary"
            />
          ) : (
            <button
              onClick={() => setIsTagInputOpen(true)}
              className="text-[11px] text-gray-400 hover:text-primary transition-colors"
            >
              + add tag
            </button>
          )}

          <div className="ml-auto text-[11px] text-gray-400 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Updated {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Formatting Toolbar */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className="flex items-center space-x-1 pt-2 mt-2 border-t border-border/60">
            <button
              onClick={() => insertFormatting('**', '**')}
              title="Bold"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('*', '*')}
              title="Italic"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('# ')}
              title="Heading 1"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('## ')}
              title="Heading 2"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('[[', ']]')}
              title="Insert Wikilink [[Note]]"
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded hover:bg-surface-hover text-primary font-mono text-xs font-semibold"
            >
              <Link className="w-3.5 h-3.5" />
              <span>[[]]</span>
            </button>
            <button
              onClick={() => insertFormatting('- ')}
              title="Bullet List"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertFormatting('```\n', '\n```')}
              title="Code Block"
              className="p-1 rounded hover:bg-surface-hover text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor & Preview Pane Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Editor */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div className={`flex flex-col h-full ${viewMode === 'split' ? 'w-1/2 border-r border-border' : 'w-full'}`}>
            <textarea
              ref={textareaRef}
              value={note.content}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="Write your note in Markdown... Use [[Wikilinks]] to link to other notes!"
              className="flex-1 p-6 bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed resize-none focus:outline-none overflow-y-auto selection:bg-primary/20"
            />
          </div>
        )}

        {/* Right Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`flex flex-col h-full bg-surface-hover/20 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <MarkdownPreview
              content={note.content}
              existingTitles={existingTitles}
              onNavigateWikilink={handleWikilinkNavigation}
            />
          </div>
        )}
      </div>

      {/* Backlinks Panel at the Bottom */}
      <BacklinksPanel
        backlinks={backlinks}
        onOpenNote={onNavigateNote}
      />
    </div>
  );
};
