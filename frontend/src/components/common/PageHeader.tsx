import type React from "react";
import { Button } from "./Button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    onAdd?: () => void;
    addLabel?: string;
    action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    onAdd,
    addLabel = 'Tambah Data',
    action,
}) => {
    return(
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
                <p className="text-sm mt-1">{subtitle}</p>
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