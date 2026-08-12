import React from 'react';
import { Menu, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  title = 'Dashboard',
}) => {
  const admin = useAuthStore((state) => state.admin);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-bold text-slate-800 tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-tight capitalize">
              {admin?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-emerald-600 font-medium">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};
