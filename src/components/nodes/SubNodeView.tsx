"use client";
import React from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../../types/workflow';
import { NodeIcon } from './NodeIcon';
import { Check } from 'lucide-react';

interface SubNodeViewProps {
  node: WorkflowNode;
  onClick: (node: WorkflowNode) => void;
  isSelected?: boolean;
}

export const SubNodeView: React.FC<SubNodeViewProps> = ({
  node,
  onClick,
  isSelected = false
}) => {
  const colorDef = CATEGORY_COLORS[node.category];
  const isRunning = node.state === 'running';
  const isDone = node.state === 'done';

  // Compute status colors
  const statusColor = isRunning ? 'animate-status-breathe' : isDone ? 'bg-emerald-500' : 'bg-muted-foreground/30';
  const borderColor = isSelected ? 'border-primary' : 'border-border/80';
  const shadowClass = isSelected ? 'shadow-[0_0_0_1px_rgba(var(--primary),0.3)]' : 'shadow-sm';

  const inlineStyles = {
    '--accent-color': colorDef.hex
  } as React.CSSProperties;

  return (
    <div
      id={node.id}
      className="absolute cursor-pointer select-none transition-all duration-300 group flex flex-col items-center"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
      }}
      onClick={() => onClick(node)}
    >
      {/* 64px Rounded Rectangle Node */}
      <div
        className={`relative w-16 h-16 rounded-[12px] bg-card border-2 ${borderColor} ${shadowClass} transition-all duration-300 flex items-center justify-center overflow-hidden ${isRunning ? 'animate-node-breathe' : ''}`}
        style={inlineStyles}
      >
        {/* Status Indicator (Left Edge) */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusColor}`} />

        {/* Top Input Port (connects upward to parent diamond) */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors z-10" />

        {/* Centered Category Colored Icon */}
        <div className="relative flex-shrink-0 z-10 ml-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm"
            style={{ backgroundColor: colorDef.bgHex, color: colorDef.hex }}
          >
            <NodeIcon name={node.iconName} size={16} className="stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Two-Line Label Underneath Circle */}
      <div className="mt-2 text-center w-28 -mx-6 pointer-events-none">
        <h4 className="text-[12px] font-semibold font-sans text-foreground tracking-tight leading-tight">
          {node.title}
        </h4>
        {node.subtitle && (
          <p className="text-[11px] font-mono text-muted-foreground leading-tight mt-0.5">
            {node.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
