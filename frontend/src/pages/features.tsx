import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useModal } from "../hooks/useModal";
import type { Feature } from "../types";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { useAlert } from "../hooks/useAlert";
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Award, Edit2, Star, Trash2 } from "lucide-react";
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
}

const Features: React.FC = () => {
    const queryClient = useQueryClient();
    const formModal = useModal<Feature>();
    const deleteModal = useModal<Feature>();
    const { alert, showAlert, clearAlert } = useAlert();

    const { data: features = [], isLoading, isError } = useQuery<Feature[]>({
        queryKey: ['features'],
        queryFn: async () => (await api.get('/feature')).data.data,
    });

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FeatureFormInputs>();

    const handleOpenAddModal = () => {
        reset({ title: '', description: '', icon: '', is_active: true });
        formModal.openModal();
    };

    const handleOpenEditModal = (feature: Feature) => {
        setValue('title', feature.title);
        setValue('description', feature.description);
        setValue('icon', feature.icon);
        setValue('is_active', feature.is_active);
        formModal.openModal(feature);
    };

    const saveMutation = useMutation({
        mutationFn: async (data: FeatureFormInputs) => {
            const url = formModal.selectedData ? `/feature/${formModal.selectedData.id}` : '/feature';
            const method = formModal.selectedData ? 'put' : 'post';
            return (await api[method](url, data)).data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['features'] });
            formModal.closeModel();
            showAlert(res.message || 'Keunggulan toko berhasil disimapn', 'success');
        },
        onError: (err: any) => showAlert(err.response?.data?.message || 'Gagal menyimpan keunggulna', 'error'),

    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => (await api.delete(`/feature/${id}`)).data,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['/features'] });
            deleteModal.closeModel();
            showAlert(res.message || 'Keunggunlan berhasil dihapus', 'success');
        },
    });

    const columns = useMemo<ColumnDef<Feature>[]>(
        () => [
            {
                accessorKey: 'icon',
                header: 'Ikon',
                cell: () => (
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Award className="w-5 h-5" />
                    </div>
                ),
            },
            {
                accessorKey: 'title',
                header: 'Judul Keunggulan',
                cell: (Info) => (
                    <div>
                        <div className="font-semibold">{Info.getValue<string>()}</div>
                        <span className="text-xs ">{Info.row.original.description}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'is_active',
                header: 'Status',
                cell: (info) => (
                    <Badge variant={info.getValue<boolean>() ? 'success' : 'success'}>
                        {info.getValue<boolean>() ? 'aktif' : 'Non-Aktif'}
                    </Badge>
                ),
            },
            {
                id: 'acrions',
                header: 'Aksi',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(info.row.original)}
                        >
                            <Edit2 className="w-4 h-5 text-emerald-500" />
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
                    <InputText label="Nama Ikon (Lucide Icon)" placeholder="Contoh: ShieldCheck / Award / Heart" {...register('icon')} />
                    <div className="flex items-center gap-3 py-2">
                        <input type="checkbox" id="is_active" {...register('is_active')} className="w-4 h-4 accent-emerald-500 rounded bg-slate-900 border-slate-700" />
                        <label htmlFor="is_active" className="text-sm font-medium text-slate-300">Status Aktif</label>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
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