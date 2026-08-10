import React, { forwardRef } from 'react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?:string;
    error?:string;
    icon?:React.ReactNode;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps> (
    ({ label, error, icon, className = '', ...props }, ref) => {
        return(
            <div className='w-full'>
                {label && (
                    <label className='block text-sm font-medium text-slate-300 mb-2' >
                        {label}
                    </label>
                )}
                <div className='relative'>
                    {icon && (
                        <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400:'>
                            {icon}
                        </div>
                    )}
                    <input
                    ref={ref}
                    className={`w-full py-3 border rounded-xlplaceholder-slate-500 focus:outline-none focus:ring-2 transition-all
                        ${icon ? 'pl-11 pr-4' : 'px-4'}
                        ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-emerald-500'}
                        ${className}`}
                        {...props}
                    />
                </div>
                {error && <p className='text-xs text-red-400 mt-1.5'>{error}</p>}
            </div>
        );
    }
);

InputText.displayName  = 'InputText';