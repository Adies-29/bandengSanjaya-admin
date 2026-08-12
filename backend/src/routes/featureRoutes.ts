import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { upload } from "../utils/cloudinary";
import { createfeature, deleteFeature, getFeatures, getFeaturesById, updateFeature } from "../controllers/featureController";

const router = Router();

router.get('/', getFeatures);
router.get('/:id', getFeaturesById);
router.post('/', authenticateAdmin, upload.single('image'), createfeature);
router.put('/:id', authenticateAdmin, upload.single('image'), updateFeature);
router.delete('/:id', authenticateAdmin, deleteFeature);

export default router;