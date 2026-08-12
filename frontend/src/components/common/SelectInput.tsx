import type React from "react";
import { forwardRef } from "react";

interface Option {
    value: string | number;
    label: string;
}

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Option[];
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return(
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        error ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-emerald-500'
                
                    } ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-slate-800">
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        );
    }
);

SelectInput.displayName = 'SelectInput';