import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { Package, Tags, ImageIcon, Mail, ArrowRight } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await api.get('/categories')).data.data,
    });

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => (await api.get('/product')).data.data,
    });

    const { data: banners = [] } = useQuery({
        queryKey: ['banners'],
        queryFn: async () => (await api.get('/banner')).data.data
    });

    const { data: messages = [] } = useQuery({
        queryKey: ['message'],
        queryFn: async () => (await api.get('/contact')).data.data,
    });

    const stats = [
        { title: 'Total Produk', count: products.length, icon: <Package className="w-6 h-6 text-emerald-400" />, link: '/products', color: 'bg-emerald-500/10 border-emerald-500/20' },
        { title: 'Kategori Produk', count: categories.length, icon: <Tags className="w-6 h-6 text-blue-400" />, link: '/categories', color: 'bg-blue-500/10 border-blue-500/20' },
        { title: 'Banner Promosi', count: banners.length, icon: <ImageIcon className="w-6 h-6 text-amber-400" />, link: '/banners', color: 'bg-amber-500/10 border-amber-500/20' },
        { title: 'Pesan Masuk', count: messages.length, icon: <Mail className="w-6 h-6 text-purple-400" />, link: '/messages', color: 'bg-purple-500/10 border-purple-500/20' },
    ];

    return (
        <div className="spaye-y-8">
            <PageHeader
                title="Dashboard"
                subtitle="Statistik toko"
            />

            {/* Grid Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`p-6 rounded-2xl border ${stat.color} bg-white shadow-sm flex flex-col justify-between space-y-4`}>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500">{stat.title}</span>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">{stat.icon}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-800">{stat.count}</div>
                        </div>
                        <Link to={stat.link} className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            <span>Kelola Data</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
