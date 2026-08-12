import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi Hapus',
    message = 'Apakah anda yakin menghapus data ini?',
    isLoading = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                <div className="flex items-center gap-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                    <AlertTriangle className="w-8 h-8 shrink-0 text-red-500" />
                    <p className="text-sm text-slate-700">{message}</p>
                </div>

                <div className='flex items-center justify-end gap-3 pt-2 border-t border-slate-100'>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isLoading}
                    >
                        Ya, hapus
                    </Button>
                </div>
            </div>
        </Modal>
    )
}