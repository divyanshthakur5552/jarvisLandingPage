import React from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../../types/workflow';
import { NodeIcon } from './NodeIcon';
import { Check, Plus } from 'lucide-react';

interface ActionNodeViewProps {
  node: WorkflowNode;
  onClick: (node: WorkflowNode) => void;
  isSelected?: boolean;
}

export const ActionNodeView: React.FC<ActionNodeViewProps> = ({
  node,
  onClick,
  isSelected = false
}) => {
  const colorDef = CATEGORY_COLORS[node.category];
  const isRunning = node.state === 'running';
  const isDone = node.state === 'done';
  const isTerminal = node.type === 'terminal';

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
      <div
        className="relative w-full h-full rounded-[14px] bg-[#141419] border transition-all duration-300 p-3.5 flex flex-col justify-center"
        style={{
          borderColor,
          boxShadow,
        }}
      >
        {/* Left Input Connector Bar */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#2a2a35] group-hover:bg-[#3f3f4e] transition-colors" />

        {/* Right Output Connector Bar & Dot (if not terminal) */}
        {!isTerminal && (
          <>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#2a2a35] group-hover:bg-[#3f3f4e] transition-colors" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1e1e24] border border-[#3a3a45] flex items-center justify-center z-10">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isRunning ? `bg-[${colorDef.hex}]` : isDone ? 'bg-[#10b981]' : 'bg-[#3a3a45]'
                }`}
                style={{ backgroundColor: isRunning ? colorDef.hex : isDone ? '#10b981' : '#3a3a45' }}
              />
            </div>
          </>
        )}

        {/* Active Running Chip */}
        {isRunning && (
          <div
            className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-[#111116] border flex items-center gap-1.5 shadow-lg animate-fade-in z-20"
            style={{ borderColor: colorDef.hex }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: colorDef.hex }} />
            <span className="text-[10px] font-mono font-medium tracking-tight" style={{ color: colorDef.textHex }}>
              running
            </span>
          </div>
        )}

        {/* Done Chip */}
        {isDone && (
          <div className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-[#111116] border border-[#10b981]/50 flex items-center gap-1 shadow-md z-20">
            <Check size={10} className="text-[#10b981]" />
            <span className="text-[9px] font-mono text-[#10b981]">done</span>
          </div>
        )}

        {/* Header Row: Colored Icon Square + Title + Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {isRunning && (
              <div
                className="absolute -inset-1 rounded-xl animate-ring-pulse pointer-events-none"
                style={{ backgroundColor: colorDef.glowHex }}
              />
            )}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold shadow-sm transition-transform duration-200 group-hover:scale-105"
              style={{ backgroundColor: colorDef.hex }}
            >
              <NodeIcon name={node.iconName} size={15} className="text-white stroke-[2.2]" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <h4 className="text-[14px] font-semibold text-[#f4f4f5] tracking-tight leading-tight truncate">
              {node.title}
            </h4>
            {node.subtitle && (
              <p className="text-[11px] font-normal text-[#8a8a94] leading-tight truncate mt-0.5 font-mono">
                {node.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Node: Small circular "+" button sitting just after the node on the right */}
      {isTerminal && (
        <div
          title="Extend chain: notify companion app (decorative)"
          className="absolute -right-9 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#1a1a20] border border-dashed border-[#3a3a45] hover:border-[#6366f1] flex items-center justify-center text-[#71717a] hover:text-white transition-colors duration-200 shadow-sm"
        >
          <Plus size={13} strokeWidth={2} />
        </div>
      )}
    </div>
  );
};
