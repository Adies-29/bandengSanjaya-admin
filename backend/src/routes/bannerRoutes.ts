import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { upload } from "../utils/cloudinary";
import { createBanner, deleteBanner, getBanners, getBannersById, upadteBanner } from "../controllers/bannerController";
import { deleteCategories } from "../controllers/categoryContorller";

const router = Router();

router.get('/', getBanners);
router.get('/:id', getBannersById);
router.post('/', authenticateAdmin, upload.single('image') ,createBanner);
router.put('/:id', authenticateAdmin, upload.single('image'), upadteBanner);
router.delete('/', authenticateAdmin, deleteBanner);

export default router;
