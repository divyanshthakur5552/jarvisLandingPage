"use client";
import React, { useState } from 'react';
import { TraceStep } from '../types/workflow';
import { Activity, Terminal, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, Play } from 'lucide-react';

interface LiveTraceTickerProps {
  currentStepIndex: number;
  totalSteps: number;
  currentStep: TraceStep | null;
  logs: Array<{
    level: 'INFO' | 'EXEC' | 'DECISION' | 'SUCCESS' | 'WARN';
    message: string;
    timestamp: string;
  }>;
  isRunning: boolean;
  isComplete: boolean;
}

export const LiveTraceTicker: React.FC<LiveTraceTickerProps> = ({
  currentStepIndex,
  totalSteps,
  currentStep,
  logs,
  isRunning,
  isComplete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isRunning && !isComplete && logs.length === 0) {
    return null;
  }

  const progressPercent = totalSteps > 0 ? Math.min(100, Math.round(((currentStepIndex + 1) / totalSteps) * 100)) : 0;

  return (
    <div className="absolute bottom-6 right-6 z-30 w-full max-w-md pointer-events-auto">
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Main Status Row */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            {isRunning ? (
              <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/80 flex items-center justify-center flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>
            ) : isComplete ? (
              <div className="w-6 h-6 rounded-full bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={13} className="text-emerald-400" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Activity size={13} className="text-zinc-400" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white font-mono truncate">
                  {currentStep ? currentStep.plane : isComplete ? 'Execution Finished' : 'Trace Ready'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded border border-zinc-700/50">
                  {isComplete ? `${totalSteps}/${totalSteps}` : `${currentStepIndex + 1}/${totalSteps}`}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 font-mono truncate mt-0.5">
                {currentStep ? currentStep.statusMessage : isComplete ? 'All step assertions verified successfully.' : 'Click "Run trace" to execute'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-3 flex-shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <Terminal size={12} />
              <span>Logs ({logs.length})</span>
              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1a1a24] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400'
            }`}
            style={{ width: `${isComplete ? 100 : progressPercent}%` }}
          />
        </div>

        {/* Expanded Console Logs Drawer */}
        {isExpanded && (
          <div className="border-t border-[#20202c] p-3 max-h-48 overflow-y-auto bg-[#09090d] font-mono text-[11px] space-y-1.5">
            {logs.map((log, i) => {
              let badgeColor = 'text-zinc-400 bg-zinc-900 border-zinc-800';
              if (log.level === 'EXEC') badgeColor = 'text-purple-300 bg-purple-950/60 border-purple-800/40';
              if (log.level === 'DECISION') badgeColor = 'text-green-300 bg-green-950/60 border-green-800/40';
              if (log.level === 'SUCCESS') badgeColor = 'text-emerald-300 bg-emerald-950/60 border-emerald-800/40';
              if (log.level === 'WARN') badgeColor = 'text-amber-300 bg-amber-950/60 border-amber-800/40';

              return (
                <div key={i} className="flex items-start gap-2 text-zinc-300 leading-snug">
                  <span className="text-zinc-600 flex-shrink-0">[{log.timestamp}]</span>
                  <span className={`px-1 rounded border text-[9px] font-semibold flex-shrink-0 ${badgeColor}`}>
                    {log.level}
                  </span>
                  <span className="text-zinc-200">{log.message}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
