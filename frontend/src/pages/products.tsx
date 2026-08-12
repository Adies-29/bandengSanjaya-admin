import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, ShoppingBag, Upload } from 'lucide-react';

import api from '../api/axios';
import type { Product, Category } from '../types';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';
import { formatRupiah } from '../components/common/Formatters';

import { Button } from '../components/common/Button';
import { InputText } from '../components/common/inputText';
import { SelectInput } from '../components/common/SelectInput';
import { InputTextArea } from '../components/common/InputTextArea';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';

interface ProductFormInputs {
  name: string;
  description: string;
  price: number;
  badge?: string;
  weight_info?: string;
  category_id: number;
  imageFile?: FileList;
}

const Products: React.FC = () => {
  const queryClient = useQueryClient();
  const formModal = useModal<Product>();
  const deleteModal = useModal<Product>();
  const { alert, showAlert, clearAlert } = useAlert();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/product')).data.data,
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormInputs>();

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const handleOpenAddModal = () => {
    setImagePreview(null);
    reset({
      name: '',
      description: '',
      price: 0,
      badge: '',
      weight_info: '',
      category_id: categories[0]?.id || 1,
    });
    formModal.openModal();
  };

  const handleOpenEditModal = (product: Product) => {
    setImagePreview(product.image);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('badge', product.badge || '');
    setValue('weight_info', product.weight_info || '');
    setValue('category_id', product.category_id);
    formModal.openModal(product);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: ProductFormInputs) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category_id', data.category_id.toString());
      if (data.badge) formData.append('badge', data.badge);
      if (data.weight_info) formData.append('weight_info', data.weight_info);
      if (data.imageFile?.[0]) formData.append('image', data.imageFile[0]);

      const url = formModal.selectedData ? `/product/${formModal.selectedData.id}` : '/product';
      const method = formModal.selectedData ? 'put' : 'post';

      return (await api[method](url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      formModal.closeModel();
      showAlert(res.message || 'Produk berhasil disimpan!', 'success');
    },
    onError: (err: any) => showAlert(err.response?.data?.message || 'Gagal menyimpan produk', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/product/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      deleteModal.closeModel();
      showAlert(res.message || 'Produk berhasil dihapus!', 'success');
    },
    onError: (err: any) => {
      deleteModal.closeModel();
      showAlert(err.response?.data?.message || 'Gagal menghapus produk', 'error');
    },
  });

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'image',
        header: 'Gambar',
        cell: (info) => (
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img src={info.getValue<string>()} alt="Product" className="w-full h-full object-cover" />
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Nama Produk',
        cell: (info) => (
          <div>
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <span>{info.getValue<string>()}</span>
              {info.row.original.badge && <Badge variant="warning">{info.row.original.badge}</Badge>}
            </div>
            <span className="text-xs text-slate-500">{info.row.original.weight_info || 'Kemasan standar'}</span>
          </div>
        ),
      },
      {
        accessorKey: 'category.name',
        header: 'Kategori',
        cell: (info) => <Badge variant="info">{info.row.original.category?.name || 'Kategori'}</Badge>,
      },
      {
        accessorKey: 'price',
        header: 'Harga',
        cell: (info) => <span className="font-semibold text-emerald-600">{formatRupiah(info.getValue<number>())}</span>,
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
        title="Daftar Produk"
        subtitle="Kelola varian produk olahan bandeng presto & oleh-oleh"
        onAdd={handleOpenAddModal}
        addLabel="Tambah Produk"
      />

      <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />

      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        isError={isError}
        searchPlaceholder="Cari produk..."
        emptyIcon={<ShoppingBag className="w-8 h-8 text-slate-400" />}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModel}
        title={formModal.selectedData ? 'Edit Produk' : 'Tambah Produk Baru'}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <InputText label="Nama Produk" placeholder="Contoh: Bandeng Presto Vacuum 1kg" error={errors.name?.message} {...register('name', { required: 'Nama wajib diisi' })} />

          <SelectInput label="Kategori Produk" options={categoryOptions} {...register('category_id', { valueAsNumber: true })} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText label="Harga (Rp)" type="number" placeholder="133000" error={errors.price?.message} {...register('price', { required: 'Harga wajib diisi', valueAsNumber: true })} />
            <InputText label="Info Berat / Kemasan" placeholder="Contoh: 1 kg (isi 5-6 ekor)" {...register('weight_info')} />
          </div>

          <InputText label="Badge Promo (Opsional)" placeholder="Contoh: BEST SELLER" {...register('badge')} />

          <InputTextArea label="Deskripsi Produk" placeholder="Jelaskan keunggulan & rincian produk..." error={errors.description?.message} {...register('description', { required: 'Deskripsi wajib diisi' })} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Produk</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-600 text-sm">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto Gambar</span>
                {(() => {
                  const imageRegister = register('imageFile', {
                    required: !formModal.selectedData ? 'Gambar produk wajib diunggah' : false,
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={formModal.closeModel}>Batal</Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>Simpan Produk</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModel}
        onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${deleteModal.selectedData?.name}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Products;