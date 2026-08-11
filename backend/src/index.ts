import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import storeInfoRoutes from "./routes/storeInfoRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import featureRoutes from "./routes/featureRoutes";
import contactMessageRoutes from "./routes/contactMessageRoutes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/product', productRoutes);
app.use('/api/products', productRoutes);
app.use('/api/store-info', storeInfoRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/feature', featureRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/contact', contactMessageRoutes);
app.use('/api/contact-messages', contactMessageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan diPort ${PORT}`)
})

