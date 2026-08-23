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

  let borderColor = '#2a2a33';
  let boxShadow = 'none';

  if (isRunning) {
    borderColor = colorDef.hex;
    boxShadow = `0 0 0 1px ${colorDef.hex}, 0 0 24px -2px ${colorDef.glowHex}`;
  } else if (isDone) {
    borderColor = '#10b981';
    boxShadow = '0 0 10px -2px rgba(16, 185, 129, 0.25)';
  } else if (isSelected) {
    borderColor = '#6366f1';
    boxShadow = '0 0 0 1px #6366f1, 0 0 14px -2px rgba(99, 102, 241, 0.3)';
  }

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
      {/* 64px Circular Node */}
      <div
        className="relative w-16 h-16 rounded-full bg-[#1a1a20] border transition-all duration-300 flex items-center justify-center"
        style={{
          borderColor,
          boxShadow,
        }}
      >
        {/* Top Input Port (connects upward to parent diamond) */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#1e1e24] border border-[#3a3a45] flex items-center justify-center z-10">
          <div className={`w-1 h-1 rounded-full ${isRunning ? 'bg-[#a78bfa]' : isDone ? 'bg-[#10b981]' : 'bg-[#3a3a45]'}`} />
        </div>

        {/* Pulsing ring on active */}
        {isRunning && (
          <div
            className="absolute -inset-1 rounded-full animate-ring-pulse pointer-events-none"
            style={{ backgroundColor: colorDef.glowHex }}
          />
        )}

        {/* Active / Done Small Badge */}
        {isRunning && (
          <div className="absolute -top-2 right-0 px-1.5 py-0.2 rounded-full bg-[#111116] border border-[#8b5cf6] flex items-center gap-1 shadow-md z-20">
            <span className="w-1 h-1 rounded-full bg-[#8b5cf6] animate-ping" />
          </div>
        )}
        {isDone && (
          <div className="absolute -top-1.5 right-0 p-0.5 rounded-full bg-[#111116] border border-[#10b981] shadow-xs z-20">
            <Check size={8} className="text-[#10b981]" />
          </div>
        )}

        {/* Centered Category Colored Icon */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: colorDef.hex }}
        >
          <NodeIcon name={node.iconName} size={16} className="text-white" />
        </div>
      </div>

      {/* Two-Line Label Underneath Circle */}
      <div className="mt-2 text-center w-28 -mx-6 pointer-events-none">
        <h4 className="text-[12px] font-semibold text-[#f4f4f5] tracking-tight leading-tight">
          {node.title}
        </h4>
        {node.subtitle && (
          <p className="text-[11px] font-normal text-[#8a8a94] leading-tight mt-0.5">
            {node.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
