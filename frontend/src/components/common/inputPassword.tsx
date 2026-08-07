import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { forwardRef, useState } from 'react';

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: string;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    ({ label, error, icon = <Lock className='w-5 h-5' />, className = '', ...props}, ref) => {
        const [showPass, setShowPass] = useState(false);

        return (
            <div className='w-full'>
                {label && (
                    <label className='block text-sm font-medium text-slate-300 mb-2'>
                        {label}
                    </label>
                )}
                <div className='relative'>
                    {icon && (
                        <div className='absolute inset-y-0 lexft-0 pl-3.5 flex items-center pointer-events-none text-slate-400'>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        type= {showPass ? 'text' : 'password'}
                        className={`w-full py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:otuline-none focus:ring-2 transition-all 
                            ${icon ? 'pl-11' : 'pl-4'}
                            pr-11 ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-offset-emerald-500'}
                            ${className}`}
                            {...props}
                    />
                    <button
                        type='button'
                        onClick={() => setShowPass(!showPass)}
                        className='absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors'
                    >
                        {showPass ? (
                            <EyeOff className='w-5 h-5'/>
                        ) : (
                            <Eye className="w-5 h-5"/>
                        )}
                    </button>
                </div>
                {error && <p className='text-xs text-red-400 mt-1.5'>{error}</p>}
            </div>
        );
    }
);

InputPassword.displayName = 'InputPassword';