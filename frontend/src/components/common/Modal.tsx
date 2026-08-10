import { X } from 'lucide-react';
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if(e.key === 'Escape') onClose();
        };
        if(isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in'>
            <div
                className='relative w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='flex items-center justify-between px-6 py-4 border-b border-slate-700'>
                    <h3 className='text-lg font-medium text-white'>{title}</h3>

                    <button
                        onClick={onClose}
                        className='p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all'
                    >

                        <X className='w-5 h-5'/>
                    </button>
                </div>

                <div className='p-5 overflow-y-auto'>{children}</div>

            </div>

        </div>
    );
};