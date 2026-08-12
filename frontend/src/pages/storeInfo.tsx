import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAlert } from "../hooks/useAlert";
import type { StoreInfo as storeInfoType } from "../types";
import api from "../api/axios";
import { PageHeader } from "../components/common/PageHeader";
import { Alert } from "../components/common/Alert";
import { InputText } from "../components/common/inputText";
import { InputTextArea } from "../components/common/InputTextArea";
import { Button } from "../components/common/Button";
import { Save, Store } from "lucide-react";

interface StoreInfoFormInputs extends Omit<storeInfoType, 'id' | 'logo'> {
    logo?: FileList;
}

const StoreInfoPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { alert, showAlert, clearAlert } = useAlert();

    const { data: storeInfo, isLoading } = useQuery<storeInfoType>({
        queryKey: ['storeInfo'],
        queryFn: async () => (await api.get('/store-info')).data.data,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<StoreInfoFormInputs>();

    useEffect(() => {
        if (storeInfo) {
            reset({
                name: storeInfo.name || '',
                whatsapp_number: storeInfo.whatsapp_number || '',
                wa_tamplate_text: storeInfo.wa_tamplate_text || '',
                address: storeInfo.address || '',
                google_maps_url: storeInfo.google_maps_url || '',
                opreational_hours: storeInfo.opreational_hours || '',
                instagram_url: storeInfo.instagram_url || '',
                facebook_url: storeInfo.facebook_url || '',
                description: storeInfo.description || '',
            });
        }
    }, [storeInfo, reset]);

    const updateMutation = useMutation({
        mutationFn: async (data: StoreInfoFormInputs) => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'logo') {
                    if (value && value.length > 0) {
                        formData.append('logo', value[0]);
                    }
                } else if (value !== undefined && value !== null) {
                    formData.append(key, value as string);
                }
            });
            return (await api.put('/store-info', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })).data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['storeInfo'] });
            showAlert(res.message || 'Informasi toko berhasil diperbarui', 'success');
        },
        onError: (err: any) => {
            showAlert(err.response?.data?.message || 'Gagal memperbarui informasi toko', 'error');
        }
    });

    const onSubmit = (data: StoreInfoFormInputs) => {
        updateMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="p-6 text-slate-400">
                Memuat data informasi toko...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <PageHeader
                title="Informasi Toko"
                subtitle="Kelola detail dan informasi toko Bandeng Sanjaya"
                icon={<Store className="w-6 h-6 text-emerald-400" />}
            />

            <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputText
                        label="Nama Toko"
                        error={errors.name?.message}
                        {...register('name', { required: 'Nama toko wajib diisi' })}
                    />
                    <InputText
                        label="Nomor WhatsApp"
                        error={errors.whatsapp_number?.message}
                        {...register('whatsapp_number', { required: 'Nomor WhatsApp wajib diisi' })}
                    />
                    <InputText
                        label="Template Pesan WhatsApp"
                        error={errors.wa_tamplate_text?.message}
                        {...register('wa_tamplate_text')}
                    />
                    <InputText
                        label="Jam Operasional"
                        error={errors.opreational_hours?.message}
                        {...register('opreational_hours')}
                    />
                    <InputText
                        label="URL Google Maps"
                        error={errors.google_maps_url?.message}
                        {...register('google_maps_url')}
                    />
                    <InputText
                        label="URL Instagram"
                        error={errors.instagram_url?.message}
                        {...register('instagram_url')}
                    />
                    <InputText
                        label="URL Facebook"
                        error={errors.facebook_url?.message}
                        {...register('facebook_url')}
                    />
                    <InputText
                        label="Logo Toko"
                        type="file"
                        accept="image/*"
                        {...register('logo')}
                    />
                </div>

                <InputTextArea
                    label="Alamat Lengkap"
                    rows={3}
                    error={errors.address?.message}
                    {...register('address', { required: 'Alamat wajib diisi' })}
                />

                <InputTextArea
                    label="Deskripsi Toko"
                    rows={4}
                    error={errors.description?.message}
                    {...register('description')}
                />

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={updateMutation.isPending}
                        icon={<Save className="w-4 h-4" />}
                    >
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StoreInfoPage;