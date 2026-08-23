import React from 'react';
import { JarvisMultiPlaneExecution } from './components/JarvisMultiPlaneExecution';

export default function App() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0a0a0d]">
      <JarvisMultiPlaneExecution
        onStepChange={(stepIndex, step) => {
          if (step) {
            console.log(`[Jarvis Execution] Step ${stepIndex}: ${step.statusMessage}`);
          }
        }}
        onTraceComplete={() => {
          console.log('[Jarvis Execution] Workflow Trace Completed Successfully!');
        }}
      />
    </main>
  );
}
