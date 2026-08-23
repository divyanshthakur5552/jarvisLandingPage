"use client";
import React from 'react';
import { WorkflowEdge, WorkflowNode } from '../types/workflow';

interface WorkflowConnectorsProps {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  activeEdgeIds: string[];
}

export const WorkflowConnectors: React.FC<WorkflowConnectorsProps> = ({
  edges,
  nodes,
  activeEdgeIds
}) => {
  const nodeMap = new Map<string, WorkflowNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const renderEdge = (edge: WorkflowEdge) => {
    const source = nodeMap.get(edge.sourceId);
    const target = nodeMap.get(edge.targetId);

    if (!source || !target) return null;

    const isActive = activeEdgeIds.includes(edge.id);
    const isDone = edge.state === 'done' || (source.state === 'done' && target.state === 'done');

    // 1. Calculate source anchor coordinates
    let sx = source.x + source.width;
    let sy = source.y + source.height / 2;

    if (edge.sourceAnchor === 'bottom') {
      sx = source.x + source.width / 2;
      sy = source.y + source.height;
    } else if (edge.sourceAnchor === 'diamond-0') {
      sx = source.x + 16 + (source.width - 32) / 6;
      sy = source.y + source.height;
    } else if (edge.sourceAnchor === 'diamond-1') {
      sx = source.x + source.width / 2;
      sy = source.y + source.height;
    } else if (edge.sourceAnchor === 'diamond-2') {
      sx = source.x + source.width - 16 - (source.width - 32) / 6;
      sy = source.y + source.height;
    }

    // 2. Calculate target anchor coordinates
    let tx = target.x;
    let ty = target.y + target.height / 2;

    if (edge.targetAnchor === 'top') {
      tx = target.x + target.width / 2;
      ty = target.y;
    } else if (edge.targetAnchor === 'bottom') {
      tx = target.x + target.width / 2;
      ty = target.y + target.height;
    }

    // 3. Build SVG Path and label positioning
    let pathData = '';
    let midX = (sx + tx) / 2;
    let midY = (sy + ty) / 2;

    if (edge.type === 'sub_dashed') {
      // Orthogonal step: Down, then sideways, then down
      const stepY = sy + 25;
      pathData = `M ${sx} ${sy} L ${sx} ${stepY} L ${tx} ${stepY} L ${tx} ${ty}`;
      midX = tx;
      midY = stepY;
    } else if (edge.type === 'loop_back') {
      // Loop-back retry line
      const dipY = 560; // Just below the lowest node
      pathData = `M ${sx} ${sy} L ${sx} ${dipY} L ${tx} ${dipY} L ${tx} ${ty}`;
      midX = (sx + tx) / 2;
      midY = dipY;
    } else {
      // Standard orthogonal sequential nodes: Right, then up/down, then right
      const midPointX = (sx + tx) / 2;
      pathData = `M ${sx} ${sy} L ${midPointX} ${sy} L ${midPointX} ${ty} L ${tx} ${ty}`;
      midX = midPointX;
      midY = (sy + ty) / 2;
    }

    // Colors
    let strokeColor = '#3a3a45';
    if (edge.type === 'branch_true') strokeColor = '#22c55e';
    if (edge.type === 'branch_false') strokeColor = '#6b7280';
    if (edge.type === 'loop_back') strokeColor = '#f59e0b';

    if (isActive) {
      if (edge.type === 'branch_true') strokeColor = '#4ade80';
      else if (edge.type === 'branch_false') strokeColor = '#9ca3af';
      else if (edge.type === 'loop_back') strokeColor = '#fbbf24';
      else strokeColor = '#a78bfa';
    } else if (isDone && edge.type !== 'loop_back') {
      strokeColor = '#10b981';
    }

    const strokeWidth = isActive ? 2.5 : 1.5;
    const isDashed = edge.type === 'sub_dashed' || edge.type === 'loop_back';

    return (
      <g key={edge.id} className="transition-all duration-300">

        {/* Core Line */}
        <path
          d={pathData}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeDasharray={isActive ? '6 4' : isDashed ? '4 4' : undefined}
          strokeLinejoin="round"
          className={isActive ? 'animate-flow-dash' : ''}
        />

        {/* Start and End Dots for non-sub connections */}
        {edge.type !== 'sub_dashed' && edge.type !== 'loop_back' && (
          <>
            <rect
              x={sx - 2}
              y={sy - 2}
              width="4"
              height="4"
              fill={strokeColor}
              className="transition-colors duration-200"
            />
            <rect
              x={tx - 2}
              y={ty - 2}
              width="4"
              height="4"
              fill={strokeColor}
              className="transition-colors duration-200"
            />
          </>
        )}

        {/* Sub-node arrowhead pointing UP into the parent diamond */}
        {edge.type === 'sub_dashed' && (
          <g transform={`translate(${sx}, ${sy + 2})`}>
            <polygon
              points="-3,4 0,0 3,4"
              fill={strokeColor}
              stroke={strokeColor}
              strokeWidth="0.5"
            />
          </g>
        )}

        {/* Branch Label Pill (true / false / retry) */}
        {edge.label && (
          <g transform={`translate(${midX}, ${midY})`}>
            {edge.label === 'true' && (
              <g className="cursor-default select-none">
                <rect
                  x="-18"
                  y="-10"
                  width="36"
                  height="20"
                  rx="4"
                  fill="hsl(var(--card))"
                  stroke={isActive ? '#4ade80' : '#22c55e'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={isActive ? '#4ade80' : '#22c55e'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  true
                </text>
              </g>
            )}

            {edge.label === 'false' && (
              <g className="cursor-default select-none">
                <rect
                  x="-20"
                  y="-10"
                  width="40"
                  height="20"
                  rx="4"
                  fill="hsl(var(--card))"
                  stroke={isActive ? '#d1d5db' : '#4b5563'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={isActive ? '#f3f4f6' : '#9ca3af'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  false
                </text>
              </g>
            )}

            {edge.label.startsWith('retry') && (
              <g className="cursor-default select-none">
                <rect
                  x="-44"
                  y="-11"
                  width="88"
                  height="22"
                  rx="4"
                  fill="hsl(var(--card))"
                  stroke={isActive ? '#fbbf24' : '#d97706'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fill={isActive ? '#fef08a' : '#f59e0b'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        )}
      </g>
    );
  };

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <marker
          id="arrow-diamond"
          viewBox="0 0 6 6"
          refX="3"
          refY="3"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#6b7280" />
        </marker>
      </defs>
      {edges.map(renderEdge)}
    </svg>
  );
};
