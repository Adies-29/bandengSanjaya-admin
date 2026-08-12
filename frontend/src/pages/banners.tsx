import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, Image as ImageIcon, Upload } from 'lucide-react';

import api from '../api/axios';
import type { Banner } from '../types';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

import { Button } from '../components/common/Button';
import { InputText } from '../components/common/inputText';
import { InputTextArea } from '../components/common/InputTextArea';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';

interface BannerFormInputs {
  title: string;
  description: string;
  is_active: boolean;
  imageFile?: FileList;
}

const Banners: React.FC = () => {
  const queryClient = useQueryClient();

  const formModal = useModal<Banner>();
  const deleteModal = useModal<Banner>();
  const { alert, showAlert, clearAlert } = useAlert();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: banners = [], isLoading, isError } = useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: async () => (await api.get('/banner')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BannerFormInputs>();

  const handleOpenAddModal = () => {
    setImagePreview(null);
    reset({ title: '', description: '', is_active: true });
    formModal.openModal();
  };

  const handleOpenEditModal = (banner: Banner) => {
    setImagePreview(banner.image);
    setValue('title', banner.title);
    setValue('description', banner.description || '');
    setValue('is_active', banner.is_active);
    formModal.openModal(banner);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: BannerFormInputs) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('is_active', String(data.is_active));

      if (data.imageFile?.[0]) {
        formData.append('image', data.imageFile[0]);
      }

      const url = formModal.selectedData ? `/banner/${formModal.selectedData.id}` : '/banner';
      const method = formModal.selectedData ? 'put' : 'post';

      return (await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })).data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      formModal.closeModel();
      showAlert(res.message || 'Banner berhasil disimpan!', 'success');
    },
    onError: (err: any) => {
      showAlert(err.response?.data?.message || 'Gagal menyimpan banner', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/banner/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      deleteModal.closeModel();
      showAlert(res.message || 'Banner berhasil dihapus!', 'success');
    },
    onError: (err: any) => {
      deleteModal.closeModel();
      showAlert(err.response?.data?.message || 'Gagal menghapus banner', 'error');
    },
  });

  const columns = useMemo<ColumnDef<Banner>[]>(
    () => [
      {
        accessorKey: 'image',
        header: 'Banner',
        cell: (info) => (
          <div className="w-24 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
            <img src={info.getValue<string>()} alt="Banner" className="w-full h-full object-cover" />
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Judul Banner',
        cell: (info) => (
          <div>
            <div className="font-semibold text-slate-800">{info.getValue<string>()}</div>
            <span className="text-xs text-slate-500">{info.row.original.description || '-'}</span>
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
            <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(info.row.original)}>
              <Edit2 className="w-4 h-4 text-emerald-400" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteModal.openModal(info.row.original)}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banner Promosi"
        subtitle="Kelola banner promosi hero section beranda toko"
        onAdd={handleOpenAddModal}
        addLabel="Tambah Banner"
      />

      <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />

      <Table
        columns={columns}
        data={banners}
        isLoading={isLoading}
        isError={isError}
        searchPlaceholder="Cari banner..."
        emptyIcon={<ImageIcon className="w-8 h-8 text-slate-500" />}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModel}
        title={formModal.selectedData ? 'Edit Banner' : 'Tambah Banner Baru'}
      >
        <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
          <InputText
            label="Judul Banner"
            placeholder="Contoh: Promo Spesial Hari Ini"
            error={errors.title?.message}
            {...register('title', { required: 'Judul banner wajib diisi' })}
          />

          <InputTextArea
            label="Deskripsi Banner"
            placeholder="Contoh: Diskon 20% Pembelian Bandeng Presto 1kg"
            error={errors.description?.message}
            {...register('description', { required: 'Deskripsi wajib diisi' })}
          />

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="w-4 h-4 accent-emerald-500 rounded border-slate-700 bg-slate-900"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-300 cursor-pointer">
              Tampilkan Banner ini di website (Status Aktif)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Foto Gambar Banner</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-24 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/60 border border-dashed border-slate-600 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-400 hover:text-white transition-all text-sm">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto Banner</span>
                {(() => {
                  const imageRegister = register('imageFile', {
                    required: !formModal.selectedData ? 'Gambar banner wajib diunggah' : false,
                  });
                  return (
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...imageRegister}
                      onChange={(e) => {
                        imageRegister.onChange(e);
                        if (e.target.files?.[0]) {
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  );
                })()}
              </label>
            </div>
            {errors.imageFile && (
              <p className="text-xs text-red-500 mt-1">{errors.imageFile.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
            <Button type="button" variant="outline" onClick={formModal.closeModel}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
              Simpan Banner
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModel}
        onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)}
        title="Hapus Banner"
        message={`Apakah Anda yakin ingin menghapus banner "${deleteModal.selectedData?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Banners;
