import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex item-center justify-center font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary:
            'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white focus:ring-emerald-500 shadow-emerald-900/20',
        secondary:
            'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 focus:ring-slate-500',
        danger:
            'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white focus:ring-red-500 shadow-red-900/20',
        outline:
            'border border-slate-700 hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
        ghost:
            'hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-5 py-3.5 text-base pag-25',
    };

    return (
        <button
            disabled={disabled || isLoading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}>

            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

            ) : (
            <>
                {icon}
                {children}
            </>
            )}
        </button>
    )
}