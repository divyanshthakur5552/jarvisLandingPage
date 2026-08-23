"use client";
import React from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../../types/workflow';
import { NodeIcon } from './NodeIcon';
import { Check } from 'lucide-react';

interface DecisionNodeViewProps {
  node: WorkflowNode;
  onClick: (node: WorkflowNode) => void;
  isSelected?: boolean;
}

export const DecisionNodeView: React.FC<DecisionNodeViewProps> = ({
  node,
  onClick,
  isSelected = false
}) => {
  const colorDef = CATEGORY_COLORS[node.category];
  const isRunning = node.state === 'running';
  const isDone = node.state === 'done';

  // Compute status colors
  const statusColor = isRunning ? 'animate-status-breathe' : isDone ? 'bg-emerald-500' : 'bg-muted-foreground/30';
  const borderColor = isSelected ? 'border-primary' : 'border-border';
  const shadowClass = isSelected ? 'shadow-[0_0_0_1px_rgba(var(--primary),0.3)]' : 'shadow-sm';

  const inlineStyles = {
    clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)',
    '--accent-color': colorDef.hex
  } as React.CSSProperties;

  return (
    <div
      id={node.id}
      className="absolute cursor-pointer select-none transition-all duration-300 group"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      onClick={() => onClick(node)}
    >
      <div
        className={`relative w-full h-full bg-card border ${borderColor} ${shadowClass} transition-all duration-300 p-3 flex flex-col justify-center overflow-hidden ${isRunning ? 'animate-node-breathe' : ''}`}
        style={inlineStyles}
      >
        {/* Status Indicator (Left Edge) */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusColor}`} />

        {/* Left Input Connector */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors" />

        {/* Right Output Connector Dot(s) */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-card border border-border flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-500' : isDone ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
        </div>

        {/* Content Row: Green Signpost Icon + Bold White Title */}
        <div className="flex items-center gap-3 relative z-10 pl-1">
          <div className="relative flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold shadow-sm"
              style={{ backgroundColor: colorDef.bgHex, color: colorDef.hex }}
            >
              <NodeIcon name={node.iconName} size={16} className="stroke-[2]" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <h3 className="text-[14px] font-semibold font-sans text-foreground tracking-tight leading-snug line-clamp-2">
              {node.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
