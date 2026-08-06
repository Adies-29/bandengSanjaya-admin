export interface ApiResponse<T = any> {
    status: 'Error' | 'Success';
    message: string;
    data?: T;
    error?: string
}