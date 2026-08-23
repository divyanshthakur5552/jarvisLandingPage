# Jarvis Multi-Plane Execution Visualizer

A self-contained, interactive React component for visualizing multi-plane AI workflow executions, command routing, telemetry, and live execution tracing.

---

## 🚀 How to Re-use in Another Project

You can easily copy and use this component in any React, Next.js, Vite, or Remix application!

### 1. Copy Files to Your Target Project
Copy the `src/` directory (or specific subdirectories) into your new project:
- `src/components/JarvisMultiPlaneExecution.tsx`
- `src/components/WorkflowCanvas.tsx`
- `src/components/CanvasControls.tsx`
- `src/components/LiveTraceTicker.tsx`
- `src/components/NodeInspectorModal.tsx`
- `src/components/WorkflowConnectors.tsx`
- `src/components/nodes/`
- `src/types/workflow.ts`
- `src/data/workflowGraph.ts`

### 2. Install Required Dependencies
Ensure your target project has the required dependencies:
```bash
npm install lucide-react motion react react-dom
```

If using Tailwind CSS v4 or v3, ensure Tailwind is configured in your project.

### 3. Usage Example

```tsx
import React from 'react';
import { JarvisMultiPlaneExecution } from './components/JarvisMultiPlaneExecution';

export default function MyPage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <JarvisMultiPlaneExecution
        onStepChange={(stepIndex, step) => {
          console.log(`Step ${stepIndex}:`, step?.statusMessage);
        }}
        onTraceComplete={() => {
          console.log('Execution trace complete!');
        }}
      />
    </div>
  );
}
```

### 🎛 Component Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `initialNodes` | `WorkflowNode[]` | `INITIAL_NODES` | Custom initial nodes array for graph |
| `initialEdges` | `WorkflowEdge[]` | `INITIAL_EDGES` | Custom initial edges connecting nodes |
| `presets` | `PresetScenario[]` | `PRESET_SCENARIOS` | Custom trace preset scenarios |
| `className` | `string` | `''` | CSS class for container wrapper |
| `style` | `React.CSSProperties` | `{}` | Inline CSS styles |
| `onStepChange` | `(stepIdx, step) => void` | `undefined` | Callback fired on step execution |
| `onTraceComplete` | `() => void` | `undefined` | Callback fired when execution finishes |
| `onNodeSelect` | `(node) => void` | `undefined` | Callback fired when node is clicked |
| `hideControls` | `boolean` | `false` | Hide top controls header bar |
| `hideTicker` | `boolean` | `false` | Hide bottom live trace status ticker |

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npx tsc --noEmit
```
