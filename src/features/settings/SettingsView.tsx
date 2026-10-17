import React, { useRef } from 'react';
import { storage } from '../../core/storage/localStorageAdapter';
import { Note } from '../../core/domain/note';
import { CanvasDocument } from '../../core/domain/canvas';
import { 
  Settings, 
  Moon, 
  Sun, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Keyboard, 
  FileText, 
  Share2, 
  Layout, 
  HardDrive
} from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notes: Note[];
  canvases: CanvasDocument[];
  onDataReload: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  toggleDarkMode,
  notes,
  canvases,
  onDataReload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalWords = notes.reduce((acc, n) => {
    return acc + (n.content.trim() ? n.content.trim().split(/\s+/).length : 0);
  }, 0);

  const totalTags = Array.from(new Set(notes.flatMap(n => n.tags))).length;

  const handleExportJson = async () => {
    const data = await storage.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notemesh-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      const content = event.target?.result as string;
      const success = await storage.importAll(content);
      if (success) {
        alert('Workspace restored successfully.');
        onDataReload();
      } else {
        alert('Invalid NoteMesh workspace JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to reset all data back to the default workspace? All custom notes will be removed.')) {
      localStorage.clear();
      onDataReload();
    }
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] bg-background overflow-y-auto p-8 select-none">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2.5 text-primary font-bold text-xl">
            <Settings className="w-5 h-5" />
            <span>Workspace Settings</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Configure appearance, review local storage metrics, and manage backups.
          </p>
        </div>

        {/* Workspace Health & Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex items-center space-x-2 text-primary text-xs font-semibold">
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {notes.length}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Markdown files</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex items-center space-x-2 text-purple-500 text-xs font-semibold">
              <Share2 className="w-4 h-4" />
              <span>Word Count</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {totalWords.toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Total written words</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex items-center space-x-2 text-cyan-500 text-xs font-semibold">
              <Layout className="w-4 h-4" />
              <span>Canvases</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {canvases.length}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Visual boards</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-surface shadow-sm">
            <div className="flex items-center space-x-2 text-emerald-500 text-xs font-semibold">
              <HardDrive className="w-4 h-4" />
              <span>Tags</span>
            </div>
            <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-gray-100">
              {totalTags}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Active categories</p>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Appearance & Themes
          </h3>
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface-hover/30">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {isDarkMode ? 'Dark Theme (Default)' : 'Light Theme'}
                </span>
                <p className="text-[11px] text-gray-400">
                  Carefully tuned dark palette with high-contrast text and subtle slate borders.
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-primary transition-colors"
            >
              Switch Theme
            </button>
          </div>
        </div>

        {/* Local Storage & Data Management */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Local Storage & Portability
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            All notes, relationships, and canvas layouts are stored entirely on your local machine using browser-managed persistence. No account, no cloud transmission.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExportJson}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors"
            >
              <Download className="w-4 h-4 text-primary" />
              <span>Export Full Workspace (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center space-x-2 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-500" />
              <span>Import Workspace Backup (JSON)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetData}
              className="flex items-center justify-center space-x-2 p-2.5 w-full rounded-lg text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Workspace Content</span>
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="p-6 rounded-xl border border-border bg-surface space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Keyboard Shortcuts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-surface-hover/30 border border-border">
              <span className="text-gray-700 dark:text-gray-300">Command Palette / Quick Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-gray-400">Ctrl + K</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-hover/30 border border-border">
              <span className="text-gray-700 dark:text-gray-300">Export Active Note as Markdown</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-gray-400">Ctrl + Shift + E</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-hover/30 border border-border">
              <span className="text-gray-700 dark:text-gray-300">Copy Table of Contents</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-gray-400">Ctrl + Shift + T</kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-surface-hover/30 border border-border">
              <span className="text-gray-700 dark:text-gray-300">Canvas Undo / Redo</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-gray-400">Ctrl + Z / Y</kbd>
            </div>
          </div>
        </div>

        {/* Privacy & Governance Badge */}
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-gray-500 flex items-start space-x-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Open-Source & Local-First Commitment
            </span>
            <p className="text-[11px] text-gray-400 mt-0.5">
              NoteMesh does not require accounts, cookies, or cloud servers. Built in alignment with open-source ethics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
