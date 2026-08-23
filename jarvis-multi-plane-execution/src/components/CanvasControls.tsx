import React from 'react';
import { Play, Square, RotateCcw, ZoomIn, ZoomOut, Maximize2, Sparkles, FastForward, ChevronRight } from 'lucide-react';
import { PresetScenario } from '../types/workflow';

interface CanvasControlsProps {
  presets: PresetScenario[];
  selectedPreset: PresetScenario;
  onSelectPreset: (preset: PresetScenario) => void;
  isRunning: boolean;
  onStartTrace: () => void;
  onStopTrace: () => void;
  onResetTrace: () => void;
  onStepTrace: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitView: () => void;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  customPrompt: string;
  onCustomPromptChange: (val: string) => void;
  onSubmitCustomPrompt: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  presets,
  selectedPreset,
  onSelectPreset,
  isRunning,
  onStartTrace,
  onStopTrace,
  onResetTrace,
  onStepTrace,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitView,
  speed,
  onSpeedChange,
  customPrompt,
  onCustomPromptChange,
  onSubmitCustomPrompt,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4 flex flex-col gap-3">
      {/* Top Main Navigation Row */}
      <div className="flex items-center justify-between w-full">
        {/* Top-Left: Wordmark */}
        <div className="pointer-events-auto flex items-center gap-3.5 bg-[#0f0f14]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#22222d] shadow-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-teal-400 flex items-center justify-center shadow-md">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                JARVIS
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.5
              </span>
            </div>
            <p className="text-xs text-[#8a8a94] font-normal leading-none mt-1">
              multi-plane execution — live trace
            </p>
          </div>
        </div>

        {/* Top-Center: Preset Scenarios */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-[#121218]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#22222d] shadow-xl">
          <span className="text-[11px] font-mono text-zinc-400 px-2.5 uppercase tracking-wider">
            Scenarios:
          </span>
          {presets.map(preset => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1e1e28] text-white border border-[#3f3f50] shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181822]/60'
                } ${isRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: preset.badgeColor }}
                />
                <span>{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Top-Right: Run Trace & Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Speed Toggle */}
          <div className="flex items-center bg-[#121218]/90 backdrop-blur-md p-1 rounded-xl border border-[#22222d] shadow-xl text-xs font-mono">
            {[1, 1.5, 2].map(s => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  speed === s
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Reset Trace */}
          <button
            onClick={onResetTrace}
            disabled={isRunning}
            title="Reset trace state to idle"
            className="p-2 rounded-xl bg-[#121218]/90 backdrop-blur-md border border-[#22222d] text-zinc-400 hover:text-white hover:bg-[#1c1c26] transition-all shadow-xl disabled:opacity-50"
          >
            <RotateCcw size={15} />
          </button>

          {/* Single Step button */}
          <button
            onClick={onStepTrace}
            disabled={isRunning}
            title="Step through one node at a time"
            className="px-3 py-2 rounded-xl bg-[#121218]/90 backdrop-blur-md border border-[#22222d] text-zinc-300 hover:text-white hover:bg-[#1c1c26] text-xs font-medium flex items-center gap-1 transition-all shadow-xl disabled:opacity-50"
          >
            <ChevronRight size={14} />
            <span>Step</span>
          </button>

          {/* Primary "Run trace" Ghost Button */}
          {isRunning ? (
            <button
              onClick={onStopTrace}
              className="px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-2 shadow-xl shadow-red-950/40 transition-all active:scale-95"
            >
              <Square size={13} className="fill-red-400 text-red-400" />
              <span>Stop Trace</span>
            </button>
          ) : (
            <button
              onClick={onStartTrace}
              className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#222230] border border-[#3b3b4d] hover:border-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xl shadow-black/40 hover:-translate-y-0.5 transition-all active:scale-95 group"
            >
              <Play size={13} className="fill-indigo-400 text-indigo-400 group-hover:fill-indigo-300" />
              <span className="tracking-wide">Run trace</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar: Custom Natural Language Command Input */}
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-4xl mx-auto bg-[#0d0d12]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#20202c] shadow-xl">
        <div className="flex items-center gap-2.5 flex-1 mr-3">
          <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider flex-shrink-0 font-medium">
            Active Command:
          </span>
          <input
            type="text"
            value={customPrompt}
            onChange={e => onCustomPromptChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') onSubmitCustomPrompt();
            }}
            disabled={isRunning}
            placeholder="Type any command (e.g. 'Create a script' or 'Click Chrome icon')..."
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-hidden font-mono tracking-tight"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/50">
            {selectedPreset.badgeLabel}
          </span>
          <button
            onClick={onSubmitCustomPrompt}
            disabled={isRunning}
            className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-[11px] font-medium transition-colors disabled:opacity-50"
          >
            Apply & Route
          </button>
        </div>
      </div>

      {/* Floating Canvas Navigation Controls (Bottom-Left) */}
      <div className="fixed bottom-5 left-5 pointer-events-auto flex items-center gap-1.5 bg-[#121218]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#22222d] shadow-xl text-zinc-300">
        <button
          onClick={onZoomIn}
          title="Zoom In (+)"
          className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomIn size={15} />
        </button>
        <span className="text-[11px] font-mono text-zinc-400 px-1 select-none min-w-[38px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomOut}
          title="Zoom Out (-)"
          className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
        >
          <ZoomOut size={15} />
        </button>
        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
        <button
          onClick={onResetView}
          title="Reset Canvas View"
          className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <RotateCcw size={13} />
          <span className="text-[10px] font-mono">100%</span>
        </button>
        <button
          onClick={onFitView}
          title="Fit Canvas to Screen"
          className="p-1.5 rounded-lg hover:bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Category Color Legend Bar (Bottom-Center) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3 bg-[#0d0d12]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#20202c] shadow-xl text-[11px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2dd4bf]" />
          <span className="text-zinc-400">Trigger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
          <span className="text-zinc-400">Neural/Planner</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-zinc-400">Direct Plane</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f97362]" />
          <span className="text-zinc-400">Vision Plane</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="text-zinc-400">Decision</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="text-zinc-400">Done</span>
        </div>
      </div>

      {/* Read-Only Caption (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 pointer-events-auto flex items-center gap-2 bg-[#0e0e13]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1f1f28] text-[#8a8a94] text-[11px] font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
        <span>workflow view · read only</span>
      </div>
    </div>
  );
};
