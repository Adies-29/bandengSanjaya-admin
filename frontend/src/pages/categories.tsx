import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, Tags, Package } from 'lucide-react';

import api from '../api/axios';
import type { Category } from '../types';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';

import { Button } from '../components/common/Button';
import { InputText } from '../components/common/inputText';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';

interface CategoryFormInput {
  name: string;
}

const Categories: React.FC = () => {
  const queryClient = useQueryClient();
  const formModal = useModal<Category>();
  const deleteModal = useModal<Category>();
  const { alert, showAlert, clearAlert } = useAlert();

  const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormInput>();

  const handleOpenAddModal = () => {
    reset({ name: '' });
    formModal.openModal();
  };

  const handleOpenEditModal = (category: Category) => {
    setValue('name', category.name);
    formModal.openModal(category);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: CategoryFormInput) => {
      const url = formModal.selectedData ? `/categories/${formModal.selectedData.id}` : '/categories';
      const method = formModal.selectedData ? 'put' : 'post';
      return (await api[method](url, data)).data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      formModal.closeModel();
      showAlert(res.message || 'Kategori berhasil disimpan!', 'success');
    },
    onError: (err: any) => showAlert(err.response?.data?.message || 'Gagal menyimpan kategori', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/categories/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      deleteModal.closeModel();
      showAlert(res.message || 'Kategori berhasil dihapus!', 'success');
    },
    onError: (err: any) => {
      deleteModal.closeModel();
      showAlert(err.response?.data?.message || 'Gagal menghapus kategori', 'error');
    },
  });

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => (
          <span className="font-mono text-xs text-slate-500 font-semibold">#{info.getValue<number>()}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nama Kategori',
        cell: (info) => (
          <span className="font-semibold text-slate-800">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: '_count.products',
        header: 'Jumlah Produk',
        cell: (info) => (
          <Badge variant="info">
            <Package className="w-3.5 h-3.5 mr-1" />
            {info.row.original._count?.products || 0} Produk
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(info.row.original)}>
              <Edit2 className="w-4 h-4 text-emerald-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteModal.openModal(info.row.original)}>
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
      <PageHeader
        title="Kategori Produk"
        subtitle="Kelola daftar kategori produk olahan bandeng"
        onAdd={handleOpenAddModal}
        addLabel="Tambah Kategori"
      />

      <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />

      <Table
        columns={columns}
        data={categories}
        isLoading={isLoading}
        isError={isError}
        searchPlaceholder="Cari kategori..."
        emptyIcon={<Tags className="w-8 h-8 text-slate-400" />}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModel}
        title={formModal.selectedData ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <InputText
            label="Nama Kategori"
            placeholder="Contoh: Bandeng Presto, Pepes, dll."
            error={errors.name?.message}
            {...register('name', { required: 'Nama kategori wajib diisi' })}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={formModal.closeModel}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
              Simpan Kategori
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModel}
        onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)}
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${deleteModal.selectedData?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Categories;