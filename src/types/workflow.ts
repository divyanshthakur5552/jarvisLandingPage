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
  // Structural Nodes: Neutral zinc/grays
  trigger:      { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  planner:      { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  memory:       { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  decision:     { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  verification: { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  system:       { hex: '#a1a1aa', bgHex: '#18181b', borderHex: '#3f3f46', glowHex: 'transparent', badgeBg: '#18181b', textHex: '#d4d4d8' },
  
  // Specific Planes
  // Direct Execution Plane: Desaturated amber/copper
  direct_exec:  { hex: '#d97757', bgHex: '#1a1614', borderHex: '#d97757', glowHex: 'transparent', badgeBg: '#1a1614', textHex: '#d97757' },
  // Vision Action Plane: Desaturated indigo/blue
  vision:       { hex: '#5b7db1', bgHex: '#14161a', borderHex: '#5b7db1', glowHex: 'transparent', badgeBg: '#14161a', textHex: '#5b7db1' },
};
