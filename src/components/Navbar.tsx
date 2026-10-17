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
    <div className="w-full px-4 sm:px-6 pt-3 sm:pt-4 pb-2 shrink-0 z-30 select-none font-sans">
      <header className="h-16 px-4 sm:px-6 rounded-2xl bg-surface/95 dark:bg-[#0c101d]/95 backdrop-blur-xl border border-border/80 dark:border-slate-800 shadow-2xl shadow-black/20 flex items-center justify-between">
        {/* Brand & Main Navigation Tabs */}
        <div className="flex items-center space-x-6 sm:space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
                <span>NoteMesh</span>
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-800 text-indigo-300 border border-slate-700/80 rounded-md font-mono">
                  v0.1 OSS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Local-First Knowledge Workspace
              </p>
            </div>
          </div>

          {/* View Switcher: Notes, Knowledge Graph, Canvas, Templates, Settings */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-surface-hover/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-border dark:border-slate-800/80">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'canvas'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'templates'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/35 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </nav>
        </div>

        {/* Quick Search trigger */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-border dark:border-slate-800 bg-surface-hover/50 dark:bg-slate-900/60 hover:bg-surface-hover dark:hover:bg-slate-800 text-xs sm:text-sm text-slate-300 w-64 justify-between transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-slate-300">Quick search / notes...</span>
            </div>
            <kbd className="flex items-center text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">
              <Command className="w-3 h-3 mr-0.5" />K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNewNote}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Note</span>
          </button>

          <div className="h-6 w-[1px] bg-border dark:bg-slate-800 mx-1" />

          <button
            onClick={onOpenPlugins}
            title="Plugin Manager"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <Puzzle className="w-4 h-4" />
          </button>

          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            title="Open-Source Repository"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors hidden sm:block"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>
    </div>
  );
};
