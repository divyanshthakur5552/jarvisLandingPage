"use client";
import React from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../../types/workflow';
import { NodeIcon } from './NodeIcon';
import { Check } from 'lucide-react';

interface MainProcessNodeViewProps {
  node: WorkflowNode;
  onClick: (node: WorkflowNode) => void;
  isSelected?: boolean;
}

export const MainProcessNodeView: React.FC<MainProcessNodeViewProps> = ({
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
      className="absolute cursor-pointer select-none transition-all duration-300 group"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        width: `${node.width}px`,
        height: `${node.height}px`,
      }}
      onClick={() => onClick(node)}
    >
      {/* Node Card Container */}
      <div
        className={`relative w-full h-full rounded-md bg-card border-2 ${borderColor} ${shadowClass} transition-all duration-300 p-4 flex flex-col justify-center overflow-hidden ${isRunning ? 'animate-node-breathe' : ''}`}
        style={inlineStyles}
      >
        {/* Status Indicator (Left Edge) */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusColor}`} />

        {/* Left Input Connector Bar */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors" />

        {/* Right Output Connector Bar & Dot */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-border group-hover:bg-muted-foreground/50 transition-colors" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-card border border-border flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-500' : isDone ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
        </div>

        {/* Header Row: Icon + Title + Subtitle */}
        <div className="flex items-center gap-3 relative z-10 pl-1">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold shadow-sm"
              style={{ backgroundColor: colorDef.bgHex, color: colorDef.hex }}
            >
              <NodeIcon name={node.iconName} size={16} className="stroke-[2]" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <h3 className="text-[15px] font-semibold font-sans text-foreground tracking-tight leading-tight truncate">
              {node.title}
            </h3>
            {node.subtitle && (
              <p className="text-[12px] font-mono text-muted-foreground leading-tight truncate mt-0.5">
                {node.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Bottom edge diamond connectors */}
        {node.diamondConnectors && node.diamondConnectors.length > 0 && (
          <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-4 pointer-events-none">
            {node.diamondConnectors.map((diamond, idx) => (
              <div key={diamond.id} className="relative flex flex-col items-center group/diamond">
                {/* Tiny Label Pill ABOVE Diamond */}
                <span className="absolute bottom-5 px-1.5 py-0.2 rounded text-[9px] font-mono text-muted-foreground bg-card border border-border shadow-xs whitespace-nowrap">
                  {diamond.label}
                </span>
                {/* Diamond shape (rotated square) */}
                <div
                  className={`w-3.5 h-3.5 rotate-45 bg-card border transition-colors duration-200 shadow-sm ${
                    isRunning ? 'border-primary bg-primary/20' : isDone ? 'border-emerald-500' : 'border-border'
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
