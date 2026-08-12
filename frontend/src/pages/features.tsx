import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useModal } from "../hooks/useModal";
import type { Feature } from "../types";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAlert } from "../hooks/useAlert";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { 
    Award, 
    ShieldCheck, 
    Star, 
    Truck, 
    Flame, 
    Heart, 
    CheckCircle, 
    BadgeCheck, 
    Package, 
    Utensils, 
    Clock, 
    Sparkles, 
    Zap, 
    Gift, 
    Leaf, 
    RefreshCw, 
    ShoppingBag, 
    ThumbsUp, 
    Edit2, 
    Trash2,
    Upload,
    Image as ImageIcon,
    LayoutGrid
} from "lucide-react";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Alert } from "../components/common/Alert";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { InputTextArea } from "../components/common/InputTextArea";
import { Modal } from "../components/common/Modal";
import { PageHeader } from "../components/common/PageHeader";
import { Table } from "../components/common/Table";
import { InputText } from "../components/common/inputText";

interface FeatureFormInputs {
    title: string;
    description: string;
    icon: string;
    is_active: boolean;
    imageFile?: FileList;
}

const AVAILABLE_ICONS = [
    { name: 'Award', label: 'Penghargaan / Prestasi', Icon: Award },
    { name: 'ShieldCheck', label: 'Terjamin / Halal', Icon: ShieldCheck },
    { name: 'Flame', label: 'Presto / Warm', Icon: Flame },
    { name: 'Star', label: 'Kualitas Utama', Icon: Star },
    { name: 'Truck', label: 'Pengiriman Cepat', Icon: Truck },
    { name: 'Heart', label: 'Kasih Sayang / Asli', Icon: Heart },
    { name: 'CheckCircle', label: 'Lulus Uji', Icon: CheckCircle },
    { name: 'BadgeCheck', label: 'Lencana Mutu', Icon: BadgeCheck },
    { name: 'Package', label: 'Kemasan Vacuum', Icon: Package },
    { name: 'Utensils', label: 'Rasa Lezat', Icon: Utensils },
    { name: 'Clock', label: 'Tahan Lama', Icon: Clock },
    { name: 'Sparkles', label: 'Spesial / Premium', Icon: Sparkles },
    { name: 'Zap', label: 'Proses Cepat', Icon: Zap },
    { name: 'Gift', label: 'Cocok Oleh-oleh', Icon: Gift },
    { name: 'Leaf', label: 'Rempah Alami', Icon: Leaf },
    { name: 'RefreshCw', label: 'Garansi Kesegaran', Icon: RefreshCw },
    { name: 'ShoppingBag', label: 'Oleh-oleh Khas', Icon: ShoppingBag },
    { name: 'ThumbsUp', label: 'Direkomendasikan', Icon: ThumbsUp },
];

const ICON_MAP: Record<string, React.ElementType> = {
    Award,
    ShieldCheck,
    Flame,
    Fire: Flame,
    Star,
    Truck,
    Heart,
    CheckCircle,
    BadgeCheck,
    Package,
    Utensils,
    Clock,
    Sparkles,
    Zap,
    Gift,
    Leaf,
    RefreshCw,
    ShoppingBag,
    ThumbsUp,
};

const RenderFeatureIcon: React.FC<{ name?: string; className?: string }> = ({ name = '', className = "w-5 h-5" }) => {
    if (!name) return <Award className={className} />;
    const normalized = name.trim();
    if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('/') || normalized.startsWith('data:')) {
        return <img src={normalized} alt="Icon" className={`${className} object-contain`} />;
    }
    const IconComp = ICON_MAP[normalized] || ICON_MAP[normalized.charAt(0).toUpperCase() + normalized.slice(1)] || Award;
    return <IconComp className={className} />;
};

const Features: React.FC = () => {
    const queryClient = useQueryClient();
    const formModal = useModal<Feature>();
    const deleteModal = useModal<Feature>();
    const { alert, showAlert, clearAlert } = useAlert();

    const [iconTab, setIconTab] = useState<'preset' | 'custom'>('preset');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data: features = [], isLoading, isError } = useQuery<Feature[]>({
        queryKey: ['features'],
        queryFn: async () => (await api.get('/feature')).data.data,
    });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FeatureFormInputs>();
    const currentIcon = watch('icon');

    const handleOpenAddModal = () => {
        reset({ title: '', description: '', icon: 'Award', is_active: true });
        setIconTab('preset');
        setImagePreview(null);
        formModal.openModal();
    };

    const handleOpenEditModal = (feature: Feature) => {
        setValue('title', feature.title);
        setValue('description', feature.description);
        setValue('icon', feature.icon || 'Award');
        setValue('is_active', feature.is_active);

        const isUrl = feature.icon && (feature.icon.startsWith('http') || feature.icon.startsWith('/') || feature.icon.startsWith('data:'));
        if (isUrl) {
            setIconTab('custom');
            setImagePreview(feature.icon);
        } else {
            setIconTab('preset');
            setImagePreview(null);
        }

        formModal.openModal(feature);
    };

    const saveMutation = useMutation({
        mutationFn: async (data: FeatureFormInputs) => {
            const url = formModal.selectedData ? `/feature/${formModal.selectedData.id}` : '/feature';
            const method = formModal.selectedData ? 'put' : 'post';

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('is_active', String(data.is_active));

            if (iconTab === 'custom') {
                if (data.imageFile && data.imageFile.length > 0) {
                    formData.append('image', data.imageFile[0]);
                } else if (currentIcon && (currentIcon.startsWith('http') || currentIcon.startsWith('/'))) {
                    formData.append('icon', currentIcon);
                }
            } else {
                formData.append('icon', data.icon || 'Award');
            }

            return (await api[method](url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })).data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
            formModal.closeModel();
            showAlert(res.message || 'Keunggulan toko berhasil disimpan', 'success');
        },
        onError: (err: any) => showAlert(err.response?.data?.message || 'Gagal menyimpan keunggulan', 'error'),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => (await api.delete(`/feature/${id}`)).data,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
            deleteModal.closeModel();
            showAlert(res.message || 'Keunggulan berhasil dihapus', 'success');
        },
    });

    const columns = useMemo<ColumnDef<Feature>[]>(
        () => [
            {
                accessorKey: 'icon',
                header: 'Ikon',
                cell: (info) => (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold overflow-hidden p-1">
                        <RenderFeatureIcon name={info.getValue<string>()} className="w-5 h-5 text-emerald-500" />
                    </div>
                ),
            },
            {
                accessorKey: 'title',
                header: 'Judul Keunggulan',
                cell: (Info) => (
                    <div>
                        <div className="font-semibold text-slate-800">{Info.getValue<string>()}</div>
                        <span className="text-xs text-slate-500">{Info.row.original.description}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: (info) => (
                    <Badge variant={info.getValue<boolean>() ? 'success' : 'slate'}>
                        {info.getValue<boolean>() ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                ),
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(info.row.original)}
                        >
                            <Edit2 className="w-4 h-4 text-emerald-600" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteModal.openModal(info.row.original)}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <div className="space-y-6">
            <PageHeader title="Keunggulan Toko" subtitle="Kelola nilai tambah & keunggulan produk di landing page" onAdd={handleOpenAddModal} addLabel="Tambah Keunggulan" />
            <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />
            <Table columns={columns} data={features} isLoading={isLoading} isError={isError} searchPlaceholder="Cari keunggulan..." emptyIcon={<Star className="w-8 h-8 text-slate-500" />} />
            
            <Modal isOpen={formModal.isOpen} onClose={formModal.closeModel} title={formModal.selectedData ? 'Edit Keunggulan' : 'Tambah Keunggulan'}>
                <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
                    <InputText label="Judul Keunggulan" placeholder="Contoh: 100% Halal MUI" error={errors.title?.message} {...register('title', { required: 'Judul wajib diisi' })} />
                    <InputTextArea label="Deskripsi Singkat" placeholder="Jelaskan detail keunggulan..." error={errors.description?.message} {...register('description', { required: 'Deskripsi wajib diisi' })} />
                    
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-700">Tampilan Ikon / Gambar</label>
                            
                            {/* Tab Switcher */}
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                                <button
                                    type="button"
                                    onClick={() => setIconTab('preset')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                                        iconTab === 'preset' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    Ikon Preset
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIconTab('custom')}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                                        iconTab === 'custom' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Upload Gambar
                                </button>
                            </div>
                        </div>

                        {iconTab === 'preset' ? (
                            <>
                                {/* Live Icon Preview & Selected Indicator */}
                                <div className="flex items-center gap-3 p-3 mb-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm shrink-0">
                                        <RenderFeatureIcon name={currentIcon} className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-emerald-800 font-medium">Ikon Terpilih:</div>
                                        <div className="text-sm font-bold text-slate-800 truncate">{currentIcon || 'Award'}</div>
                                    </div>
                                </div>

                                {/* Visual Icon Grid Picker */}
                                <div className="grid grid-cols-6 gap-2 p-2 max-h-44 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl">
                                    {AVAILABLE_ICONS.map(({ name, label, Icon }) => {
                                        const isSelected = currentIcon === name || (name === 'Flame' && currentIcon === 'Fire');
                                        return (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setValue('icon', name, { shouldValidate: true })}
                                                title={`${label} (${name})`}
                                                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                                                    isSelected
                                                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105 z-10'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-[9px] font-medium mt-1 truncate max-w-full">{name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <input type="hidden" {...register('icon')} />
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl transition-all">
                                    <div className="flex items-center gap-4">
                                        {(imagePreview || (currentIcon && currentIcon.startsWith('http'))) ? (
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                                                <img src={imagePreview || currentIcon} alt="Preview" className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center shrink-0">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}

                                        <label className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                                <Upload className="w-4 h-4" />
                                                <span>{imagePreview ? 'Ganti Gambar Custom' : 'Unggah Gambar Custom'}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Rekomendasi: <strong>Persegi (1:1), 128×128px</strong>. Maks 1MB (PNG transparan/SVG).
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                {...register('imageFile')}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setImagePreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 py-2">
                        <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 accent-emerald-500 rounded bg-slate-900 border-slate-700 cursor-pointer" />
                        <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">Status Aktif</label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <Button type="button" variant="outline" onClick={formModal.closeModel}>Batal</Button>
                        <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>Simpan Keunggulan</Button>
                    </div>
                </form>
            </Modal>
            
            <ConfirmModal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModel} onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)} title="Hapus Keunggulan" message={`Hapus keunggulan "${deleteModal.selectedData?.title}"?`} isLoading={deleteMutation.isPending} />
        </div>
    );
};

export default Features;