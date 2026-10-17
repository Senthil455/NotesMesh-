import React from 'react';
import { GraphFilterConfig } from '../../core/domain/graph';
import { Sliders, Filter, Sparkles, RefreshCw, Palette, Search } from 'lucide-react';

interface GraphControlsProps {
  config: GraphFilterConfig;
  onChangeConfig: (newConfig: GraphFilterConfig) => void;
  onResetSimulation: () => void;
  availableTags: string[];
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  config,
  onChangeConfig,
  onResetSimulation,
  availableTags,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-surface/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg select-none text-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center space-x-1.5 font-semibold text-gray-800 dark:text-gray-200">
          <Sliders className="w-3.5 h-3.5 text-primary" />
          <span>Graph Settings</span>
        </div>
        <button
          onClick={onResetSimulation}
          title="Reheat Simulation"
          className="p-1 hover:bg-surface-hover rounded text-gray-400 hover:text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Real-time search inside graph */}
      <div className="relative">
        <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search in graph..."
          value={config.searchFilter}
          onChange={e => onChangeConfig({ ...config, searchFilter: e.target.value })}
          className="w-full pl-7 pr-2 py-1 text-xs rounded bg-surface-hover border border-border focus:outline-none focus:border-primary text-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Color Mode Selector (from reference image) */}
      <div>
        <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          <Palette className="w-3 h-3 text-purple-400" />
          <span>Color Scheme</span>
        </div>
        <select
          value={config.colorMode}
          onChange={e => onChangeConfig({ ...config, colorMode: e.target.value as 'type' | 'folder' | 'tag' })}
          className="w-full text-xs bg-surface-hover border border-border rounded p-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary font-medium"
        >
          <option value="type">Color by Node Type</option>
          <option value="folder">Color by Folder</option>
          <option value="tag">Color by Tag</option>
        </select>
      </div>

      {/* Filters */}
      <div className="space-y-2 pt-1 border-t border-border">
        <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <Filter className="w-3 h-3" />
          <span>Visibility</span>
        </div>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-700 dark:text-gray-300">Show Orphans</span>
          <input
            type="checkbox"
            checked={config.showOrphans}
            onChange={e => onChangeConfig({ ...config, showOrphans: e.target.checked })}
            className="rounded border-border text-primary focus:ring-primary"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-gray-700 dark:text-gray-300">Show Missing [[Links]]</span>
          <input
            type="checkbox"
            checked={config.showMissingLinks}
            onChange={e => onChangeConfig({ ...config, showMissingLinks: e.target.checked })}
            className="rounded border-border text-primary focus:ring-primary"
          />
        </label>

        {availableTags.length > 0 && (
          <div className="pt-1">
            <label className="block text-gray-500 text-[10px] uppercase font-semibold mb-1">
              Filter by Tag
            </label>
            <select
              value={config.tagFilter || ''}
              onChange={e => onChangeConfig({ ...config, tagFilter: e.target.value || null })}
              className="w-full text-xs bg-surface-hover border border-border rounded p-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-primary"
            >
              <option value="">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Physical Forces Sliders */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-center space-x-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <span>Forces</span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>Repel Force</span>
            <span>{config.repelForce}</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="50"
            value={config.repelForce}
            onChange={e => onChangeConfig({ ...config, repelForce: Number(e.target.value) })}
            className="w-full accent-primary h-1 bg-surface-hover rounded"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>Link Distance</span>
            <span>{config.linkDistance}px</span>
          </div>
          <input
            type="range"
            min="40"
            max="250"
            step="10"
            value={config.linkDistance}
            onChange={e => onChangeConfig({ ...config, linkDistance: Number(e.target.value) })}
            className="w-full accent-primary h-1 bg-surface-hover rounded"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
            <span>Collision Radius</span>
            <span>{config.collisionRadius}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={config.collisionRadius}
            onChange={e => onChangeConfig({ ...config, collisionRadius: Number(e.target.value) })}
            className="w-full accent-primary h-1 bg-surface-hover rounded"
          />
        </div>
      </div>
    </div>
  );
};
