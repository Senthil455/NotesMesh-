import React from 'react';
import { CanvasElementType } from '../../core/domain/canvas';
import { 
  MousePointer, 
  Square, 
  Diamond, 
  Circle, 
  StickyNote, 
  Type, 
  ArrowRight, 
  FileText, 
  RotateCcw, 
  RotateCw, 
  Grid,
  Download
} from 'lucide-react';

interface CanvasToolbarProps {
  activeTool: CanvasElementType | 'select';
  setActiveTool: (tool: CanvasElementType | 'select') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  gridEnabled: boolean;
  onToggleGrid: () => void;
  onAddLinkedNoteCard: () => void;
  onExportSvg: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  activeTool,
  setActiveTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  gridEnabled,
  onToggleGrid,
  onAddLinkedNoteCard,
  onExportSvg,
}) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-surface/95 backdrop-blur-md border border-border px-2 py-1.5 rounded-xl shadow-lg select-none space-x-1">
      {/* Select tool */}
      <button
        onClick={() => setActiveTool('select')}
        title="Select & Move (V)"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'select'
            ? 'bg-primary text-white shadow-sm'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <MousePointer className="w-4 h-4" />
      </button>

      <div className="h-5 w-[1px] bg-border mx-1" />

      {/* Linked Note Card (Signature Feature) */}
      <button
        onClick={onAddLinkedNoteCard}
        title="Embed Linked Note Card"
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-primary hover:bg-blue-500/20 text-xs font-medium transition-colors"
      >
        <FileText className="w-3.5 h-3.5" />
        <span>+ Note Card</span>
      </button>

      {/* Basic shapes */}
      <button
        onClick={() => setActiveTool('rectangle')}
        title="Process Box (Rectangle)"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'rectangle'
            ? 'bg-primary text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Square className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('diamond')}
        title="Decision Diamond"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'diamond'
            ? 'bg-primary text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Diamond className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('circle')}
        title="Circle Node"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'circle'
            ? 'bg-primary text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Circle className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('sticky')}
        title="Sticky Note"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'sticky'
            ? 'bg-amber-500 text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <StickyNote className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('text')}
        title="Text Box"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'text'
            ? 'bg-primary text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <Type className="w-4 h-4" />
      </button>

      <button
        onClick={() => setActiveTool('connector')}
        title="Connector Arrow"
        className={`p-2 rounded-lg transition-colors ${
          activeTool === 'connector'
            ? 'bg-primary text-white'
            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="h-5 w-[1px] bg-border mx-1" />

      {/* Grid toggle */}
      <button
        onClick={onToggleGrid}
        title={gridEnabled ? 'Disable Grid' : 'Enable Grid'}
        className={`p-2 rounded-lg transition-colors ${
          gridEnabled ? 'text-primary' : 'text-gray-400'
        } hover:bg-surface-hover`}
      >
        <Grid className="w-4 h-4" />
      </button>

      {/* Undo / Redo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="p-2 rounded-lg text-gray-500 hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <button
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="p-2 rounded-lg text-gray-500 hover:bg-surface-hover disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <RotateCw className="w-4 h-4" />
      </button>

      {/* Export */}
      <button
        onClick={onExportSvg}
        title="Export Canvas to SVG"
        className="p-2 rounded-lg text-gray-500 hover:bg-surface-hover hover:text-primary transition-colors"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};
