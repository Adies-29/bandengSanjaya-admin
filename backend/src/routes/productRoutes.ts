import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { upload } from "../utils/cloudinary";
import { createProduct, deleteProduct, getProduct, getProductById, updateProduct } from "../controllers/productController";

const router = Router();

router.get('/', getProduct);
router.get('/:id', getProductById);
router.post('/', authenticateAdmin, upload.single("image"), createProduct);
router.put('/:id', authenticateAdmin, upload.single("image"), updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);

export default router;