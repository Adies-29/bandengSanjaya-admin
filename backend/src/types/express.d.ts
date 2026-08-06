import { Request } from "express";

export interface AdminPayLoad {
    id: number;
    username: string;
}

export interface AuthRequest extends Request {
    admin?: AdminPayLoad;
}