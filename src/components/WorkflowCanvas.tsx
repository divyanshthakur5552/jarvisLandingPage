"use client";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge } from '../types/workflow';
import { WorkflowConnectors } from './WorkflowConnectors';
import { TriggerNodeView } from './nodes/TriggerNodeView';
import { MainProcessNodeView } from './nodes/MainProcessNodeView';
import { DecisionNodeView } from './nodes/DecisionNodeView';
import { SubNodeView } from './nodes/SubNodeView';
import { ActionNodeView } from './nodes/ActionNodeView';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  activeEdgeIds: string[];
  selectedNodeId: string | null;
  onNodeClick: (node: WorkflowNode) => void;
  zoom: number;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  activeEdgeIds,
  selectedNodeId,
  onNodeClick,
  zoom,
  pan,
  onPanChange,
  onZoomChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle Pan via mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on canvas background (not inside nodes or buttons)
    if ((e.target as HTMLElement).closest('.cursor-pointer')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    onPanChange({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, onPanChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Wheel Zoom (Disabled)
  // const handleWheel = (e: React.WheelEvent) => {
  //   e.preventDefault();
  //   const zoomFactor = 1.08;
  //   let newZoom = e.deltaY < 0 ? zoom * zoomFactor : zoom / zoomFactor;
  //   newZoom = Math.max(0.35, Math.min(2.2, newZoom));
  //   onZoomChange(newZoom);
  // };

  const renderNode = (node: WorkflowNode) => {
    const isSelected = node.id === selectedNodeId;

    switch (node.type) {
      case 'trigger':
        return (
          <TriggerNodeView
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={isSelected}
          />
        );
      case 'main_process':
        return (
          <MainProcessNodeView
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={isSelected}
          />
        );
      case 'decision':
        return (
          <DecisionNodeView
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={isSelected}
          />
        );
      case 'sub_node':
        return (
          <SubNodeView
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={isSelected}
          />
        );
      case 'action':
      case 'terminal':
      default:
        return (
          <ActionNodeView
            key={node.id}
            node={node}
            onClick={onNodeClick}
            isSelected={isSelected}
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`relative w-full h-screen overflow-hidden canvas-line-grid select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Transformed Stage Layer */}
      <div
        className="absolute origin-top-left transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: '2350px',
          height: '780px',
        }}
      >
        {/* Visual Lane Labels in background */}
        <div className="absolute left-[780px] top-[95px] text-[11px] font-mono uppercase tracking-widest text-[#4b4b58]/60 pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
          <span>Direct Execution Plane (POSIX Shell & File I/O)</span>
        </div>

        <div className="absolute left-[780px] top-[395px] text-[11px] font-mono uppercase tracking-widest text-[#4b4b58]/60 pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-coral-500/50" style={{ color: '#f97362' }} />
          <span>Vision Action Plane (Multimodal SoM & Screen Grounding)</span>
        </div>

        {/* Connectors SVG Layer */}
        <WorkflowConnectors
          edges={edges}
          nodes={nodes}
          activeEdgeIds={activeEdgeIds}
        />

        {/* Nodes DOM Layer */}
        <div className="relative z-10">
          {nodes.map(renderNode)}
        </div>
      </div>
    </div>
  );
};
