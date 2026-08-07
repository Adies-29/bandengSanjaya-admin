import React from 'react';
import { AlertCircle, CheckCircle2, InfoIcon, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  message: string | null;
  type?: 'error' | 'success' | 'warning' | 'info';
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type = 'error',
  onClose,
}) => {
  if (!message) return null;

  const styles = {
    error: {
      container: 'bg-red-500/10 text-red-300 border border-red-500/20',
      icon: <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />,
    },
    success: {
      container: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />,
    },
    warning: {
      container: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
      icon: <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />,
    },
    info: {
      container: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      icon: <InfoIcon className="w-5 h-5 shrink-0 text-blue-400" />,
    },
  };

  const currentStyle = styles[type];

  return (
    <div
      className={`mb-5 p-4 rounded-xl flex items-center justify-between gap-3 text-sm transition-all ${currentStyle.container}`}
    >
      <div className="flex items-center gap-3">
        {currentStyle.icon}
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
