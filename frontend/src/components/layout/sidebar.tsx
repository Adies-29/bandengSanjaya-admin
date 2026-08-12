import type React from "react";
import { useAuthStore } from "../../store/authStore";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, ImageIcon, LayoutDashboard, LogOut, MessageSquare, ShoppingBag, Star, Store, Tags, X } from "lucide-react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Kategori Produk', path: '/categories', icon: Tags },
        { label: 'Daftar Produk', path: '/products', icon: ShoppingBag },
        { label: 'Infomasi Toko', path: '/store-info', icon: Store },
        { label: 'Banner', path: '/banners', icon: ImageIcon },
        { label: 'Keunggulan Toko', path: '/features', icon: Star },
        { label: 'Pesan Masuk', path: '/messages', icon: MessageSquare },
        { label: 'Artikel Blog', path: '/blogs', icon: BookOpen },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login')
    };

    return (
        <>
            {isOpen && (
                <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? `translate-x-0` : `-translate-x-full`}`}
            >
                <div>
                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                                BS
                            </div>
                            <div>
                                <h1 className="font-bold text-slate-800 text-base leading-tight">
                                    Bandeng Sanjaya
                                </h1>
                                <p className="text-xs text-slate-500">Admin Panel</p>
                            </div>
                        </div>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
                            >
                                <X className="w-5 h-5" />

                            </button>
                        )}
                    </div>
                    <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-600 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        {/* Bottom Section (Tombol Logout) */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};