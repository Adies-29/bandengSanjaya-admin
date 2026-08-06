import { create } from "zustand";
import type { Admin } from "../types";

interface AuthState {
    token: string | null;
    admin: Admin | null;
    isAuthenticated: boolean;
    login: (token: string, admin: Admin) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    admin: localStorage.getItem('admin')
        ? JSON.parse(localStorage.getItem('admin')!)
        : null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: (token: string, admin: Admin) => {
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        set({
            token,
            admin,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        set({
            token: null,
            admin: null,
            isAuthenticated: false,
        });
    },
}));