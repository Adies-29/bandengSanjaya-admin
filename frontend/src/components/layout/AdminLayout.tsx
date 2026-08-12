
import type React from "react";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Outlet } from "react-router-dom";

export const AdminLayout: React.FC = () => {
    const [SidebarOpen, setSidebarOpen] = useState(false);

    return(
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            <Sidebar isOpen={SidebarOpen} onClose={() => setSidebarOpen(false)}/>
            <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
                <Header onToggleSidebar={() => setSidebarOpen(!SidebarOpen)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};