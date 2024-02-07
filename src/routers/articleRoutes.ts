import { Router } from "express";
import {
  addComment,
  addReact,
  createArticle,
  deleteArticle,
  deleteReact,
  editArticle,
  editComment,
  getArticleById,
  lastestArticles,
} from "../controllers/articleController";
import { protect } from "../controllers/authController";
import upload from "../utils/multer";
const router = Router();

router.post("/create", protect, upload.single("image"), createArticle);
router.get("/lastest", lastestArticles);
router.get("/:id", getArticleById);
router.patch("/:id", protect, upload.single("image"), editArticle);
router.post("/comment", protect, addComment);
router.put("/comment", protect, editComment);
router.post('/react', protect , addReact);
router.delete('/react', protect, deleteReact)
router.delete("/:id", protect, deleteArticle);
export default router;
