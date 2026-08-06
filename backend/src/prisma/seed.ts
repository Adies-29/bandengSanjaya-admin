import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {

    console.log('seeding database');

    // akun admin
    const hashedPassword = await bcrypt.hash('12345678',10);
    const admin = await prisma.admin.upsert({
        where : { username: 'admin'},
        update: {},
        create : {
            username: 'admin',
            password: hashedPassword,
        },

    });
    console.log('Admin created:', admin.username);
    

    const storeInfo = await prisma.storeInfo.upsert({

        where: { id: 1},
        update: {},
        create: {
            id: 1,
            name: 'Bandeng Sanjaya',
            whatsapp_number: '62816355890',
            wa_template_text: 'Halo Bandeng Sanjaya, saya tertarik memesan produk olahan bandeng presto.',
            address: 'Jl. Pucang Sari III No.30, Pucanggading, Batursari, Kec. Mranggen, Kabupaten Demak, Jawa Tengah 59567',
            google_maps_url: 'https://www.google.com/maps/place/Bandeng+Presto+Sanjaya/@-7.0404237,110.4934005,17z/data=!3m1!4b1!4m6!3m5!1s0x2e708de72ef95e6d:0x8a50a09570a4fbcc!8m2!3d-7.0404237!4d110.4934005!16s%2Fg%2F11hg4tzzcg?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D',
            operational_hours: 'Senin - Minggu: 08.00 - 20.00 WIB',
            description: 'Bandeng Duri Lunak Oleh-oleh Khas Semarang & Demak. Menyajikan aneka olahan bandeng presto duri lunak & ayam ungkep bumbu rempah alami tanpa pengawet.',
            instagram_url: 'https://www.instagram.com/bandeng_sanjaya',
            facebook_url: 'https://www.facebook.com/profile.php?id=100054338598086'

        },
    });
    console.log('Store info created');

    //Katergori

    const category1 = await prisma.category.create({
        data: {name: 'Bandeng Presto'}
    });
    const category2 = await prisma.category.create({
        data: {name: 'Pepes Bandeng'}
    });
    
    console.log('Categories Created');

    //produk
    await prisma.product.createMany({
        data: [
            {
                name: 'Bandeng Presto (kemasan 1Kg)',
                description: 'Bandeng duri lunak dengan bumbu rempah meresap. Kemasan vacuum higienis isi 5-6 ekor, komplit dengan sambal khas.',
                price: 133000,
                image: 'https://placehold.co/600x400?text=Bandeng+1kg',
                badge: 'BEST SELLER',
                weight_info: '1 kg (isi 5-6 ekor)',
                category_id: category1.id
            },
             {
                name: 'Bandeng Presto (isi 2)',
                description: 'Bandeng duri lunak dengan bumbu rempah meresap. Kemasan vacuum higienis isi 5-6 ekor, komplit dengan sambal khas.',
                price: 58000,
                image: 'https://placehold.co/600x400?text=Bandeng+isi2',
                badge: 'BEST SELLER',
                weight_info: 'kemasan isi 2',
                category_id: category1.id
            },
             {
                name: 'Pepes Bandeng Presto',
                description: 'Bandeng duri lunak dengan bumbu rempah meresap. Kemasan vacuum higienis isi 5-6 ekor, komplit dengan sambal khas.',
                price: 38000,
                image: 'https://placehold.co/600x400?text=Bandeng+1kg',
                badge: 'BEST SELLER',
                weight_info: 'kemasan isi 1',
                category_id: category2.id
            },
        ]

    });
    console.log('Produk created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();

    });
