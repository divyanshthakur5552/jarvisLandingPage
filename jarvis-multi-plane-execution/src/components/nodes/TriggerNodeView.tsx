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

  // Compute dynamic border and shadow
  let borderColor = '#2a2a33';
  let boxShadow = 'none';

  if (isRunning) {
    borderColor = colorDef.hex;
    boxShadow = `0 0 0 1px ${colorDef.hex}, 0 0 28px -4px ${colorDef.glowHex}`;
  } else if (isDone) {
    borderColor = '#10b981';
    boxShadow = '0 0 12px -2px rgba(16, 185, 129, 0.25)';
  } else if (isSelected) {
    borderColor = '#6366f1';
    boxShadow = '0 0 0 1px #6366f1, 0 0 16px -2px rgba(99, 102, 241, 0.3)';
  }

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
        className="relative w-full h-full flex items-center px-3.5 rounded-[28px] bg-[#15151b] border transition-all duration-300"
        style={{
          borderColor,
          boxShadow,
        }}
      >
        {/* Active Running Chip */}
        {isRunning && (
          <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-[#111116] border border-[#2dd4bf] flex items-center gap-1.5 shadow-lg animate-fade-in z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-ping" />
            <span className="text-[10px] font-mono font-medium tracking-tight text-[#2dd4bf]">running</span>
          </div>
        )}

        {/* Done Chip */}
        {isDone && (
          <div className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-[#111116] border border-[#10b981]/50 flex items-center gap-1 shadow-md z-20">
            <Check size={10} className="text-[#10b981]" />
            <span className="text-[9px] font-mono text-[#10b981]">done</span>
          </div>
        )}

        {/* Icon with pulsing ring in active state */}
        <div className="relative flex-shrink-0">
          {isRunning && (
            <div
              className="absolute -inset-1 rounded-xl animate-ring-pulse pointer-events-none"
              style={{ backgroundColor: colorDef.glowHex }}
            />
          )}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-950 font-bold shadow-sm transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: colorDef.hex }}
          >
            <NodeIcon name={node.iconName} size={15} className="text-zinc-950 stroke-[2.4]" />
          </div>
        </div>

        {/* Interior minimal badge */}
        <div className="ml-2.5 flex flex-col justify-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300/80 font-medium">Trigger</span>
        </div>

        {/* Right Output Connector Bar & Dot */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-[#1e1e24] border border-[#3a3a45] flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#2dd4bf]' : isDone ? 'bg-[#10b981]' : 'bg-[#3a3a45]'}`} />
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
