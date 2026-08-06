import { Router } from "express";
import { login, getProfile } from "../controllers/authController";
import { authenticateAdmin } from "../middlewares/authMiddleware";


const router = Router();

router.post('/login', login);

router.get('/profile', authenticateAdmin, getProfile);

export default router;