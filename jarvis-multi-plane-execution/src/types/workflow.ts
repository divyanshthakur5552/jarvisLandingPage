export type NodeCategory = 
  | 'trigger'      // teal #2dd4bf
  | 'planner'      // violet #8b5cf6
  | 'memory'       // blue #3b82f6
  | 'direct_exec'  // amber #f59e0b
  | 'vision'       // coral #f97362
  | 'decision'     // green #22c55e
  | 'verification' // emerald #10b981
  | 'system';      // slate gray #6b7280

export type NodeType = 
  | 'trigger'
  | 'main_process'
  | 'decision'
  | 'sub_node'
  | 'action'
  | 'terminal';

export type NodeExecutionState = 'idle' | 'running' | 'done';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  title: string;
  subtitle?: string;
  iconName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: NodeExecutionState;
  
  // Custom metadata
  diamondConnectors?: Array<{
    id: string;
    label: string;
    subNodeId: string;
  }>;
  parentHubId?: string;
  diamondIndex?: number;
  
  // Telemetry details for inspector modal
  details: {
    plane: 'Neural Control Plane' | 'Direct System Plane' | 'Vision Action Plane' | 'Verification & State Plane' | 'Trigger Ingress';
    planeColor: string;
    description: string;
    latencyMs: number;
    techStack: string;
    inputPayload: Record<string, any> | string;
    outputPayload: Record<string, any> | string;
    executionLog: string[];
    documentation: string;
  };
}

export interface WorkflowEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'main' | 'sub_dashed' | 'branch_true' | 'branch_false' | 'loop_back';
  label?: string;
  color?: string;
  sourceAnchor?: 'right' | 'bottom' | 'top' | 'left' | 'diamond-0' | 'diamond-1' | 'diamond-2';
  targetAnchor?: 'left' | 'top' | 'bottom' | 'right' | 'diamond-0' | 'diamond-1' | 'diamond-2';
  state?: 'idle' | 'active' | 'done';
}

export interface TraceStep {
  nodeIds: string[]; // which node(s) activate at this tick (e.g. planner + its 3 subnodes, or single action node)
  activeEdgeIds: string[];
  durationMs: number;
  statusMessage: string;
  plane: string;
  logDetail: {
    level: 'INFO' | 'EXEC' | 'DECISION' | 'SUCCESS' | 'WARN';
    message: string;
    timestamp: string;
    data?: any;
  };
}

export interface PresetScenario {
  id: string;
  name: string;
  commandText: string;
  branchType: 'direct' | 'vision' | 'retry_fallback';
  badgeLabel: string;
  badgeColor: string;
  description: string;
  steps: TraceStep[];
}

export const CATEGORY_COLORS: Record<NodeCategory, {
  hex: string;
  bgHex: string;
  borderHex: string;
  glowHex: string;
  badgeBg: string;
  textHex: string;
}> = {
  trigger: {
    hex: '#2dd4bf', // teal
    bgHex: 'rgba(45, 212, 191, 0.15)',
    borderHex: '#2dd4bf',
    glowHex: 'rgba(45, 212, 191, 0.35)',
    badgeBg: 'rgba(45, 212, 191, 0.2)',
    textHex: '#2dd4bf',
  },
  planner: {
    hex: '#8b5cf6', // violet
    bgHex: 'rgba(139, 92, 246, 0.15)',
    borderHex: '#8b5cf6',
    glowHex: 'rgba(139, 92, 246, 0.35)',
    badgeBg: 'rgba(139, 92, 246, 0.2)',
    textHex: '#a78bfa',
  },
  memory: {
    hex: '#3b82f6', // blue
    bgHex: 'rgba(59, 130, 246, 0.15)',
    borderHex: '#3b82f6',
    glowHex: 'rgba(59, 130, 246, 0.35)',
    badgeBg: 'rgba(59, 130, 246, 0.2)',
    textHex: '#60a5fa',
  },
  direct_exec: {
    hex: '#f59e0b', // amber
    bgHex: 'rgba(245, 158, 11, 0.15)',
    borderHex: '#f59e0b',
    glowHex: 'rgba(245, 158, 11, 0.35)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    textHex: '#fbbf24',
  },
  vision: {
    hex: '#f97362', // coral
    bgHex: 'rgba(249, 115, 98, 0.15)',
    borderHex: '#f97362',
    glowHex: 'rgba(249, 115, 98, 0.35)',
    badgeBg: 'rgba(249, 115, 98, 0.2)',
    textHex: '#f97362',
  },
  decision: {
    hex: '#22c55e', // green
    bgHex: 'rgba(34, 197, 94, 0.15)',
    borderHex: '#22c55e',
    glowHex: 'rgba(34, 197, 94, 0.35)',
    badgeBg: 'rgba(34, 197, 94, 0.2)',
    textHex: '#4ade80',
  },
  verification: {
    hex: '#10b981', // emerald
    bgHex: 'rgba(16, 185, 129, 0.15)',
    borderHex: '#10b981',
    glowHex: 'rgba(16, 185, 129, 0.35)',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    textHex: '#34d399',
  },
  system: {
    hex: '#6b7280', // slate gray
    bgHex: 'rgba(107, 114, 128, 0.15)',
    borderHex: '#6b7280',
    glowHex: 'rgba(107, 114, 128, 0.35)',
    badgeBg: 'rgba(107, 114, 128, 0.2)',
    textHex: '#9ca3af',
  },
};
