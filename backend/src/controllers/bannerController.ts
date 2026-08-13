import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";


// get banners
export const getBanners = async (req: Request, res: Response) => {
    try {
        const { active_only } = req.query;

        const whereCondition: any = {};
        if(active_only === 'true') {
            whereCondition.is_active = true;
        } 

        const banners = await prisma.banner.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Berhasil mengambil daftar banner',
            data:banners,
        });
    } catch (error) {
        console.error('getBanners error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalah pada sever saat mengambil data banners'
        });
    }
};

//get banner by id
export const getBannersById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bannerId = parseInt(id as string, 10);

        if(isNaN(bannerId)){
            return res.status(400).json({
                status: 'Error',
                message: 'Id banner tidak valid',
            });
        }

        const banner = await prisma.banner.findUnique({
            where: { id: bannerId },
        });

        if (!banner) {
            return res.status(404).json({
                status: 'Error',
                message: 'Banner tidak ditemukan',
            });
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Berhsail mengambii detail banner',
            data: banner,
        });
    } catch (error) {
        console.error('getBannerById error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengabil detail banner',
        });
    }
};

//Create banners
export const createBanner = async (req: Request, res: Response) => {
    try {
        const { title, description, is_active } = req.body;
        const image = req.file ? req.file.path : req.body.image;

        if(!image) {
            return res.status(400).json({
                status: 'Error',
                message: 'Gambar banner wajib diunggah',
            });
        }

        const newBanner = await prisma.banner.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                image: image,
                is_active: is_active === undefined ? true : is_active === 'true' || is_active === true,
            },
        });

        return res.status(201).json({
            status: 'Success',
            message: 'Banner berhasil ditambahkan',
            data: newBanner,
        });
    } catch (error) {
        console.error('createBanner error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat menambahkan banner',
        });
    }
};

//update banner
export const upadteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bannerId = parseInt(id as string, 10);

        if(isNaN(bannerId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'ID banner tidak valid',
            });
        }

        const cekBanner = await prisma.banner.findUnique({
            where: { id: bannerId },
        });

        if(!cekBanner) {
            return res.status(404).json({
                status: "Error",
                message: 'Banner tidak ditemukan',
            });
        }

        const { title, description, is_active } = req.body;
        const image = req.file ? req.file.path : cekBanner.image;

        const upadateDate: any = {
            image,
        };

        if (title) upadateDate.title = title.trim();
        if (description) upadateDate.description = description.trim();
        if (is_active !== undefined ) {
            upadateDate.is_active = is_active === 'true' || is_active === true
        
        }

        const updatedBanner = await prisma.banner.update({
            where: { id: bannerId },
            data: upadateDate,
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Banner berhasil diperbarui',
            data: updatedBanner,
        });
    } catch (error) {
        console.error('updateBanner error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat memperbarui banner',
        });
    }
};

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const bannerId = parseInt(id as string, 10);

        if (isNaN(bannerId)) {
            return res.status(400).json({
                status: 'Error',
                message: ' ID banner tidak valid',
            });
        }

        const cekBanner = await prisma.banner.findUnique({
            where: { id: bannerId },
        });

        if(!cekBanner) {
            return res.status(404).json({
                status: 'Error',
                message: 'Banner tidak ditemukan',
            });
        }

        await prisma.banner.delete({
            where: { id: bannerId },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Banner berhasil dihapus',
        });

    } catch (error) {
        console.error('deleteBanner error: ', error);
        return res.status(500).json({
            status: "Error",
            message: 'Terjadi kesalahan pada server saat menghapus banner',

        });
    }
};