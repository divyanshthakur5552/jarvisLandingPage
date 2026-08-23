import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge, PresetScenario, TraceStep } from '../types/workflow';
import { INITIAL_NODES, INITIAL_EDGES, PRESET_SCENARIOS } from '../data/workflowGraph';
import { WorkflowCanvas } from './WorkflowCanvas';
import { CanvasControls } from './CanvasControls';
import { LiveTraceTicker } from './LiveTraceTicker';
import { NodeInspectorModal } from './NodeInspectorModal';

export interface JarvisMultiPlaneExecutionProps {
  /** Custom array of initial nodes (defaults to INITIAL_NODES) */
  initialNodes?: WorkflowNode[];
  /** Custom array of initial edges (defaults to INITIAL_EDGES) */
  initialEdges?: WorkflowEdge[];
  /** Custom list of preset scenarios (defaults to PRESET_SCENARIOS) */
  presets?: PresetScenario[];
  /** Custom CSS class for the root wrapper container */
  className?: string;
  /** Custom inline styles for the root container */
  style?: React.CSSProperties;
  /** Callback fired when a trace step changes or executes */
  onStepChange?: (stepIndex: number, currentStep: TraceStep | null) => void;
  /** Callback fired when full execution trace completes */
  onTraceComplete?: () => void;
  /** Callback fired when a node is selected/inspected */
  onNodeSelect?: (node: WorkflowNode | null) => void;
  /** Whether to hide controls top bar */
  hideControls?: boolean;
  /** Whether to hide live ticker bottom bar */
  hideTicker?: boolean;
}

export function JarvisMultiPlaneExecution({
  initialNodes = INITIAL_NODES,
  initialEdges = INITIAL_EDGES,
  presets = PRESET_SCENARIOS,
  className = '',
  style = {},
  onStepChange,
  onTraceComplete,
  onNodeSelect,
  hideControls = false,
  hideTicker = false,
}: JarvisMultiPlaneExecutionProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(presets[0] || PRESET_SCENARIOS[0]);
  const [customPrompt, setCustomPrompt] = useState(selectedPreset?.commandText || '');

  // Execution Trace State
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [activeEdgeIds, setActiveEdgeIds] = useState<string[]>([]);
  const [speed, setSpeed] = useState(1);
  const [traceLogs, setTraceLogs] = useState<Array<{
    level: 'INFO' | 'EXEC' | 'DECISION' | 'SUCCESS' | 'WARN';
    message: string;
    timestamp: string;
  }>>([]);

  // Canvas Viewport Pan / Zoom State
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 40, y: 60 });

  // Inspection Modal State
  const [inspectedNode, setInspectedNode] = useState<WorkflowNode | null>(null);

  // Timer Ref for step progression
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Notify node selection callback
  const handleSelectNode = useCallback((node: WorkflowNode | null) => {
    setInspectedNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  // Reset all nodes and edges to idle
  const handleResetTrace = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStepIndex(-1);
    setActiveEdgeIds([]);
    setTraceLogs([]);

    setNodes(prev =>
      prev.map(n => ({
        ...n,
        state: 'idle'
      }))
    );
    setEdges(prev =>
      prev.map(e => ({
        ...e,
        state: 'idle'
      }))
    );
    if (onStepChange) onStepChange(-1, null);
  }, [onStepChange]);

  // Update Trigger Node label when scenario or prompt changes
  const applyCommandTextToTrigger = useCallback((text: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === 'node-trigger') {
          return {
            ...n,
            title: text.length > 28 ? text.slice(0, 26) + '...' : text,
            details: {
              ...n.details,
              inputPayload: {
                ...((typeof n.details.inputPayload === 'object' ? n.details.inputPayload : {})),
                rawText: text
              }
            }
          };
        }
        return n;
      })
    );
  }, []);

  // Select Preset Scenario
  const handleSelectPreset = useCallback((preset: PresetScenario) => {
    handleResetTrace();
    setSelectedPreset(preset);
    setCustomPrompt(preset.commandText);
    applyCommandTextToTrigger(preset.commandText);
  }, [handleResetTrace, applyCommandTextToTrigger]);

  // Execute a specific step in the sequence
  const executeStep = useCallback((stepIdx: number, scenario: PresetScenario) => {
    const steps = scenario.steps;
    if (stepIdx >= steps.length) {
      // Completed full trace!
      setIsRunning(false);
      setIsComplete(true);
      setActiveEdgeIds([]);
      setNodes(prev =>
        prev.map(n => (n.state === 'running' ? { ...n, state: 'done' } : n))
      );
      if (onTraceComplete) onTraceComplete();
      return;
    }

    const currentStep = steps[stepIdx];
    setCurrentStepIndex(stepIdx);
    setActiveEdgeIds(currentStep.activeEdgeIds);

    if (onStepChange) {
      onStepChange(stepIdx, currentStep);
    }

    // Append log entry
    if (currentStep.logDetail) {
      setTraceLogs(prev => [...prev, currentStep.logDetail]);
    }

    // Update node states: previously running become done, current become running
    setNodes(prev =>
      prev.map(node => {
        if (currentStep.nodeIds.includes(node.id)) {
          return { ...node, state: 'running' };
        }
        if (node.state === 'running') {
          return { ...node, state: 'done' };
        }
        return node;
      })
    );

    // Schedule next step based on duration and speed
    const stepDuration = Math.max(300, currentStep.durationMs / speed);
    timerRef.current = setTimeout(() => {
      executeStep(stepIdx + 1, scenario);
    }, stepDuration);
  }, [speed, onStepChange, onTraceComplete]);

  // Start Full Trace
  const handleStartTrace = useCallback(() => {
    handleResetTrace();
    setIsRunning(true);
    // Begin step 0 after short delay
    timerRef.current = setTimeout(() => {
      executeStep(0, selectedPreset);
    }, 150);
  }, [handleResetTrace, executeStep, selectedPreset]);

  // Stop Trace
  const handleStopTrace = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
  }, []);

  // Step Forward (Manual mode)
  const handleStepTrace = useCallback(() => {
    if (isRunning) return;
    const nextIdx = currentStepIndex + 1;
    if (nextIdx >= selectedPreset.steps.length) {
      handleResetTrace();
      return;
    }

    const currentStep = selectedPreset.steps[nextIdx];
    setCurrentStepIndex(nextIdx);
    setActiveEdgeIds(currentStep.activeEdgeIds);

    if (onStepChange) {
      onStepChange(nextIdx, currentStep);
    }

    if (currentStep.logDetail) {
      setTraceLogs(prev => [...prev, currentStep.logDetail]);
    }

    setNodes(prev =>
      prev.map(node => {
        if (currentStep.nodeIds.includes(node.id)) {
          return { ...node, state: 'running' };
        }
        if (node.state === 'running') {
          return { ...node, state: 'done' };
        }
        return node;
      })
    );

    if (nextIdx === selectedPreset.steps.length - 1) {
      setIsComplete(true);
      if (onTraceComplete) onTraceComplete();
    }
  }, [isRunning, currentStepIndex, selectedPreset, handleResetTrace, onStepChange, onTraceComplete]);

  // Custom Prompt Routing
  const handleSubmitCustomPrompt = useCallback(() => {
    const text = customPrompt.trim().toLowerCase();
    if (!text) return;

    let targetPreset = presets[0]; // Default direct execution
    if (
      text.includes('chrome') ||
      text.includes('youtube') ||
      text.includes('click') ||
      text.includes('screen') ||
      text.includes('browser') ||
      text.includes('button') ||
      text.includes('look') ||
      text.includes('gui')
    ) {
      targetPreset = presets[1] || presets[0]; // Vision Pipeline
    } else if (
      text.includes('debug') ||
      text.includes('retry') ||
      text.includes('error') ||
      text.includes('modal') ||
      text.includes('fix') ||
      text.includes('fallback')
    ) {
      targetPreset = presets[2] || presets[0]; // Retry Fallback
    }

    handleSelectPreset(targetPreset);
    applyCommandTextToTrigger(customPrompt);
  }, [customPrompt, presets, handleSelectPreset, applyCommandTextToTrigger]);

  // Canvas Viewport Actions
  const handleZoomIn = () => setZoom(z => Math.min(2.2, z * 1.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.35, z / 1.15));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 30, y: 50 });
  };
  const handleFitView = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scaleX = (w - 100) / 2250;
    const scaleY = (h - 180) / 750;
    const newZoom = Math.max(0.45, Math.min(1.0, Math.min(scaleX, scaleY)));
    setZoom(newZoom);
    setPan({ x: Math.max(20, (w - 2250 * newZoom) / 2), y: Math.max(70, (h - 750 * newZoom) / 2) });
  };

  // Manual Node State Override
  const handleManualNodeStateChange = (nodeId: string, newState: 'idle' | 'running' | 'done') => {
    setNodes(prev =>
      prev.map(n => (n.id === nodeId ? { ...n, state: newState } : n))
    );
    if (inspectedNode && inspectedNode.id === nodeId) {
      handleSelectNode(inspectedNode ? { ...inspectedNode, state: newState } : null);
    }
  };

  // Initial Responsive Fit View
  useEffect(() => {
    handleFitView();
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'Escape') {
        handleSelectNode(null);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (isRunning) handleStopTrace();
        else handleStartTrace();
      } else if (e.key.toLowerCase() === 'r') {
        handleResetTrace();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, handleResetTrace, handleStartTrace, handleStopTrace, handleSelectNode]);

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < selectedPreset.steps.length
      ? selectedPreset.steps[currentStepIndex]
      : null;

  return (
    <div
      className={`relative w-full h-full min-h-[600px] overflow-hidden bg-[#0a0a0d] text-zinc-100 select-none ${className}`}
      style={style}
    >
      {/* Top Controls & Navigation Bar */}
      {!hideControls && (
        <CanvasControls
          presets={presets}
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          isRunning={isRunning}
          onStartTrace={handleStartTrace}
          onStopTrace={handleStopTrace}
          onResetTrace={handleResetTrace}
          onStepTrace={handleStepTrace}
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleResetView}
          onFitView={handleFitView}
          speed={speed}
          onSpeedChange={setSpeed}
          customPrompt={customPrompt}
          onCustomPromptChange={setCustomPrompt}
          onSubmitCustomPrompt={handleSubmitCustomPrompt}
        />
      )}

      {/* Live Trace Status Ticker & Progress Bar */}
      {!hideTicker && (
        <LiveTraceTicker
          currentStepIndex={currentStepIndex}
          totalSteps={selectedPreset.steps.length}
          currentStep={currentStep}
          logs={traceLogs}
          isRunning={isRunning}
          isComplete={isComplete}
        />
      )}

      {/* Interactive Infinite/Pan-Zoom Workflow Canvas */}
      <WorkflowCanvas
        nodes={nodes}
        edges={edges}
        activeEdgeIds={activeEdgeIds}
        selectedNodeId={inspectedNode?.id || null}
        onNodeClick={node => handleSelectNode(node)}
        zoom={zoom}
        pan={pan}
        onPanChange={setPan}
        onZoomChange={setZoom}
      />

      {/* Node Telemetry Inspector Modal / Popover */}
      {inspectedNode && (
        <NodeInspectorModal
          node={inspectedNode}
          onClose={() => handleSelectNode(null)}
          onStateChange={handleManualNodeStateChange}
        />
      )}
    </div>
  );
}

export default JarvisMultiPlaneExecution;
