import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategories);
router.put("/:category_id", updateCategory);
router.delete("/:category_id", deleteCategory);

export default router;
