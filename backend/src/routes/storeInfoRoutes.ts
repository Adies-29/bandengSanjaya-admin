import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { getStoreInfo, updateStoreInfo } from "../controllers/storeInfoController";
import { upload } from "../utils/cloudinary";


const router = Router();

router.get('/', getStoreInfo);
router.put('/', authenticateAdmin, upload.single('logo'), updateStoreInfo);

export default router;