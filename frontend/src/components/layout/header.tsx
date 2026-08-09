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
    <header className="sticky top-0 z-30 h-16 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-all lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/80">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight capitalize">
              {admin?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};
