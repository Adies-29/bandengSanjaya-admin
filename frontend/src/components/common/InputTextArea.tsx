import React, { forwardRef } from 'react';

interface InputTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  ({ label, error, rows = 3, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-700 focus:ring-emerald-500'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      </div>
    );
  }
);

InputTextArea.displayName = 'InputTextArea';
