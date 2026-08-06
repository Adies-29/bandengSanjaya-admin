import { Response, Request } from "express";
import { prisma } from "../prisma/prisma";

//get category
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return res.status(200).json({
            success: "Success",
            message: 'Berhasil mengambil daftar category',
            data: categories,
        });

    } catch (error) {
        console.error('getCategories error:', error);
        return res.status(500).json({
            success: 'Error',
            message: 'Koneksi server terputus mengambil data category.',
            error: error,
        });
    }
};


// Get category byId
export const getCategoriesById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const categoryId = parseInt(id as string, 10);

        if(isNaN(categoryId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id kategori tidak valid',
            });
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: {
                products: true
            }
        });

        if(!category) {
            return res.status(404).json({
                status: 'Error',
                message: 'Kategori tidak ditemukan',
                data: category,
            });
        }

        return res.status(200).json({
            status:'Success',
            message: 'Berhasil mengambil detail kategori',
            data: category,
        });
    } catch (error) {
        console.log('GetcategoryById error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengambil data category',
        });
    }
};

//Create category
export const createCategories = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if(!name || name.trim() === ''){
            return res.status(400).json({
                status: 'Error',
                messaga: 'Nama category wajib diisi'
            })
        }

        const newCategory = await prisma.category.create({
            data: {
                name: name.trim(),
            },
        });

        return res.status(201).json({
            status: 'Success',
            message: 'Category berhasil ditambahkan',
            data: newCategory,
        });
    } catch (error) {
        console.error('createCategory Error:', error)
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat menambahkan category'
        });
    }
};

// Update Category
export const updateCategories = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const caetgoryId = parseInt(id as string, 10);

        if(isNaN(caetgoryId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'ID kategori tidak valid',
            });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({
                status: 'Error',
                message: 'Nama category wajib diisi',
            });
        }

        const cekCategories = await prisma.category.findUnique({
            where: { id: caetgoryId },
        });

        if(!cekCategories) {
            return res.status(404).json({
                status: "Error",
                message: 'Category tidak ditemukan',
            });
        }

        const updateCategory = await prisma.category.update({
            where: { id: caetgoryId },
            data: {
                name: name.trim(),
            },
        });

        return res.status(200).json({
            status:'Success',
            message: 'Category berhasil diperbarui',
            data: updateCategory,
        });
    } catch (error) {
        console.error('UpdateCategory error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat memperbarui category',
        })
    }
}

//Delete category
export const deleteCategories = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const caetgoryId = parseInt(id as string, 10);

        if(isNaN(caetgoryId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id Category tidak valid',
            });
        }

        const cekCategories = await prisma.category.findUnique({
            where: { id: caetgoryId },
            include: {
                _count: {
                    select: {
                        products: true
                }}
            }
        });

        if(!cekCategories) {
            return res.status(404).json({
                status: 'Error',
                message: 'Category tidak ditemukan',
            });
        }

        if(cekCategories._count.products > 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Category tidak dapat dihapus, sendang di gunakan oleh product',
            });
        }

        await prisma.category.delete({
            where: { id:caetgoryId },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Category berhasil dihapus',
        });
    } catch (error) {
        console.error('deleteCategories error: ', error);
        return res.status(500).json({
            status: "Error",
            message: 'Terjadi kesalhan pada server saat menghapus category'
        });
    }
};

