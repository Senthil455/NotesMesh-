import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Note } from '../../core/domain/note';
import { GraphNode, GraphFilterConfig } from '../../core/domain/graph';
import { buildGraphData } from '../../core/graph/graphBuilder';
import { GraphControls } from './GraphControls';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface KnowledgeGraphViewProps {
  notes: Note[];
  onOpenNote: (noteId: string) => void;
  isDarkMode: boolean;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  notes,
  onOpenNote,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [filterConfig, setFilterConfig] = useState<GraphFilterConfig>({
    showTags: true,
    showOrphans: true,
    showMissingLinks: true,
    searchFilter: '',
    tagFilter: null,
    colorMode: 'type',
    linkDistance: 120,
    repelForce: 450,
    collisionRadius: 25,
  });

  const availableTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap(n => n.tags))).sort();
  }, [notes]);

  // Viewport transforms (Pan & Zoom)
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // Dragging state
  const dragRef = useRef<{
    isDraggingCanvas: boolean;
    draggedNodeId: string | null;
    startX: number;
    startY: number;
  }>({
    isDraggingCanvas: false,
    draggedNodeId: null,
    startX: 0,
    startY: 0,
  });

  // Graph data simulation state
  const graphData = useMemo(() => {
    return buildGraphData(notes, filterConfig);
  }, [notes, filterConfig]);

  // Persistent simulated nodes
  const simNodesRef = useRef<Map<string, GraphNode>>(new Map());

  // Initialize or update node positions
  useEffect(() => {
    const existing = simNodesRef.current;
    const nextMap = new Map<string, GraphNode>();

    const width = canvasRef.current?.clientWidth || 800;
    const height = canvasRef.current?.clientHeight || 600;

    graphData.nodes.forEach((node, i) => {
      if (existing.has(node.id)) {
        const old = existing.get(node.id)!;
        nextMap.set(node.id, {
          ...node,
          x: old.x,
          y: old.y,
          vx: old.vx || 0,
          vy: old.vy || 0,
        });
      } else {
        // Distribute nicely in a circle around center
        const angle = (i / Math.max(1, graphData.nodes.length)) * Math.PI * 2;
        const radius = 100 + Math.random() * 150;
        nextMap.set(node.id, {
          ...node,
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
    });

    simNodesRef.current = nextMap;
  }, [graphData]);

  // Center viewport on initial mount
  useEffect(() => {
    if (canvasRef.current) {
      setViewport({
        x: canvasRef.current.clientWidth / 2,
        y: canvasRef.current.clientHeight / 2,
        zoom: 1,
      });
    }
  }, []);

  const resetSimulation = useCallback(() => {
    const width = canvasRef.current?.clientWidth || 800;
    const height = canvasRef.current?.clientHeight || 600;

    simNodesRef.current.forEach((node, _, map) => {
      const angle = Math.random() * Math.PI * 2;
      const r = 80 + Math.random() * 160;
      node.x = width / 2 + Math.cos(angle) * r;
      node.y = height / 2 + Math.sin(angle) * r;
      node.vx = (Math.random() - 0.5) * 5;
      node.vy = (Math.random() - 0.5) * 5;
      map.set(node.id, node);
    });
  }, []);

  // Main animation / simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const simulateStep = () => {
      const nodes = Array.from(simNodesRef.current.values());
      const nodeMap = simNodesRef.current;

      const repel = filterConfig.repelForce;
      const linkDist = filterConfig.linkDistance;
      const damping = 0.88;

      // 1. Repulsion between all node pairs
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          if (!n1.x || !n1.y || !n2.x || !n2.y) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          if (dist < 400) {
            const force = (repel / distSq);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (dragRef.current.draggedNodeId !== n1.id) {
              n1.vx = (n1.vx || 0) - fx;
              n1.vy = (n1.vy || 0) - fy;
            }
            if (dragRef.current.draggedNodeId !== n2.id) {
              n2.vx = (n2.vx || 0) + fx;
              n2.vy = (n2.vy || 0) + fy;
            }
          }
        }
      }

      // 2. Spring attraction along edges
      for (const edge of graphData.edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target || !source.x || !source.y || !target.x || !target.y) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const diff = dist - linkDist;
        const force = diff * 0.04;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (dragRef.current.draggedNodeId !== source.id) {
          source.vx = (source.vx || 0) + fx;
          source.vy = (source.vy || 0) + fy;
        }
        if (dragRef.current.draggedNodeId !== target.id) {
          target.vx = (target.vx || 0) - fx;
          target.vy = (target.vy || 0) - fy;
        }
      }

      // 3. Center gravity & update positions
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;

      for (const node of nodes) {
        if (dragRef.current.draggedNodeId === node.id) continue;

        // Soft pull toward center
        const cdx = centerX - (node.x || centerX);
        const cdy = centerY - (node.y || centerY);
        node.vx = ((node.vx || 0) + cdx * 0.003) * damping;
        node.vy = ((node.vy || 0) + cdy * 0.003) * damping;

        node.x = (node.x || 0) + (node.vx || 0);
        node.y = (node.y || 0) + (node.vy || 0);
      }
    };

    const render = () => {
      // Handle DPI
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Apply viewport pan and zoom
      ctx.translate(viewport.x, viewport.y);
      ctx.scale(viewport.zoom, viewport.zoom);

      const nodeMap = simNodesRef.current;

      // Draw Edges
      ctx.lineWidth = 1.2;
      for (const edge of graphData.edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target || source.x === undefined || target.x === undefined) continue;

        const isHighlighted = 
          hoveredNode && (hoveredNode.id === source.id || hoveredNode.id === target.id);

        ctx.strokeStyle = isHighlighted
          ? (isDarkMode ? '#38bdf8' : '#2563eb')
          : (isDarkMode ? 'rgba(75, 85, 99, 0.45)' : 'rgba(203, 213, 225, 0.8)');
        ctx.lineWidth = isHighlighted ? 2 : 1;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y!);
        ctx.lineTo(target.x, target.y!);
        ctx.stroke();
      }

      // Draw Nodes
      const nodes = Array.from(nodeMap.values());
      for (const node of nodes) {
        if (node.x === undefined || node.y === undefined) continue;

        const isHovered = hoveredNode?.id === node.id;
        const radius = (node.radius || 8) * (isHovered ? 1.3 : 1);

        // Node Glow
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode ? 'rgba(56, 189, 248, 0.25)' : 'rgba(37, 99, 235, 0.2)';
          ctx.fill();
        }

        // Main Node Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

        if (node.type === 'missing') {
          ctx.fillStyle = '#f59e0b';
        } else if (filterConfig.colorMode !== 'type' && node.color) {
          ctx.fillStyle = node.color;
        } else if (node.isOrphan) {
          ctx.fillStyle = isDarkMode ? '#64748b' : '#94a3b8';
        } else {
          ctx.fillStyle = isDarkMode ? '#38bdf8' : '#3b82f6';
        }
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isDarkMode ? '#0f172a' : '#ffffff';
        ctx.stroke();

        // Node Label
        ctx.font = `${isHovered ? '600' : '500'} ${isHovered ? 12 : 11}px Inter, sans-serif`;
        ctx.fillStyle = isDarkMode ? '#f8fafc' : '#0f172a';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + radius + 13);
      }

      ctx.restore();

      simulateStep();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [graphData, filterConfig, viewport, hoveredNode, isDarkMode]);

  // Convert mouse event coordinates to graph simulation world coordinates
  const screenToWorld = (screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.x) / viewport.zoom,
      y: (screenY - viewport.y) / viewport.zoom,
    };
  };

  // Find node under mouse
  const getNodeAtPoint = (worldX: number, worldY: number): GraphNode | null => {
    const nodes = Array.from(simNodesRef.current.values());
    for (const node of nodes) {
      if (node.x === undefined || node.y === undefined) continue;
      const dx = worldX - node.x;
      const dy = worldY - node.y;
      const r = (node.radius || 8) + 4;
      if (dx * dx + dy * dy <= r * r) {
        return node;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const world = screenToWorld(mouseX, mouseY);

    const hit = getNodeAtPoint(world.x, world.y);
    if (hit) {
      dragRef.current = {
        isDraggingCanvas: false,
        draggedNodeId: hit.id,
        startX: mouseX,
        startY: mouseY,
      };
    } else {
      dragRef.current = {
        isDraggingCanvas: true,
        draggedNodeId: null,
        startX: mouseX - viewport.x,
        startY: mouseY - viewport.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (dragRef.current.isDraggingCanvas) {
      setViewport(prev => ({
        ...prev,
        x: mouseX - dragRef.current.startX,
        y: mouseY - dragRef.current.startY,
      }));
    } else if (dragRef.current.draggedNodeId) {
      const world = screenToWorld(mouseX, mouseY);
      const node = simNodesRef.current.get(dragRef.current.draggedNodeId);
      if (node) {
        node.x = world.x;
        node.y = world.y;
        node.vx = 0;
        node.vy = 0;
      }
    } else {
      const world = screenToWorld(mouseX, mouseY);
      const hit = getNodeAtPoint(world.x, world.y);
      setHoveredNode(hit);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // If clicked without dragging, open note
    if (
      dragRef.current.draggedNodeId &&
      Math.abs(mouseX - dragRef.current.startX) < 4 &&
      Math.abs(mouseY - dragRef.current.startY) < 4
    ) {
      const node = simNodesRef.current.get(dragRef.current.draggedNodeId);
      if (node && node.type === 'note') {
        onOpenNote(node.id);
      }
    }

    dragRef.current.draggedNodeId = null;
    dragRef.current.isDraggingCanvas = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setViewport(prev => ({
      ...prev,
      zoom: Math.min(2.5, Math.max(0.3, prev.zoom * zoomFactor)),
    }));
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] bg-background overflow-hidden">
      {/* Floating Controls Panel */}
      <GraphControls
        config={filterConfig}
        onChangeConfig={setFilterConfig}
        onResetSimulation={resetSimulation}
        availableTags={availableTags}
      />

      {/* Floating Zoom & Center bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1 bg-surface/90 backdrop-blur-md border border-border p-1 rounded-lg shadow-md text-gray-500">
        <button
          onClick={() => setViewport(v => ({ ...v, zoom: Math.min(2.5, v.zoom * 1.2) }))}
          title="Zoom In"
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewport(v => ({ ...v, zoom: Math.max(0.3, v.zoom / 1.2) }))}
          title="Zoom Out"
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (canvasRef.current) {
              setViewport({
                x: canvasRef.current.clientWidth / 2,
                y: canvasRef.current.clientHeight / 2,
                zoom: 1,
              });
            }
          }}
          title="Recenter"
          className="p-1.5 hover:bg-surface-hover rounded hover:text-primary transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono px-1.5">{Math.round(viewport.zoom * 100)}%</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />
    </div>
  );
};
