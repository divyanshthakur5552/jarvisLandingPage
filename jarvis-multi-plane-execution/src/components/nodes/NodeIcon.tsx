import React from 'react';
import {
  Terminal,
  Bot,
  Sparkles,
  Database,
  Library,
  GitFork,
  FileCode,
  Keyboard,
  Camera,
  ScanEye,
  Eye,
  MousePointer,
  CheckCircle2,
  Check,
  Cpu,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';

interface NodeIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const NodeIcon: React.FC<NodeIconProps> = ({ name, className = '', size = 16 }) => {
  switch (name) {
    case 'Terminal':
      return <Terminal size={size} className={className} />;
    case 'Bot':
      return <Bot size={size} className={className} />;
    case 'Sparkles':
      return <Sparkles size={size} className={className} />;
    case 'Database':
      return <Database size={size} className={className} />;
    case 'Library':
      return <Library size={size} className={className} />;
    case 'GitFork':
      return <GitFork size={size} className={className} />;
    case 'FileCode':
      return <FileCode size={size} className={className} />;
    case 'Keyboard':
      return <Keyboard size={size} className={className} />;
    case 'Camera':
      return <Camera size={size} className={className} />;
    case 'ScanEye':
      return <ScanEye size={size} className={className} />;
    case 'Eye':
      return <Eye size={size} className={className} />;
    case 'MousePointer':
      return <MousePointer size={size} className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 size={size} className={className} />;
    case 'Check':
      return <Check size={size} className={className} />;
    case 'Cpu':
      return <Cpu size={size} className={className} />;
    case 'Layers':
      return <Layers size={size} className={className} />;
    case 'Plus':
      return <Plus size={size} className={className} />;
    default:
      return <ArrowRight size={size} className={className} />;
  }
};
