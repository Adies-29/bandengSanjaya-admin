import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma/prisma';
import { AuthRequest } from "../types/express";

// login admin
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: 'error',
        mesage: "Username dan password wajib diisi",
      });
    }

    //cari admin berdasarkan usename
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(400).json({
        status: 'error',
        message: "Usernam atau Password salah"
      });
    }

    //password hash
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: "Username atau password salah"
      });
    }

    //JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        status: 'error',
        message: 'JWT_SECRET belum dikonfigurasi',
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Login berhasil',
      daya: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
        },
      },
    });
  } catch (error) {
    console.error('Login error: ', error)
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server"
    });
  }
};

//GET profile admin
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        status: 'Error',
        message: 'Tidak terotentikasi',
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: {
        id: true,
        username: true,
        created_at: true,
        updated_at: true,
      },
    });

    return res.status(200).json({
      status: 'Success',
      message: "Data profile admin berhasil diambil",
      data: admin,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server',
    });

  }
}