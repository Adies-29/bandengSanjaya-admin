import { useState } from "react";

export function useModal<T = any>() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<T | null>(null);

    const openModal = (data?: T) => {
        setSelectedData(data || null);
        setIsOpen(true);
    };

    const closeModel = () => {
        setIsOpen(false);
        setSelectedData(null);
    };

    return{
        isOpen,
        selectedData,
        openModal,
        closeModel,
    };
}