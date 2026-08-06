import { Request, Response } from "express";
import { prisma } from "../prisma/prisma";

// get storeInfo
export const getStoreInfo = async (req: Request, res: Response) => {
    try {
        const storeInfo = await prisma.storeInfo.findFirst();

        if(!storeInfo){
            return res.status(404).json({
                status: 'Error',
                message: 'Informasi toko belun diatur',
            });
        }

        return res.status(200).json({
            status: 'Success',
            message: 'Berhasil mengambil informasi toko',
            data: storeInfo,
        });
    } catch (error) {
        console.error('getInfoStore error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat mengambil informasi toko',

        });
    }
};

export const updateStoreInfo = async (req: Request, res: Response) => {
    try {
        const { name, whatsapp_number, wa_template_text, address, google_maps_url, operational_hours, instagram_url, facebook_url, description,  } = req.body;

        const cekStoreInfo = await prisma.storeInfo.findFirst();
        const logo = req.file ? req.file.path : cekStoreInfo?.logo;

        const payload = {
            name: name ? name.trim() : "Bandeng Sanjaya",
            whatsapp_number: whatsapp_number ? whatsapp_number.trim() : '',
            wa_template_text: wa_template_text ? wa_template_text.trim() : '',
            address: address ? address.trim() : '',
            google_maps_url: google_maps_url ? google_maps_url.trim() : null,
            operational_hours: operational_hours ? operational_hours.trim() : '',
            instagram_url : instagram_url ? instagram_url.trim() : null,
            facebook_url : facebook_url ? facebook_url.trim() : null,
            description  : description ? description.trim() : "",
            logo: logo || null,
        };

        let updatedStoreInfo;

        if(cekStoreInfo){
            updatedStoreInfo = await prisma.storeInfo.update({
                where: { id: cekStoreInfo.id },
                data: payload,
            });
        } else{
            updatedStoreInfo = await prisma.storeInfo.create({
                data:payload,
            });
        }

        return res.status(200).json({
            status: "Succescc",
            message: 'Informasi toko berhasil diperbarui',
            data: updatedStoreInfo,
        });
    } catch (error) {
        console.error('updateStoreInfo error: ', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Terjadi kesalahan pada server saat memperbarui infomasi toko'
        });
    }
};