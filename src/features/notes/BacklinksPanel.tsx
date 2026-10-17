import React from 'react';
import { BacklinkItem } from '../../core/domain/note';
import { Link2, ArrowUpRight } from 'lucide-react';

interface BacklinksPanelProps {
  backlinks: BacklinkItem[];
  onOpenNote: (noteId: string) => void;
}

export const BacklinksPanel: React.FC<BacklinksPanelProps> = ({
  backlinks,
  onOpenNote,
}) => {
  return (
    <div className="border-t border-border bg-surface-hover/30 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Link2 className="w-4 h-4 text-primary" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Linked Mentions / Backlinks ({backlinks.length})
        </h4>
      </div>

      {backlinks.length === 0 ? (
        <p className="text-xs text-gray-400 italic">
          No other notes link to this note yet. Use <code className="text-primary font-mono text-[11px]">[[This Note Title]]</code> in another note to create a connection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {backlinks.map(item => (
            <div
              key={item.sourceNoteId}
              onClick={() => onOpenNote(item.sourceNoteId)}
              className="group p-2.5 rounded-lg border border-border bg-surface hover:border-primary/50 cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors flex items-center gap-1">
                  <span>{item.sourceNoteTitle}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="text-[10px] text-gray-400">Jump to note</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 italic font-mono bg-surface-hover/50 p-1 rounded">
                "{item.previewSnippet}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
