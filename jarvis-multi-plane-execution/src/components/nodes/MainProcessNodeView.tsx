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
      {/* Node Card Container */}
      <div
        className="relative w-full h-full rounded-[14px] bg-[#141419] border transition-all duration-300 p-3.5 flex flex-col justify-center"
        style={{
          borderColor,
          boxShadow,
        }}
      >
        {/* Left Input Connector Bar */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#2a2a35] group-hover:bg-[#3f3f4e] transition-colors" />

        {/* Right Output Connector Bar & Dot */}
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#2a2a35] group-hover:bg-[#3f3f4e] transition-colors" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1e1e24] border border-[#3a3a45] flex items-center justify-center z-10">
          <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#8b5cf6]' : isDone ? 'bg-[#10b981]' : 'bg-[#3a3a45]'}`} />
        </div>

        {/* Active Running Chip */}
        {isRunning && (
          <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-[#111116] border border-[#8b5cf6] flex items-center gap-1.5 shadow-lg animate-fade-in z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-ping" />
            <span className="text-[10px] font-mono font-medium tracking-tight text-[#a78bfa]">running</span>
          </div>
        )}

        {/* Done Chip */}
        {isDone && (
          <div className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-[#111116] border border-[#10b981]/50 flex items-center gap-1 shadow-md z-20">
            <Check size={10} className="text-[#10b981]" />
            <span className="text-[9px] font-mono text-[#10b981]">done</span>
          </div>
        )}

        {/* Header Row: Icon + Title + Subtitle */}
        <div className="flex items-center gap-3">
          {/* Icon with pulsing active ring */}
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
              <NodeIcon name={node.iconName} size={16} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <h3 className="text-[15px] font-semibold text-[#f4f4f5] tracking-tight leading-tight truncate">
              {node.title}
            </h3>
            {node.subtitle && (
              <p className="text-[12px] font-normal text-[#8a8a94] leading-tight truncate mt-0.5">
                {node.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Bottom edge diamond connectors */}
        {node.diamondConnectors && node.diamondConnectors.length > 0 && (
          <div className="absolute -bottom-2 left-0 right-0 flex justify-around px-4 pointer-events-none">
            {node.diamondConnectors.map((diamond, idx) => (
              <div key={diamond.id} className="flex flex-col items-center group/diamond">
                {/* Diamond shape (rotated square) */}
                <div
                  className={`w-3.5 h-3.5 rotate-45 bg-[#141419] border transition-colors duration-200 shadow-sm ${
                    isRunning ? 'border-[#8b5cf6] bg-[#221c35]' : isDone ? 'border-[#10b981]' : 'border-[#3a3a45]'
                  }`}
                />
                {/* Tiny Label Pill Underneath Diamond */}
                <span className="mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono text-[#71717a] bg-[#111115] border border-[#23232c] shadow-xs">
                  {diamond.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
