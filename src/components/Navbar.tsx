import React from 'react';
import { 
  FileText, 
  Share2, 
  Layout, 
  FileSpreadsheet,
  Settings,
  Search, 
  Plus, 
  Sun, 
  Moon, 
  Puzzle, 
  Github,
  Command
} from 'lucide-react';

export type ActiveTab = 'notes' | 'graph' | 'canvas' | 'templates' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNewNote: () => void;
  onOpenCommandPalette: () => void;
  onOpenPlugins: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  onNewNote,
  onOpenCommandPalette,
  onOpenPlugins,
}) => {
  return (
    <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between select-none z-20">
      {/* Brand & 5 Main Navigation Tabs */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight flex items-center gap-1.5">
              <span>NoteMesh</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-primary/10 text-primary border border-primary/20 rounded">
                v0.1 OSS
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
              Local-First Knowledge Workspace
            </p>
          </div>
        </div>

        {/* View Switcher: Notes, Knowledge Graph, Canvas, Templates, Settings */}
        <nav className="flex items-center space-x-1 bg-surface-hover/80 p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'graph'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'canvas'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'templates'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Middle: Quick Switcher / Search Trigger */}
      <div className="hidden lg:flex items-center">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-border bg-surface-hover/50 hover:bg-surface-hover text-xs text-gray-500 dark:text-gray-400 w-64 justify-between transition-colors shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5" />
            <span>Quick search / notes...</span>
          </div>
          <kbd className="flex items-center text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded font-mono text-gray-400">
            <Command className="w-2.5 h-2.5 mr-0.5" />K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onNewNote}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Note</span>
        </button>

        <div className="h-5 w-[1px] bg-border mx-1" />

        <button
          onClick={onOpenPlugins}
          title="Plugin Manager"
          className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <Puzzle className="w-4 h-4" />
        </button>

        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-surface-hover transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          title="Open-Source Repository"
          className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 rounded-lg hover:bg-surface-hover transition-colors hidden sm:block"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
