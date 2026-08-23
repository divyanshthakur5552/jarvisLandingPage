"use client";
import React from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../../types/workflow';
import { NodeIcon } from './NodeIcon';
import { Check } from 'lucide-react';

interface TriggerNodeViewProps {
  node: WorkflowNode;
  onClick: (node: WorkflowNode) => void;
  isSelected?: boolean;
}

export const TriggerNodeView: React.FC<TriggerNodeViewProps> = ({
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
      {/* Stadium/Capsule Card */}
      <div
        className={`relative w-full h-full rounded-full bg-card border ${borderColor} ${shadowClass} transition-all duration-300 p-2.5 flex items-center pr-4 overflow-hidden ${isRunning ? 'animate-node-breathe' : ''}`}
        style={inlineStyles}
      >
        {/* Status Indicator (Left Edge) */}
        <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${statusColor}`} />

        {/* Icon */}
        <div className="relative flex-shrink-0 ml-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-sm"
            style={{ backgroundColor: colorDef.bgHex, color: colorDef.hex }}
          >
            <NodeIcon name={node.iconName} size={15} className="stroke-[2]" />
          </div>
        </div>

        {/* Interior minimal badge */}
        <div className="ml-3 flex flex-col justify-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">Trigger</span>
        </div>

        {/* Right Output Connector Bar & Dot */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-card border border-border flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-500' : isDone ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
        </div>
      </div>

      {/* Label sits BELOW the node, centered, bold white title */}
      <div className="mt-2.5 text-center px-1">
        <h4 className="text-[14px] font-semibold text-[#f4f4f5] tracking-tight leading-snug">
          {node.title}
        </h4>
      </div>
    </div>
  );
};
