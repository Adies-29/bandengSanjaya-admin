import { Router } from "express";
import { authenticateAdmin } from "../middlewares/authMiddleware";
import { upload } from "../utils/cloudinary";
import {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController";

const router = Router();

router.get('/', getBlogs);
router.get('/:param', getBlogByIdOrSlug);
router.post('/', authenticateAdmin, upload.single('image'), createBlog);
router.put('/:id', authenticateAdmin, upload.single('image'), updateBlog);
router.delete('/:id', authenticateAdmin, deleteBlog);

export default router;
