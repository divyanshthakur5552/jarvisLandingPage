"use client";
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
        <div className="pointer-events-auto flex items-center gap-3.5 bg-card px-4 py-2 rounded-md border border-border shadow-sm">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo.svg" alt="Jarvis Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold font-sans tracking-tight leading-none text-foreground">
                JARVIS
              </h1>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-muted text-muted-foreground border border-border rounded-sm">
                v2.5
              </span>
            </div>
            <p className="text-[11px] font-mono text-muted-foreground leading-none mt-1.5 uppercase tracking-wider">
              multi-plane execution — live trace
            </p>
          </div>
        </div>

        {/* Top-Center: Preset Scenarios */}
        <div className="pointer-events-auto flex items-center bg-card rounded-md border border-border shadow-sm p-1">
          <span className="text-[11px] font-mono text-muted-foreground px-3 uppercase tracking-wider">
            Scenarios:
          </span>
          <div className="h-4 w-px bg-border mx-1" />
          {presets.map(preset => {
            const isSelected = preset.id === selectedPreset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                disabled={isRunning}
                className={`px-3 py-1.5 rounded-sm text-[13px] font-sans transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Speed Toggle (Segmented Control) */}
          <div className="flex items-center bg-card rounded-md border border-border shadow-sm text-xs font-mono overflow-hidden">
            {[0.5, 1, 1.5, 2].map((s, idx) => (
              <React.Fragment key={s}>
                <button
                  onClick={() => onSpeedChange(s)}
                  className={`px-3 py-2 transition-colors ${
                    speed === s
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {s}x
                </button>
                {idx < 3 && <div className="w-px h-4 bg-border" />}
              </React.Fragment>
            ))}
          </div>

          {/* Reset Trace */}
          <button
            onClick={onResetTrace}
            disabled={isRunning}
            title="Reset trace state to idle"
            className="p-2 rounded-md bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all shadow-sm disabled:opacity-50"
          >
            <RotateCcw size={15} />
          </button>

          {/* Single Step button */}
          <button
            onClick={onStepTrace}
            disabled={isRunning}
            title="Step through one node at a time"
            className="px-3 py-2 rounded-md bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 text-[13px] font-medium font-sans flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            <ChevronRight size={14} />
            <span>Step</span>
          </button>

          {/* Primary "Run trace" Button */}
          {isRunning ? (
            <button
              onClick={onStopTrace}
              className="px-5 py-2 rounded-md bg-destructive hover:bg-destructive/90 border border-destructive/20 text-destructive-foreground text-[13px] font-semibold font-sans flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Square size={13} className="fill-current text-current" />
              <span>Stop Trace</span>
            </button>
          ) : (
            <button
              onClick={onStartTrace}
              className="px-5 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 text-[13px] font-semibold font-sans flex items-center gap-2 shadow-sm transition-all active:scale-95 group"
            >
              <Play size={13} className="fill-current text-current" />
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




    </div>
  );
};
