// standar response
export interface ApiResponse<T = any > {
    status: 'Success' | 'Error';
    message: string;
    data?: T
}

// admin
export interface Admin {
    id: number;
    username: string;
    created_at?: string;
    updated_at?: string;
}

// login/auth
export interface LoginResponse {
    status: string;
    message: string;
    data?: {
        token: string;
        admin: Admin;
    };
}

//category
export interface Category {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
    _count?: {
        products: number;
    };
}

// products
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    badge?: string | null;
    weight_info?: string | null;
    category_id: number;
    category?: Category;
    created_at?: string;
    updated_at?: string; 
}

// store info
export interface StoreInfo {
    id: number;
    name: string;
    whatsapp_number: string;
    wa_tamplate_text: string;
    address: string;
    google_maps_url: string;
    opreational_hours:string;
    instagram_url?: string | null;
    facebook_url?: string | null;
    description: string;
    logo?: string | null;
    created_at?: string;
    updated_at?: string;
}

// banner
export interface Banner {
    id: number;
    image: string;
    title: string;
    description: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

// feature
export interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}


// contact message
export interface ContactMessage {
    id: number;
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at?: string;
    updated_at?: string;
}


export interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}