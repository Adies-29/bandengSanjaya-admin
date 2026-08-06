import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { createContactMessage, deleteContactMessage, getContactMessageById, getContactMessages, markMessageAsRead } from "../controllers/contactMessageController";

const router = Router();

router.get('/', authenticateAdmin, getContactMessages);
router.get('/:id', authenticateAdmin, getContactMessageById);
router.post('/', createContactMessage);
router.patch('/id/read', authenticateAdmin, markMessageAsRead);
router.delete('/:id', authenticateAdmin, deleteContactMessage);

export default router;
