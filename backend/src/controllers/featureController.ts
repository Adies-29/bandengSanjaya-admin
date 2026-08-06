import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";

//gat features
export const getFeatures = async (req: Request, res: Response) => {
    try {
        const { active_only } = req.query;
        const whereCondition: any = {};
        if(active_only === 'true') {
            whereCondition.is_active = true;
        }

        const features = await prisma.feature.findMany({
            where: whereCondition,
            orderBy: { created_at: 'desc' },

        });

        return res.status(200).json({
            status: 'Success',
            message: 'Berhasil mengabil daftar keunggulan toko',
            data: features,
        });
    } catch (error) {
        console.error('getFeatures error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengbil data feature',
        });
    }
}

//getById
export const getFeaturesById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const featureId = parseInt(id as string, 10);

        if(isNaN(featureId)){
            return res.status(400).json({
                status: 'Error',
                message: 'Id feature tidak ditemukan',
            });
        }

        const feature = await prisma.feature.findUnique({
            where: { id: featureId },
        });

        if(!feature) {
            return res.status(404).json({
                status: 'Error',
                message: 'Feature tidak ditemukan',
            });
        }

        return res.status(200).json({
            status: "Success",
            message: 'Berhasil mengambil detail feature',
            data: feature,
        });
    } catch (error) {
        console.error('getFeatureById error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengambil detail feature',
        });
    }
};

//create feature
export const createfeature = async (req: Request, res: Response) => {
    try {
        const { title, description, icon, is_active } = req.body;

        if(!title || !description || !icon) { 
            return res.status(400).json({
                status: 'Error',
                message: 'Titile, description, icon wajib diisi',
            });
        }

        const newFeature = await prisma.feature.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                icon: icon.trim(),
                is_active: is_active == undefined ? true : is_active === 'true' || is_active == true,
            },
        });

        return res.status(201).json({
            status:'Success',
            message: 'Feature berhasil ditambahkan',
            data: newFeature,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat menambahkan feature',
        });
    }
};

export const updateFeature = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const featureId = parseInt(id as string, 10);

        if(isNaN(featureId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id feature tidak valid',
            });
        }

        const cekFeature = await prisma.feature.findUnique({
            where: { id: featureId },
        });

        if(!cekFeature) {
            return res.status(404).json({
                status: 'Error',
                message: 'Feature tidak ditemukan',
            });
        }

        const { title, description, icon, is_active } = req.body;

        const updateData: any = {};
        if(title) updateData.title = title.trim();
        if(description) updateData.description = description.trim();
        if(icon) updateData.icon = icon.trim();
        if(is_active !== undefined) {
            updateData.is_active = is_active === 'true' || is_active === true;
        }

        const updatedFeature = await prisma.feature.update({
            where: { id: featureId },
            data: updateData,
        })

        return res.status(200).json({
            status: 'Success',
            message: 'Feature berhasil diperbarui',
            data: updatedFeature,
        });

    } catch (error) {
        console.error('updateFeature error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat memperbarui feature'
        });
    }
};


//Delete feature
export const deleteFeature = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const featureId = parseInt(id as string, 10);

        if(isNaN(featureId)) {
            return res.status(400).json({
                status: 'Error',
                message: 'Id feature tidak ditemukan',
            });
        }

        await prisma.feature.delete({
            where: { id: featureId },
        });

        return res.status(200).json({
            status: 'Success',
            message: 'Feature berhasil ditambahkan',
        });
    } catch (error) {
        console.error('deleteFeature error: ',error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat menghapus feature'
        })
    }
}