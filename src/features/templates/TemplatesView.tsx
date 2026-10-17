import React, { useState } from 'react';
import { BUILT_IN_TEMPLATES } from '../../core/templates/builtInTemplates';
import { NoteTemplate } from '../../core/domain/template';
import { 
  FileSpreadsheet, 
  Folder, 
  Tag as TagIcon, 
  Plus, 
  Check, 
  Copy,
  ArrowRight
} from 'lucide-react';

interface TemplatesViewProps {
  onCreateNoteFromTemplate: (template: NoteTemplate, customTitle?: string) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onCreateNoteFromTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>(BUILT_IN_TEMPLATES[0]);
  const [noteTitle, setNoteTitle] = useState('');
  const [copied, setCopied] = useState(false);

  const dateStr = new Date().toISOString().slice(0, 10);
  const previewContent = selectedTemplate.templateContent({
    title: noteTitle || selectedTemplate.name,
    dateStr,
  });

  const handleCreate = () => {
    onCreateNoteFromTemplate(selectedTemplate, noteTitle);
    setNoteTitle('');
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] bg-background overflow-hidden select-none">
      {/* Templates List Sidebar */}
      <div className="w-80 border-r border-border bg-surface flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 text-primary font-semibold text-sm">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Note Templates</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pre-structured note formats to standardize knowledge capture.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {BUILT_IN_TEMPLATES.map(tpl => {
            const isSelected = selectedTemplate.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplate(tpl);
                  setNoteTitle('');
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-primary/50 bg-primary/10 shadow-sm'
                    : 'border-border bg-surface-hover/40 hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
                    {tpl.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {tpl.folder}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {tpl.description}
                </p>
                <div className="flex items-center flex-wrap gap-1 mt-2">
                  {tpl.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-surface border border-border text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Preview and Configuration Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <div className="p-6 border-b border-border bg-surface shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {selectedTemplate.name}
            </h2>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>Target Folder: {selectedTemplate.folder}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <TagIcon className="w-3.5 h-3.5 text-cyan-500" />
                <span>Tags: {selectedTemplate.tags.join(', ')}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyPreview}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              <span>{copied ? 'Copied' : 'Copy Template'}</span>
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note</span>
            </button>
          </div>
        </div>

        {/* Content Creation Form & Live Preview */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="max-w-3xl">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Custom Note Title (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`e.g. ${selectedTemplate.name} - ${dateStr}`}
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border focus:outline-none focus:border-primary text-gray-800 dark:text-gray-200"
              />
              <button
                onClick={handleCreate}
                className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium shrink-0"
              >
                <span>Generate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-w-3xl border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
            <div className="px-4 py-2 border-b border-border bg-surface-hover/40 text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Preview: {noteTitle || selectedTemplate.name}.md</span>
              <span>Markdown</span>
            </div>
            <pre className="p-5 font-mono text-xs text-gray-800 dark:text-gray-200 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-primary/20">
              {previewContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
