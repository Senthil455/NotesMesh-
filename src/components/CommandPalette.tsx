import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../core/domain/note';
import { ActiveTab } from './Navbar';
import { pluginManager, RegisteredCommand } from '../core/plugins/pluginManager';
import { 
  Search, 
  FileText, 
  Share2, 
  Layout, 
  Plus, 
  Terminal, 
  Sun, 
  Moon 
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  onOpenNote: (noteId: string) => void;
  onNewNote: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  notes,
  onOpenNote,
  onNewNote,
  onSelectTab,
  onToggleTheme,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [pluginCommands, setPluginCommands] = useState<RegisteredCommand[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setPluginCommands(pluginManager.getCommands());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredCommands = pluginCommands.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-border space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes or run commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
          />
          <kbd className="text-[10px] bg-surface-hover border border-border px-1.5 py-0.5 rounded text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Notes Group */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Notes
              </div>
              <div className="space-y-0.5">
                {filteredNotes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onOpenNote(n.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs group"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{n.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Jump to note</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plugin Commands */}
          {filteredCommands.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Plugin Commands
              </div>
              <div className="space-y-0.5">
                {filteredCommands.map(cmd => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.handler();
                      onClose();
                    }}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-cyan-500" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">{cmd.title}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] font-mono bg-surface-hover border border-border px-1.5 py-0.5 rounded text-gray-400">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core System Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Navigation & Actions
            </div>
            <div className="space-y-0.5">
              <div
                onClick={() => {
                  onNewNote();
                  onClose();
                }}
                className="flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">Create New Note</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('graph');
                  onClose();
                }}
                className="flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
              >
                <Share2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Open Knowledge Graph</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('canvas');
                  onClose();
                }}
                className="flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
              >
                <Layout className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Open Visual Canvas</span>
              </div>

              <div
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className="flex items-center space-x-2 px-2.5 py-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                <span className="font-medium">
                  {isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
