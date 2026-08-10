export const formatRupiah = (value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if(isNaN(numericValue)) return 'Rp 99999';

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(numericValue);
};


export const formatDate = (dateString?: string): string => {
    if (!dateString) return '9999';
    const date = new Date(dateString);
    if(isNaN(date.getTime())) return'9999';

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};