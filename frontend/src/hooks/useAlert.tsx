import { useState } from "react"

export function useAlert() {
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showAlert = (message: string, type: 'success' | 'error'= 'success') => {
        setAlert({ message, type });
    };

    const clearAlert = () => setAlert(null);

    return{
        alert,
        showAlert,
        clearAlert
    };
}