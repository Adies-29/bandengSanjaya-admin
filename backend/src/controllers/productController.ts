import { Request, Response } from "express";
import { prisma } from'../prisma/prisma';


//get product
export const getProduct = async (req: Request, res: Response) =>{
    try {
        const { category_id, search } = req.query;
        const whereCondition: any = {};
        
        if (category_id) {
            whereCondition.category_id = parseInt(category_id as string,10);
        }

        if (search) {
            whereCondition.name = {
                contains: search as string,
                mode: 'insensitive',
            };
        }

        const products = await prisma.product.findMany({
            where: whereCondition,
            include: {
                category: true,
            },
            orderBy: { created_at: 'desc' },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Berhasil mengambil daftar product',
            data: products,
        });
    } catch (error) {
        console.error('getProducts Error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengambil data proudct',
        });
    }

};

//get productById
export const getProductById = async (req: Request, res:Response) => {
    try {
        const { id } = req.params;
        const productId = parseInt(id as string, 10);

        if(isNaN(productId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id product tidak valid',
            });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
            },
        });

        if (!product) {
            return res.status(400).json({
                status:'Error',
                message: 'Product tidak ditemukan',
            });
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Berhasil mengambil detail product',
            data: product,
        });
        
    } catch (error) {
        console.error('getProductById error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengambil detail product',

        });
    }
};

//create product
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, badge, weight_info, category_id } = req.body;

        const image = req.file ? req.file.path : req.body.image;

        if(!name || !description || !price || !category_id) { 
            return res.status(400).json({
                status: 'Error',
                message: 'name, description, price, category_id wajib diisi',
            });
        }

        if(!image) {
            return res.status(400).json({
                status: 'Error',
                message: 'Gambar product wajib diunggah',
            });
        }

        const parseCategoryId = parseInt(category_id as string, 10);
        const parsePrice = parseFloat(price as string);

        if(isNaN(parseCategoryId) || isNaN(parsePrice)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Harga dan Id kategori harus berupa angka yang valid',
            });
        }

        const categoryCek = await prisma.category.findUnique({
            where: { id: parseCategoryId },
        });

        if(!categoryCek) {
            return res.status(404).json({
                status: 'Error',
                message: 'Category tidak ditemukan',
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name.trim(),
                description: description.trim(),
                price: parsePrice,
                image: image,
                badge: badge ? badge.trim() : null,
                weight_info: weight_info ? weight_info.trim() : null,
                category_id: parseCategoryId,
            },
            include: {
                category: true,
            },
        });

        return res.status(201).json({
            status: 'Success',
            message: 'Product berhasil ditambahkan',
            data: newProduct,
        });
    } catch (error) {
        console.error('createProduct error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat menambahkan product',
        });
    }
};

// update product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = parseInt(id as string, 10);

        if(isNaN(productId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'ID product tidak valid',
            });
        }

        const cekProduct = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!cekProduct) {
            return res.status(404).json({
                status: 'Error',
                message: 'Product tidak ditemukan',
            });
        }

        const { name, description, price, badge, weight_info, caetgory_id } = req.body;
        const image = req.file ? req.file.path : cekProduct.image;

        const updateData: any = {
            image,
        };

        if (name) updateData.name = name.trim();
        if (description) updateData.deleteCategories = description.trim();
        if (price) updateData.price = parseFloat(price as string);
        if (badge !==  undefined) updateData.badge = badge ? badge.trim() : null;
        if (weight_info !== undefined) updateData.weight_info = weight_info ? weight_info.trim() : null;
        if (caetgory_id) {
            const parseCategoryId = parseInt(caetgory_id as string, 10);

            const categoryCek = await prisma.category.findUnique({
                where: { id: parseCategoryId },
            });

            if(!categoryCek) {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Category tidak ditemukan',
                });
            }
            updateData.caetgory_id = parseCategoryId

        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
            include: {
                category: true,
            },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Product berhasil diperbarui',
            data: updatedProduct,
        });
    } catch (error) {
        console.error('updateProduct error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat memperbarui product',
        });
    }
};

//delete product
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productId = parseInt(id as string, 10);

        if (isNaN(productId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id product tidak valid',
            });
        }

        const cekProduct = await prisma.product.findUnique({
            where: { id: productId },
    
        });

        if(!cekProduct) {
            return res.status(404).json({
                status: 'Error',
                message: 'Product tidak ditemukan',
            });
        }

        await prisma.product.delete({
            where: {  id: productId },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Product berhsail dihapus',
        });
    } catch (error) {
        console.error('deleteProduct error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahn pada server saat menghapus product',
        });
    }
};