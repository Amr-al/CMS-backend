import { Router } from "express";
import {
  addComment,
  createArticle,
  deleteArticle,
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
router.delete("/:id", protect, deleteArticle);
router.post("/comment", protect, addComment);
router.put("/comment", protect, editComment);
export default router;
