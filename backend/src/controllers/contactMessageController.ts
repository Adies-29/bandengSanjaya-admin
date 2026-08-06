import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";

// 1. CREATE CONTACT MESSAGE - Mengirim pesan dari form kontak (Public / Pengunjung Toko)
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, phone, subject, message } = req.body;

    if (!name || !phone || !subject || !message) {
      return res.status(400).json({
        status: 'Error',
        message: 'Nama, nomor telp/WA, subjek, dan pesan wajib diisi',
      });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        is_read: false,
      },
    });

    return res.status(201).json({
      status: 'Success',
      message: 'Pesan Anda berhasil terkirim. Terima kasih telah menghubungi kami!',
      data: newMessage,
    });
  } catch (error) {
    console.error('createContactMessage error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengirim pesan',
    });
  }
};

// 2. GET ALL CONTACT MESSAGES - Mengambil seluruh pesan masuk (Admin Only)
export const getContactMessages = async (req: Request, res: Response) => {
  try {
    const { is_read } = req.query;

    const whereCondition: any = {};
    if (is_read !== undefined) {
      whereCondition.is_read = is_read === 'true';
    }

    const messages = await prisma.contactMessage.findMany({
      where: whereCondition,
      orderBy: { created_at: 'desc' },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil daftar pesan masuk',
      data: messages,
    });
  } catch (error) {
    console.error('getContactMessages error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengambil pesan masuk',
    });
  }
};

// 3. GET CONTACT MESSAGE BY ID - Mengambil detail 1 pesan (Admin Only)
export const getContactMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messageId = parseInt(id as string, 10);

    if (isNaN(messageId)) {
      return res.status(400).json({
        status: 'Error',
        message: 'ID pesan tidak valid',
      });
    }

    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(404).json({
        status: 'Error',
        message: 'Pesan tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil detail pesan',
      data: message,
    });
  } catch (error) {
    console.error('getContactMessageById error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengambil detail pesan',
    });
  }
};

// 4. MARK MESSAGE AS READ - Menandai pesan sudah dibaca oleh Admin
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messageId = parseInt(id as string, 10);

    if (isNaN(messageId)) {
      return res.status(400).json({
        status: 'Error',
        message: 'ID pesan tidak valid',
      });
    }

    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return res.status(404).json({
        status: 'Error',
        message: 'Pesan tidak ditemukan',
      });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id: messageId },
      data: { is_read: true },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Pesan berhasil ditandai sebagai sudah dibaca',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('markMessageAsRead error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat mengubah status pesan',
    });
  }
};

// 5. DELETE CONTACT MESSAGE - Menghapus pesan masuk (Admin Only)
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messageId = parseInt(id as string, 10);

    if (isNaN(messageId)) {
      return res.status(400).json({
        status: 'Error',
        message: 'ID pesan tidak valid',
      });
    }

    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return res.status(404).json({
        status: 'Error',
        message: 'Pesan tidak ditemukan',
      });
    }

    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    return res.status(200).json({
      status: 'Success',
      message: 'Pesan berhasil dihapus',
    });
  } catch (error) {
    console.error('deleteContactMessage error:', error);
    return res.status(500).json({
      status: 'Error',
      message: 'Terjadi kesalahan pada server saat menghapus pesan',
    });
  }
};
