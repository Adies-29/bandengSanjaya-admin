import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { createfeature, deleteFeature, getFeatures, getFeaturesById, updateFeature } from "../controllers/featureController";

const router = Router();

router.get('/', getFeatures);
router.get('/:id', getFeaturesById);
router.post('/', authenticateAdmin, createfeature);
router.put('/:id', authenticateAdmin, updateFeature);
router.delete('/:id', authenticateAdmin, deleteFeature);

export default router;