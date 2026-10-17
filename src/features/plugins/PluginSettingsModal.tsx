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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl bg-surface dark:bg-[#111827] border border-border dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Plugin & Extension Manager
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Community-driven extensions running in a local sandboxed environment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plugin List */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-3.5">
          {plugins.map(plugin => (
            <div
              key={plugin.manifest.id}
              className="p-4 rounded-2xl border border-border dark:border-slate-800 bg-surface dark:bg-slate-800/40 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {plugin.manifest.name}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      v{plugin.manifest.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">
                    {plugin.manifest.description}
                  </p>
                </div>

                {/* Enable toggle */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                  <input
                    type="checkbox"
                    checked={plugin.enabled}
                    onChange={() => handleToggle(plugin)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                </label>
              </div>

              {/* Permissions & Author */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border dark:border-slate-800 text-xs font-semibold text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
        <div className="px-6 py-3.5 border-t border-border dark:border-slate-800 bg-surface-hover/30 dark:bg-slate-900/60 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Want to contribute a plugin?</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-bold"
          >
            <span>See plugin guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
