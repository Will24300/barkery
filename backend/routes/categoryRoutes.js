import express from "express";
import {
  addCategory,
  getCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", addCategory);
router.get("/", getCategories);

export default router;
