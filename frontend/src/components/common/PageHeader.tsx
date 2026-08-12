import type React from "react";
import { Button } from "./Button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    onAdd?: () => void;
    addLabel?: string;
    action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    icon,
    onAdd,
    addLabel = 'Tambah Data',
    action,
}) => {
    return(
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
                {icon && <div className="p-2 border border-slate-700/50 rounded-xl">{icon}</div>}
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-wide">{title}</h1>
                    <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
                </div>
            </div>

            {action ? (
                action
            ) : (
                onAdd && (
                    <Button onClick={onAdd} icon={<Plus className="w-5 h-5"/>} variant="primary">
                        {addLabel}
                    </Button>
                )
            )}
        </div>
    );
};