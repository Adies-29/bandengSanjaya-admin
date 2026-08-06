import { Request, Response, NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import { AdminPayLoad, AuthRequest } from "../types/express";

export  const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Akses ditolak token tidak ditemukan'});

    }
    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as unknown as AdminPayLoad;
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Token tidak valid'});
        
    }
};