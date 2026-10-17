import React, { useState, useRef } from 'react';
import { Note } from '../../core/domain/note';
import { CanvasDocument, CanvasElement, CanvasElementType } from '../../core/domain/canvas';
import { CanvasToolbar } from './CanvasToolbar';
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Copy 
} from 'lucide-react';

interface CanvasWorkspaceProps {
  canvasDoc: CanvasDocument;
  onUpdateCanvas: (updated: CanvasDocument) => void;
  notes: Note[];
  onOpenNote: (noteId: string) => void;
  isDarkMode: boolean;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  canvasDoc,
  onUpdateCanvas,
  notes,
  onOpenNote,
  isDarkMode,
}) => {
  const [activeTool, setActiveTool] = useState<CanvasElementType | 'select'>('select');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [isNoteSelectorOpen, setIsNoteSelectorOpen] = useState(false);

  // Undo / Redo history
  const [history, setHistory] = useState<CanvasElement[][]>([canvasDoc.elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState(canvasDoc.viewport || { x: 0, y: 0, zoom: 1 });

  // Dragging state
  const isDraggingCanvasRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const draggedElementRef = useRef<{ id: string; initialX: number; initialY: number; mouseStartX: number; mouseStartY: number } | null>(null);

  // Sync state to history
  const pushHistory = (newElements: CanvasElement[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newElements);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    onUpdateCanvas({ ...canvasDoc, elements: newElements });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateCanvas({ ...canvasDoc, elements: prev });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateCanvas({ ...canvasDoc, elements: next });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If clicking on empty canvas
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setSelectedElementId(null);
      setEditingElementId(null);

      if (activeTool === 'select') {
        isDraggingCanvasRef.current = true;
        dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
      } else {
        // Place new element at clicked point
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const worldX = (e.clientX - rect.left - pan.x) / pan.zoom;
        const worldY = (e.clientY - rect.top - pan.y) / pan.zoom;

        createElementAt(activeTool, worldX, worldY);
        setActiveTool('select');
      }
    }
  };

  const createElementAt = (type: CanvasElementType, x: number, y: number, linkedNote?: Note) => {
    const id = `el-${Date.now()}`;
    let newElement: CanvasElement;

    switch (type) {
      case 'rectangle':
        newElement = {
          id,
          type: 'rectangle',
          x,
          y,
          width: 160,
          height: 80,
          text: 'Process Step',
          color: isDarkMode ? '#1e293b' : '#ffffff',
          strokeColor: '#3b82f6',
        };
        break;
      case 'diamond':
        newElement = {
          id,
          type: 'diamond',
          x,
          y,
          width: 120,
          height: 100,
          text: 'Condition?',
          color: '#8b5cf6',
        };
        break;
      case 'circle':
        newElement = {
          id,
          type: 'circle',
          x,
          y,
          width: 100,
          height: 100,
          text: 'Concept',
          color: '#06b6d4',
        };
        break;
      case 'sticky':
        newElement = {
          id,
          type: 'sticky',
          x,
          y,
          width: 160,
          height: 140,
          text: 'Note idea...',
          color: '#fef08a', // classic yellow sticky
        };
        break;
      case 'text':
        newElement = {
          id,
          type: 'text',
          x,
          y,
          width: 140,
          height: 40,
          text: 'Heading Text',
          color: 'transparent',
        };
        break;
      case 'note-card':
        newElement = {
          id,
          type: 'note-card',
          x,
          y,
          width: 220,
          height: 110,
          linkedNoteId: linkedNote?.id,
          linkedNoteTitle: linkedNote?.title || 'Linked Note',
          text: linkedNote?.content.slice(0, 80).replace(/#/g, '') || 'Linked Note Card',
          color: '#3b82f6',
        };
        break;
      case 'connector':
        newElement = {
          id,
          type: 'connector',
          x,
          y,
          width: 100,
          height: 0,
          fromPoint: { x, y },
          toPoint: { x: x + 100, y: y + 50 },
        };
        break;
    }

    pushHistory([...canvasDoc.elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleElementMouseDown = (e: React.MouseEvent, el: CanvasElement) => {
    e.stopPropagation();
    setSelectedElementId(el.id);

    draggedElementRef.current = {
      id: el.id,
      initialX: el.x,
      initialY: el.y,
      mouseStartX: e.clientX,
      mouseStartY: e.clientY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvasRef.current) {
      setPan(prev => ({
        ...prev,
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      }));
    } else if (draggedElementRef.current) {
      const deltaX = (e.clientX - draggedElementRef.current.mouseStartX) / pan.zoom;
      const deltaY = (e.clientY - draggedElementRef.current.mouseStartY) / pan.zoom;

      const nextElements = canvasDoc.elements.map(el => {
        if (el.id === draggedElementRef.current?.id) {
          return {
            ...el,
            x: Math.round(draggedElementRef.current.initialX + deltaX),
            y: Math.round(draggedElementRef.current.initialY + deltaY),
          };
        }
        return el;
      });

      onUpdateCanvas({ ...canvasDoc, elements: nextElements });
    }
  };

  const handleMouseUp = () => {
    if (isDraggingCanvasRef.current) {
      isDraggingCanvasRef.current = false;
      onUpdateCanvas({ ...canvasDoc, viewport: pan });
    }

    if (draggedElementRef.current) {
      draggedElementRef.current = null;
      pushHistory(canvasDoc.elements);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedElementId) return;
    const nextElements = canvasDoc.elements.filter(el => el.id !== selectedElementId);
    pushHistory(nextElements);
    setSelectedElementId(null);
  };

  const handleDuplicateSelected = () => {
    if (!selectedElementId) return;
    const target = canvasDoc.elements.find(el => el.id === selectedElementId);
    if (!target) return;
    const duplicate: CanvasElement = {
      ...target,
      id: `el-${Date.now()}`,
      x: target.x + 25,
      y: target.y + 25,
    };
    pushHistory([...canvasDoc.elements, duplicate]);
    setSelectedElementId(duplicate.id);
  };

  const handleUpdateElementText = (id: string, text: string) => {
    const nextElements = canvasDoc.elements.map(el =>
      el.id === id ? { ...el, text } : el
    );
    pushHistory(nextElements);
  };

  const handleChangeElementColor = (id: string, color: string) => {
    const nextElements = canvasDoc.elements.map(el =>
      el.id === id ? { ...el, color } : el
    );
    pushHistory(nextElements);
  };

  const handleExportSvg = () => {
    const svg = document.getElementById('notemesh-canvas-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${canvasDoc.title || 'diagram'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-[calc(100vh-3.5rem)] bg-background overflow-hidden select-none"
    >
      {/* Top Toolbar */}
      <CanvasToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        gridEnabled={canvasDoc.gridEnabled}
        onToggleGrid={() => onUpdateCanvas({ ...canvasDoc, gridEnabled: !canvasDoc.gridEnabled })}
        onAddLinkedNoteCard={() => setIsNoteSelectorOpen(true)}
        onExportSvg={handleExportSvg}
      />

      {/* Selected Element Quick Palette */}
      {selectedElementId && (
        <div className="absolute top-18 left-1/2 -translate-x-1/2 z-10 flex items-center bg-surface/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg shadow-md space-x-2 text-xs">
          <span className="text-gray-400 font-medium">Color:</span>
          {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#fef08a', '#1e293b'].map(c => (
            <button
              key={c}
              onClick={() => handleChangeElementColor(selectedElementId, c)}
              className="w-4 h-4 rounded-full border border-black/20 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            onClick={handleDuplicateSelected}
            className="text-gray-600 dark:text-gray-300 hover:text-primary flex items-center space-x-1"
            title="Duplicate element"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <button
            onClick={handleDeleteSelected}
            className="text-rose-500 hover:text-rose-600 flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Linked Note Picker Modal */}
      {isNoteSelectorOpen && (
        <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl p-4 w-96 shadow-xl space-y-3">
            <h3 className="font-semibold text-sm">Select Note to Embed as Card</h3>
            <p className="text-xs text-gray-500">
              This card will display the note preview and connect to it interactively.
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    createElementAt('note-card', 200, 200, note);
                    setIsNoteSelectorOpen(false);
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-hover cursor-pointer text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{note.title}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setIsNoteSelectorOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG Canvas Board */}
      <svg
        id="notemesh-canvas-svg"
        className="w-full h-full cursor-crosshair"
      >
        <defs>
          {/* Grid pattern */}
          {canvasDoc.gridEnabled && (
            <pattern
              id="grid-pattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="12"
                cy="12"
                r="1"
                fill={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              />
            </pattern>
          )}

          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill={isDarkMode ? '#94a3b8' : '#64748b'}
            />
          </marker>
        </defs>

        {/* Background Grid */}
        <rect
          id="canvas-bg"
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={canvasDoc.gridEnabled ? 'url(#grid-pattern)' : 'transparent'}
        />

        {/* Transformed Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${pan.zoom})`}>
          {/* Connectors First */}
          {canvasDoc.elements
            .filter(el => el.type === 'connector')
            .map(el => {
              const x1 = el.fromPoint?.x || el.x;
              const y1 = el.fromPoint?.y || el.y;
              const x2 = el.toPoint?.x || el.x + 100;
              const y2 = el.toPoint?.y || el.y + 50;

              return (
                <g key={el.id} onMouseDown={e => handleElementMouseDown(e, el)}>
                  <path
                    d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={selectedElementId === el.id ? '#3b82f6' : (isDarkMode ? '#94a3b8' : '#64748b')}
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </g>
              );
            })}

          {/* Other Elements */}
          {canvasDoc.elements
            .filter(el => el.type !== 'connector')
            .map(el => {
              const isSelected = selectedElementId === el.id;

              return (
                <g
                  key={el.id}
                  transform={`translate(${el.x}, ${el.y})`}
                  onMouseDown={e => handleElementMouseDown(e, el)}
                  className="cursor-move"
                >
                  {/* Rectangle */}
                  {el.type === 'rectangle' && (
                    <rect
                      width={el.width}
                      height={el.height}
                      rx="8"
                      fill={el.color || '#ffffff'}
                      stroke={isSelected ? '#3b82f6' : (el.strokeColor || '#94a3b8')}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />
                  )}

                  {/* Diamond */}
                  {el.type === 'diamond' && (
                    <polygon
                      points={`${el.width / 2},0 ${el.width},${el.height / 2} ${el.width / 2},${el.height} 0,${el.height / 2}`}
                      fill={el.color || '#8b5cf6'}
                      stroke={isSelected ? '#3b82f6' : 'rgba(0,0,0,0.1)'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                    />
                  )}

                  {/* Circle */}
                  {el.type === 'circle' && (
                    <ellipse
                      cx={el.width / 2}
                      cy={el.height / 2}
                      rx={el.width / 2}
                      ry={el.height / 2}
                      fill={el.color || '#06b6d4'}
                      stroke={isSelected ? '#3b82f6' : 'rgba(0,0,0,0.1)'}
                      strokeWidth={isSelected ? '2.5' : '1'}
                    />
                  )}

                  {/* Sticky Note */}
                  {el.type === 'sticky' && (
                    <g>
                      <rect
                        width={el.width}
                        height={el.height}
                        rx="4"
                        fill={el.color || '#fef08a'}
                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                        stroke={isSelected ? '#3b82f6' : 'rgba(0,0,0,0.1)'}
                        strokeWidth={isSelected ? '2' : '1'}
                      />
                      <rect
                        width={el.width}
                        height="14"
                        rx="2"
                        fill="rgba(0,0,0,0.06)"
                      />
                    </g>
                  )}

                  {/* Linked Note Card (Special Interactive Card) */}
                  {el.type === 'note-card' && (
                    <g>
                      <rect
                        width={el.width}
                        height={el.height}
                        rx="8"
                        fill={isDarkMode ? '#1e293b' : '#ffffff'}
                        stroke={isSelected ? '#3b82f6' : '#3b82f6'}
                        strokeWidth="2"
                        filter="drop-shadow(0 4px 10px rgba(59, 130, 246, 0.15))"
                      />
                      {/* Top Header Bar */}
                      <rect
                        width={el.width}
                        height="26"
                        rx="6"
                        fill="#3b82f6"
                      />
                      <text
                        x="10"
                        y="17"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                      >
                        {el.linkedNoteTitle || 'Note'}
                      </text>
                    </g>
                  )}

                  {/* Editable Text / ForeignObject HTML */}
                  <foreignObject
                    x={el.type === 'note-card' ? '10' : '8'}
                    y={el.type === 'note-card' ? '32' : '8'}
                    width={el.width - 16}
                    height={el.type === 'note-card' ? el.height - 40 : el.height - 16}
                  >
                    <div className="w-full h-full flex flex-col justify-between">
                      {editingElementId === el.id ? (
                        <textarea
                          autoFocus
                          value={el.text || ''}
                          onChange={e => handleUpdateElementText(el.id, e.target.value)}
                          onBlur={() => setEditingElementId(null)}
                          className="w-full h-full bg-transparent text-xs resize-none focus:outline-none p-1 font-medium"
                          style={{ color: el.type === 'sticky' ? '#000000' : 'inherit' }}
                        />
                      ) : (
                        <div
                          onDoubleClick={() => setEditingElementId(el.id)}
                          className="w-full h-full text-xs overflow-hidden text-ellipsis p-1 font-medium select-none"
                          style={{
                            color: el.type === 'sticky' ? '#1f2937' : (el.type === 'note-card' ? (isDarkMode ? '#cbd5e1' : '#475569') : 'inherit'),
                          }}
                        >
                          {el.text || 'Double-click to edit'}
                        </div>
                      )}

                      {/* Jump button on linked note card */}
                      {el.type === 'note-card' && el.linkedNoteId && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onOpenNote(el.linkedNoteId!);
                          }}
                          className="flex items-center space-x-1 text-[10px] text-primary hover:underline font-semibold mt-1"
                        >
                          <span>Open Note</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
        </g>
      </svg>

      {/* Bottom Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1 bg-surface/90 backdrop-blur-md border border-border p-1 rounded-lg shadow-md text-gray-500">
        <button
          onClick={() => setPan(p => ({ ...p, zoom: Math.min(2.5, p.zoom * 1.2) }))}
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPan(p => ({ ...p, zoom: Math.max(0.3, p.zoom / 1.2) }))}
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPan({ x: 50, y: 50, zoom: 1 })}
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono px-1.5">{Math.round(pan.zoom * 100)}%</span>
      </div>
    </div>
  );
};
