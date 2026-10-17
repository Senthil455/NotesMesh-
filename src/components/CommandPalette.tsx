import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../core/domain/note';
import { ActiveTab } from './Navbar';
import { pluginManager, RegisteredCommand } from '../core/plugins/pluginManager';
import { 
  Search, 
  FileText, 
  Share2, 
  Layout, 
  FileSpreadsheet,
  Settings,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-surface dark:bg-[#111827] border border-border dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      >
        {/* Search input */}
        <div className="flex items-center px-4 py-3.5 border-b border-border dark:border-slate-800 space-x-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search notes or run commands..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="text-xs font-mono font-bold bg-surface-hover dark:bg-slate-800 border border-border dark:border-slate-700 px-2 py-0.5 rounded text-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-3">
          {/* Notes Group */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Notes
              </div>
              <div className="space-y-1 mt-1">
                {filteredNotes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onOpenNote(n.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm group transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Jump to note</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plugin Commands */}
          {filteredCommands.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Plugin Commands
              </div>
              <div className="space-y-1 mt-1">
                {filteredCommands.map(cmd => (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      cmd.handler();
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cmd.title}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-xs font-mono font-bold bg-surface-hover dark:bg-slate-800 border border-border dark:border-slate-700 px-2 py-0.5 rounded text-slate-300">
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
            <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation & Actions
            </div>
            <div className="space-y-1 mt-1">
              <div
                onClick={() => {
                  onNewNote();
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Create New Note</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('graph');
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Open Knowledge Graph</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('canvas');
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                <Layout className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Open Visual Canvas</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('templates');
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Open Note Templates</span>
              </div>

              <div
                onClick={() => {
                  onSelectTab('settings');
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Open Workspace Settings</span>
              </div>

              <div
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-surface-hover dark:hover:bg-slate-800 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
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
