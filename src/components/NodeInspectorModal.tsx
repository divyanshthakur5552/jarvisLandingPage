"use client";
import React, { useState, useEffect } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (node) {
      const t = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(t);
    }
  }, [node]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 120);
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

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

  const renderJson = (obj: any) => {
    if (typeof obj === 'string') return <div className="text-zinc-400">{obj}</div>;
    const jsonStr = JSON.stringify(obj, null, 2);
    
    const html = jsonStr
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = `style="color: ${colorDef.hex}; opacity: 0.8"`;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                return `<span class="text-zinc-500">${match.slice(0, -1)}</span><span class="text-zinc-700">:</span>`;
            }
        } else if (/null/.test(match)) {
            cls = 'class="text-zinc-500"';
        }
        return `<span ${cls}>${match}</span>`;
      })
      .replace(/([\{\}\[\],])/g, '<span class="text-zinc-700">$1</span>');

    return <pre className="font-mono text-xs leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const renderStateTrack = () => {
    const states = ['idle', 'running', 'done'] as const;
    const currentIndex = states.indexOf(node.state as any);
    
    return (
      <div className="flex items-center gap-0">
        {states.map((s, idx) => {
          const isPast = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isDone = s === 'done' && isCurrent;
  
          let dotClass = "w-[14px] h-[14px] rounded-full flex items-center justify-center border text-[8px] z-10 transition-colors ";
          let dotStyle = {};
          
          if (isPast) {
            dotClass += "bg-zinc-700 border-zinc-600 text-zinc-400 cursor-pointer";
          } else if (isCurrent) {
            dotClass += "cursor-pointer";
            dotStyle = { backgroundColor: colorDef.hex, borderColor: colorDef.hex, color: '#fff' };
          } else {
            dotClass += "bg-transparent border-zinc-600 text-transparent cursor-pointer";
          }
  
          return (
            <React.Fragment key={s}>
              <div 
                className={dotClass} 
                style={dotStyle}
                onClick={() => onStateChange && onStateChange(node.id, s)}
                title={`Set to ${s}`}
              >
                {isDone ? <Check size={8} strokeWidth={3} /> : null}
              </div>
              {idx < states.length - 1 && (
                <div className={`w-6 h-px ${idx < currentIndex ? 'bg-zinc-600' : 'bg-zinc-700/50'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 modal-backdrop ${isOpen && !isClosing ? 'open' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-xl bg-[#111114] border border-[#23232c] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] modal-panel ${isOpen && !isClosing ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#23232c] bg-[#14141a]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${colorDef.hex}22`, color: colorDef.hex }}
            >
              <NodeIcon name={node.iconName} size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-medium text-zinc-100 tracking-tight">{node.title}</h3>
                <span
                  className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border"
                  style={{
                    backgroundColor: `${colorDef.bgHex}40`,
                    borderColor: `${colorDef.borderHex}40`,
                    color: colorDef.textHex,
                    clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
                  }}
                >
                  {node.type}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-1 tracking-wide">{node.details.plane}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md text-zinc-500 transition-colors hover:text-zinc-300"
              onMouseEnter={(e) => { e.currentTarget.style.color = colorDef.hex; e.currentTarget.style.backgroundColor = `${colorDef.hex}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.backgroundColor = ''; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-[#0d0d11] border-b border-[#1f1f28] text-xs">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-zinc-600" />
            <span className="font-sans text-zinc-500">Latency: <strong className="text-zinc-300 font-mono font-normal ml-1">{node.details.latencyMs}ms</strong></span>
          </div>
          <div className="flex items-center gap-2 col-span-2 truncate">
            <Cpu size={13} className="text-zinc-600 flex-shrink-0" />
            <span className="font-sans text-zinc-500 truncate">Stack: <strong className="text-zinc-300 font-mono font-normal ml-1">{node.details.techStack}</strong></span>
          </div>
        </div>

        {/* Manual State Toggle Bar (Presentation Helper) */}
        {onStateChange && (
          <div className="px-5 py-3 bg-[#111116] border-b border-[#1f1f28] flex items-center justify-between">
            <span className="text-xs font-sans text-zinc-500 flex items-center gap-1.5">
              <Activity size={13} className="text-zinc-600" />
              Node State Preview:
            </span>
            {renderStateTrack()}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#23232c] px-5 bg-[#14141a]">
          {(['payload', 'logs', 'docs'] as const).map((tab) => {
            const labels = {
              payload: 'Telemetry & Payloads',
              logs: `Execution Trace (${node.details.executionLog.length})`,
              docs: 'Architecture Spec'
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-[10px] uppercase font-mono tracking-widest relative transition-colors ${
                  isActive ? 'text-zinc-200 font-medium' : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                {labels[tab]}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ backgroundColor: colorDef.hex }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0b0b0e]">
          {activeTab === 'payload' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
                    Input Parameters
                  </span>
                  <button
                    onClick={() => handleCopy(node.details.inputPayload, true)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors font-sans"
                  >
                    {copiedInput ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedInput ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <div className="p-3 bg-[#111116] border border-[#23232c] rounded-lg">
                  {renderJson(node.details.inputPayload)}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
                    Output Result
                  </span>
                  <button
                    onClick={() => handleCopy(node.details.outputPayload, false)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors font-sans"
                  >
                    {copiedOutput ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    {copiedOutput ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <div className="p-3 bg-[#111116] border border-[#23232c] rounded-lg">
                  {renderJson(node.details.outputPayload)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="p-4 bg-[#111116] border border-[#23232c] rounded-lg font-mono text-xs space-y-2.5">
                {node.details.executionLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-zinc-300">
                    <span className="text-zinc-600 select-none">[{idx + 1}]</span>
                    <span style={{ color: colorDef.hex }} className="opacity-80">✓</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-sans">
              <div className="p-4 bg-[#111116] rounded-lg border border-[#23232c]">
                <h5 className="font-medium text-zinc-100 mb-1.5">Node Role & Purpose</h5>
                <p className="text-zinc-400">{node.details.description}</p>
              </div>
              <div className="p-4 bg-[#111116] rounded-lg border border-[#23232c]">
                <h5 className="font-medium text-zinc-100 mb-1.5">Execution Semantics</h5>
                <p className="text-zinc-400">{node.details.documentation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#111114] border-t border-[#23232c] flex justify-between items-center text-xs">
          <span className="text-zinc-600 font-sans font-light">Click outside or press ESC to close</span>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-md bg-[#1a1a24] hover:bg-[#22222c] border border-[#2a2a35] text-zinc-300 font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
