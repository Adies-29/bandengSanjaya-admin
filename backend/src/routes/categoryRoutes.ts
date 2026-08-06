import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { createCategories, deleteCategories, getCategories, getCategoriesById, updateCategories } from "../controllers/categoryContorller";

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoriesById);
router.post('/', authenticateAdmin, createCategories);
router.put('/:id', authenticateAdmin, updateCategories);
router.delete('/:id', authenticateAdmin, deleteCategories);

export default router;