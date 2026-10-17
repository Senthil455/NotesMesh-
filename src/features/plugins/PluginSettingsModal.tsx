import React, { useState } from 'react';
import { pluginManager } from '../../core/plugins/pluginManager';
import { PluginInstance } from '../../core/domain/plugin';
import { Puzzle, ShieldCheck, ExternalLink, X } from 'lucide-react';

interface PluginSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PluginSettingsModal: React.FC<PluginSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [, setTrigger] = useState(0);

  if (!isOpen) return null;

  const plugins = pluginManager.getAllPlugins();

  const handleToggle = async (plugin: PluginInstance) => {
    if (plugin.enabled) {
      await pluginManager.deactivatePlugin(plugin.manifest.id);
    } else {
      await pluginManager.activatePlugin(plugin.manifest.id);
    }
    setTrigger(t => t + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-primary">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Plugin & Extension Manager
              </h3>
              <p className="text-xs text-gray-500">
                Community-driven extensions running in a local sandboxed environment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-surface-hover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plugin List */}
        <div className="p-5 max-h-[420px] overflow-y-auto space-y-3">
          {plugins.map(plugin => (
            <div
              key={plugin.manifest.id}
              className="p-4 rounded-xl border border-border bg-surface-hover/30 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                      {plugin.manifest.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border text-gray-500">
                      v{plugin.manifest.version}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {plugin.manifest.description}
                  </p>
                </div>

                {/* Enable toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={plugin.enabled}
                    onChange={() => handleToggle(plugin)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Permissions & Author */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60 text-[11px] text-gray-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    Permissions: {plugin.manifest.permissions?.join(', ') || 'none'}
                  </span>
                </div>
                <span>By {plugin.manifest.author}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Community guidance */}
        <div className="px-5 py-3 border-t border-border bg-surface-hover/50 flex items-center justify-between text-xs">
          <span className="text-gray-500">Want to contribute a plugin?</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline flex items-center space-x-1 font-medium"
          >
            <span>See plugin guide</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
