import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2, Trash2, FileText, Upload, BookOpen, User } from 'lucide-react';

import api from '../api/axios';
import type { Blog } from '../types';
import { useModal } from '../hooks/useModal';
import { useAlert } from '../hooks/useAlert';
import { formatDate } from '../components/common/Formatters';

import { Button } from '../components/common/Button';
import { InputText } from '../components/common/inputText';
import { InputTextArea } from '../components/common/InputTextArea';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Alert } from '../components/common/Alert';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';

interface BlogFormInputs {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  is_published: boolean;
  imageFile?: FileList;
}

const Blogs: React.FC = () => {
  const queryClient = useQueryClient();
  const formModal = useModal<Blog>();
  const deleteModal = useModal<Blog>();
  const { alert, showAlert, clearAlert } = useAlert();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: blogs = [], isLoading, isError } = useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => (await api.get('/blogs')).data.data,
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<BlogFormInputs>();

  const handleOpenAddModal = () => {
    setImagePreview(null);
    reset({
      title: '',
      excerpt: '',
      content: '',
      author: 'Admin Bandeng Sanjaya',
      is_published: true,
    });
    formModal.openModal();
  };

  const handleOpenEditModal = (blog: Blog) => {
    setImagePreview(blog.image);
    setValue('title', blog.title);
    setValue('excerpt', blog.excerpt);
    setValue('content', blog.content);
    setValue('author', blog.author || 'Admin Bandeng Sanjaya');
    setValue('is_published', blog.is_published);
    formModal.openModal(blog);
  };

  const saveMutation = useMutation({
    mutationFn: async (data: BlogFormInputs) => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', data.content);
      formData.append('author', data.author);
      formData.append('is_published', data.is_published.toString());
      if (data.imageFile?.[0]) formData.append('image', data.imageFile[0]);

      const url = formModal.selectedData ? `/blogs/${formModal.selectedData.id}` : '/blogs';
      const method = formModal.selectedData ? 'put' : 'post';

      return (await api[method](url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      formModal.closeModel();
      showAlert(res.message || 'Artikel blog berhasil disimpan!', 'success');
    },
    onError: (err: any) => showAlert(err.response?.data?.message || 'Gagal menyimpan artikel blog', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/blogs/${id}`)).data,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      deleteModal.closeModel();
      showAlert(res.message || 'Artikel blog berhasil dihapus!', 'success');
    },
    onError: (err: any) => {
      deleteModal.closeModel();
      showAlert(err.response?.data?.message || 'Gagal menghapus artikel blog', 'error');
    },
  });

  const columns = useMemo<ColumnDef<Blog>[]>(
    () => [
      {
        accessorKey: 'image',
        header: 'Cover',
        cell: (info) => (
          <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img src={info.getValue<string>()} alt="Cover" className="w-full h-full object-cover" />
          </div>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Judul Artikel',
        cell: (info) => (
          <div className="max-w-md">
            <div className="font-semibold text-slate-800 line-clamp-1">{info.getValue<string>()}</div>
            <span className="text-xs text-slate-500 line-clamp-1">{info.row.original.excerpt}</span>
          </div>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Penulis & Tanggal',
        cell: (info) => (
          <div className="text-xs space-y-0.5">
            <div className="flex items-center gap-1 font-medium text-slate-700">
              <User className="w-3 h-3 text-slate-400" />
              <span>{info.getValue<string>()}</span>
            </div>
            <div className="text-slate-400">{info.row.original.created_at ? formatDate(info.row.original.created_at) : '-'}</div>
          </div>
        ),
      },
      {
        accessorKey: 'is_published',
        header: 'Status',
        cell: (info) => (
          <Badge variant={info.getValue<boolean>() ? 'success' : 'slate'}>
            {info.getValue<boolean>() ? 'Dipublikasi' : 'Draft'}
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
        title="Artikel & Blog"
        subtitle="Kelola artikel edukasi, resep, dan wawasan seputar bandeng presto"
        onAdd={handleOpenAddModal}
        addLabel="Tulis Artikel"
        icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
      />

      <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />

      <Table
        columns={columns}
        data={blogs}
        isLoading={isLoading}
        isError={isError}
        searchPlaceholder="Cari artikel blog..."
        emptyIcon={<FileText className="w-8 h-8 text-slate-400" />}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModel}
        title={formModal.selectedData ? 'Edit Artikel Blog' : 'Tulis Artikel Blog Baru'}
      >
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d))} className="space-y-4">
          <InputText
            label="Judul Artikel"
            placeholder="Contoh: 5 Resep Olahan Bandeng Presto Lezat & Mudah"
            error={errors.title?.message}
            {...register('title', { required: 'Judul artikel wajib diisi' })}
          />

          <InputText
            label="Penulis"
            placeholder="Contoh: Admin Bandeng Sanjaya"
            {...register('author')}
          />

          <InputTextArea
            label="Ringkasan Singkat (Excerpt)"
            rows={2}
            placeholder="Tulis ringkasan 1-2 kalimat untuk preview di beranda..."
            error={errors.excerpt?.message}
            {...register('excerpt', { required: 'Ringkasan wajib diisi' })}
          />

          <InputTextArea
            label="Isi Artikel Lengkap"
            rows={6}
            placeholder="Tuliskan konten artikel secara lengkap..."
            error={errors.content?.message}
            {...register('content', { required: 'Isi artikel wajib diisi' })}
          />

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="is_published"
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              {...register('is_published')}
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-700 cursor-pointer">
              Publikasikan Artikel Ini (Tampilkan di Website)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto Cover Artikel</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer text-slate-600 text-sm">
                <Upload className="w-4 h-4" />
                <span>Pilih Foto Cover</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('imageFile')}
                  onChange={(e) => e.target.files?.[0] && setImagePreview(URL.createObjectURL(e.target.files[0]))}
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={formModal.closeModel}>
              Batal
            </Button>
            <Button type="submit" variant="primary" isLoading={saveMutation.isPending}>
              Simpan Artikel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModel}
        onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)}
        title="Hapus Artikel"
        message={`Apakah Anda yakin ingin menghapus artikel "${deleteModal.selectedData?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Blogs;
