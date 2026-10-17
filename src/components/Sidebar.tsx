import React, { useState, useRef } from 'react';
import { Note } from '../core/domain/note';
import { 
  FileText, 
  Pin, 
  Trash2, 
  Tag as TagIcon, 
  Folder, 
  ChevronRight, 
  ChevronDown,
  Search,
  Plus,
  Calendar,
  Upload
} from 'lucide-react';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: (folder?: string) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onOpenDailyNote: () => void;
  onImportMarkdown: (title: string, content: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onTogglePin,
  selectedTag,
  onSelectTag,
  onOpenDailyNote,
  onImportMarkdown,
}) => {
  const [search, setSearch] = useState('');
  const [foldersOpen, setFoldersOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags))).sort();

  // Extract folders
  const allFolders = Array.from(
    new Set(notes.map(n => n.folder || 'General'))
  ).sort();

  // Filter notes based on search & selected tag
  const filteredNotes = notes.filter(n => {
    const matchesSearch = 
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag ? n.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const title = file.name.replace(/\.[^/.]+$/, '');
      onImportMarkdown(title, content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Explorer
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import Markdown (.md)"
              className="p-1 hover:bg-surface-hover rounded text-gray-500 hover:text-primary transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => onNewNote()}
              title="Create Note"
              className="p-1 hover:bg-surface-hover rounded text-gray-500 hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions (Daily Note) */}
        <button
          onClick={onOpenDailyNote}
          className="w-full flex items-center justify-center space-x-2 py-1.5 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-primary border border-blue-500/20 text-xs font-medium transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Today's Daily Note</span>
        </button>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-2 py-1 text-xs rounded-md bg-surface-hover/70 border border-border focus:outline-none focus:border-primary text-gray-800 dark:text-gray-200 placeholder:text-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Note List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <div>
            <div className="flex items-center space-x-1 px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <Pin className="w-3 h-3 text-amber-500" />
              <span>Pinned</span>
            </div>
            <div className="space-y-0.5 mt-1">
              {pinnedNotes.map(note => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onSelect={() => onSelectNote(note.id)}
                  onDelete={() => onDeleteNote(note.id)}
                  onTogglePin={() => onTogglePin(note.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Folders & All Notes Section */}
        <div>
          <div 
            onClick={() => setFoldersOpen(!foldersOpen)}
            className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
          >
            <div className="flex items-center space-x-1">
              {foldersOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <Folder className="w-3 h-3" />
              <span>Folders & Notes ({filteredNotes.length})</span>
            </div>
          </div>

          {foldersOpen && (
            <div className="space-y-2 mt-1">
              {allFolders.map(folderName => {
                const folderNotes = filteredNotes.filter(
                  n => (n.folder || 'General') === folderName && !n.isPinned
                );
                if (folderNotes.length === 0) return null;

                return (
                  <div key={folderName} className="space-y-0.5">
                    <div className="flex items-center space-x-1 px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase">
                      <Folder className="w-2.5 h-2.5 text-amber-500/70" />
                      <span>{folderName} ({folderNotes.length})</span>
                    </div>
                    {folderNotes.map(note => (
                      <NoteListItem
                        key={note.id}
                        note={note}
                        isActive={note.id === activeNoteId}
                        onSelect={() => onSelectNote(note.id)}
                        onDelete={() => onDeleteNote(note.id)}
                        onTogglePin={() => onTogglePin(note.id)}
                      />
                    ))}
                  </div>
                );
              })}

              {filteredNotes.length === 0 && (
                <div className="text-center py-6 px-4">
                  <p className="text-xs text-gray-400">No notes found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div 
              onClick={() => setTagsOpen(!tagsOpen)}
              className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
            >
              <div className="flex items-center space-x-1">
                {tagsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                <TagIcon className="w-3 h-3 text-cyan-500" />
                <span>Tags ({allTags.length})</span>
              </div>
            </div>

            {tagsOpen && (
              <div className="flex flex-wrap gap-1 px-2 mt-1">
                {selectedTag && (
                  <button
                    onClick={() => onSelectTag(null)}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-white font-medium hover:bg-primary-hover"
                  >
                    Clear Filter ✕
                  </button>
                )}
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                      tag === selectedTag
                        ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40 font-semibold'
                        : 'bg-surface-hover/60 text-gray-600 dark:text-gray-400 border-border hover:border-gray-400'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-border text-[11px] text-gray-400 flex items-center justify-between">
        <span>Local Storage: Active</span>
        <span className="font-mono text-[10px]">{notes.length} notes</span>
      </div>
    </aside>
  );
};

interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

const NoteListItem: React.FC<NoteListItemProps> = ({
  note,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-surface-hover'
      }`}
    >
      <div className="flex items-center space-x-2 truncate min-w-0">
        <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
        <span className="truncate">{note.title || 'Untitled'}</span>
      </div>

      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => {
            e.stopPropagation();
            onTogglePin();
          }}
          title={note.isPinned ? 'Unpin' : 'Pin note'}
          className="p-1 hover:text-amber-500 text-gray-400"
        >
          <Pin className={`w-3 h-3 ${note.isPinned ? 'fill-amber-500 text-amber-500' : ''}`} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete note"
          className="p-1 hover:text-rose-500 text-gray-400"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
