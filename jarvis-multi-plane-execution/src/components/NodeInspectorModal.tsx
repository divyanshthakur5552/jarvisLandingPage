import React, { useState } from 'react';
import { WorkflowNode, CATEGORY_COLORS } from '../types/workflow';
import { NodeIcon } from './nodes/NodeIcon';
import { X, Copy, Check, Terminal, Activity, Layers, BookOpen, Clock, Cpu } from 'lucide-react';

interface NodeInspectorModalProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onStateChange?: (nodeId: string, state: 'idle' | 'running' | 'done') => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  onClose,
  onStateChange
}) => {
  const [activeTab, setActiveTab] = useState<'payload' | 'logs' | 'docs'>('payload');
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  if (!node) return null;

  const colorDef = CATEGORY_COLORS[node.category];

  const handleCopy = (data: any, isInput: boolean) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    if (isInput) {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-[#111116] border border-[#2a2a35] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#22222c] bg-[#14141a]">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: colorDef.hex }}
            >
              <NodeIcon name={node.iconName} size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white tracking-tight">{node.title}</h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border"
                  style={{
                    backgroundColor: colorDef.bgHex,
                    borderColor: colorDef.borderHex,
                    color: colorDef.textHex,
                  }}
                >
                  {node.type}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{node.details.plane}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-[#0d0d11] border-b border-[#1f1f28] text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock size={14} className="text-zinc-500" />
            <span>Latency: <strong className="text-zinc-200 font-mono">{node.details.latencyMs}ms</strong></span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 col-span-2 truncate">
            <Cpu size={14} className="text-zinc-500 flex-shrink-0" />
            <span className="truncate">Stack: <strong className="text-zinc-200 font-mono">{node.details.techStack}</strong></span>
          </div>
        </div>

        {/* Manual State Toggle Bar (Presentation Helper for Judges) */}
        {onStateChange && (
          <div className="px-5 py-2.5 bg-[#121218] border-b border-[#1f1f28] flex items-center justify-between">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Activity size={13} className="text-zinc-500" />
              Node State Preview:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onStateChange(node.id, 'idle')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  node.state === 'idle'
                    ? 'bg-zinc-800 text-white border border-zinc-600 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                Idle
              </button>
              <button
                onClick={() => onStateChange(node.id, 'running')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                  node.state === 'running'
                    ? 'bg-purple-950/80 text-purple-200 border border-purple-500 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                Running
              </button>
              <button
                onClick={() => onStateChange(node.id, 'done')}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center gap-1 ${
                  node.state === 'done'
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Check size={11} className="text-emerald-400" />
                Done
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#22222c] px-5 bg-[#14141a]">
          <button
            onClick={() => setActiveTab('payload')}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'payload'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers size={14} />
            Telemetry & Payloads
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal size={14} />
            Execution Trace ({node.details.executionLog.length})
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen size={14} />
            Architecture Spec
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'payload' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Input Parameters
                  </span>
                  <button
                    onClick={() => handleCopy(node.details.inputPayload, true)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline"
                  >
                    {copiedInput ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedInput ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-3 bg-[#0a0a0e] border border-[#22222d] rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  {typeof node.details.inputPayload === 'string'
                    ? node.details.inputPayload
                    : JSON.stringify(node.details.inputPayload, null, 2)}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Output Result
                  </span>
                  <button
                    onClick={() => handleCopy(node.details.outputPayload, false)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline"
                  >
                    {copiedOutput ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedOutput ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-3 bg-[#0a0a0e] border border-[#22222d] rounded-xl text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                  {typeof node.details.outputPayload === 'string'
                    ? node.details.outputPayload
                    : JSON.stringify(node.details.outputPayload, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="p-3.5 bg-[#09090d] border border-[#20202a] rounded-xl font-mono text-xs space-y-2">
                {node.details.executionLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                    <span className="text-teal-400/90">✓</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 bg-[#14141b] rounded-xl border border-[#232330]">
                <h5 className="font-semibold text-white mb-1">Node Role & Purpose</h5>
                <p>{node.details.description}</p>
              </div>
              <div className="p-3.5 bg-[#14141b] rounded-xl border border-[#232330]">
                <h5 className="font-semibold text-white mb-1">Execution Semantics</h5>
                <p>{node.details.documentation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d0d11] border-t border-[#1f1f28] flex justify-between items-center text-xs text-zinc-400">
          <span>Click outside or press ESC to close</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
