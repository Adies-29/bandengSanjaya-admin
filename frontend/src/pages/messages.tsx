import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useModal } from "../hooks/useModal";
import type { ContactMessage } from "../types";
import { useAlert } from "../hooks/useAlert";
import api from "../api/axios";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "../components/common/Badge";
import { formatDate } from "../components/common/Formatters";
import { Button } from "../components/common/Button";
import { Eye, Mail, Trash2 } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Table } from "../components/common/Table";
import { Alert } from "../components/common/Alert";
import { Modal } from "../components/common/Modal";
import { ConfirmModal } from "../components/common/ConfirmModal";

const Messages: React.FC = () => {
    const queryClient = useQueryClient();
    const deleteModal = useModal<ContactMessage>();
    const detailModal = useModal<ContactMessage>();
    const { alert, showAlert, clearAlert } = useAlert();

    const { data: message = [], isLoading, isError } = useQuery<ContactMessage[]>({
        queryKey: ['messages'],
        queryFn: async () => (await api.get(`/contact`)).data.data,
    });

    const readMutation = useMutation({
        mutationFn: async (id: number) => (await api.patch(`/contact/${id}/read`)).data,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => (await api.delete(`/contact/${id}`)).data,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            deleteModal.closeModel();
            showAlert(res.message || 'Pesan berhasil dihapus', 'success');
        },
        onError: (err: any) => {
            deleteModal.closeModel();
            showAlert(err.response?.data?.message || 'Gagal menghapus pesan', 'error');
        },
    });

    const handleOpenDetail = (msg: ContactMessage) => {
        detailModal.openModal(msg);
        if(!msg.is_read) {
            readMutation.mutate(msg.id);
        }
    };

    const columns = useMemo<ColumnDef<ContactMessage>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Pengirim',
                cell: (info) => (
                    <div>
                        <div className="font-semibold flex items-center gap-2">
                            <span>{info.getValue<string>()}</span>
                            {info.row.original.is_read && <Badge variant="danger">BARU</Badge>}
                        </div>
                        <span className="text-xs">{info.row.original.email || info.row.original.phone || '-'}</span>
                    </div>
                )
            },
            {
                accessorKey: 'subject',
                header: 'Subjek/pesan',
                cell: (info) => (
                    <div className="max-w-xs truncate">
                        <span className="font-medium">{info.getValue<string>() || 'Tanpa Subjek'}</span>
                        {info.row.original.message}
                    </div>
                ),
            },
            {
                accessorKey: 'created_at',
                header: 'Tanggal',
                cell: (info) => <span className="text-xs "> {formatDate(info.getValue<string>())}</span>,
            },
            {
                id: 'actions',
                header: 'Aksi',
                cell: (info) => (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(info.row.original)}
                        >
                            <Eye className="w-4 h-4 text-emerald-400"/>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteModal.openModal(info.row.original)}
                        >   
                            <Trash2 className="w-4 h-4 text-red-500"/>
                        </Button>
                    </div>
                ),
            },
        ],
        []
    )
    return (
    <div className="space-y-6">
      <PageHeader title="Pesan Masuk" subtitle="Pesan & pertanyaan dari pengunjung landing page website toko" />
      <Alert message={alert?.message || null} type={alert?.type || 'error'} onClose={clearAlert} />
      <Table columns={columns} data={message} isLoading={isLoading} isError={isError} searchPlaceholder="Cari pesan..." emptyIcon={<Mail className="w-8 h-8 text-slate-500" />} />
      {/* Modal Detail Pesan */}
      <Modal isOpen={detailModal.isOpen} onClose={detailModal.closeModel} title="Detail Pesan Masuk">
        {detailModal.selectedData && (
          <div className="space-y-4 text-sm text-slate-300">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-2">
              <p><strong className="text-white">Pengirim:</strong> {detailModal.selectedData.name}</p>
              <p><strong className="text-white">Email:</strong> {detailModal.selectedData.email || '-'}</p>
              <p><strong className="text-white">No. HP:</strong> {detailModal.selectedData.phone || '-'}</p>
              <p><strong className="text-white">Tanggal:</strong> {formatDate(detailModal.selectedData.created_at)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Isi Pesan:</h4>
              <p className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/80 leading-relaxed text-slate-200 whitespace-pre-wrap">
                {detailModal.selectedData.message}
              </p>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-700">
              <Button variant="outline" onClick={detailModal.closeModel}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmModal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModel} onConfirm={() => deleteModal.selectedData && deleteMutation.mutate(deleteModal.selectedData.id)} title="Hapus Pesan" message="Apakah Anda yakin ingin menghapus pesan ini?" isLoading={deleteMutation.isPending} />
    </div>
  );
};
export default Messages;