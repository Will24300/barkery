import express from "express";
import multer from "multer";
import path from "path";
import { addProducts, getProducts } from "../controllers/productsController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Store images in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // Unique filename
  },
});

const upload = multer({
  storage: storage,
}); // Create Multer instance
const router = express.Router();

router.get("/", getProducts);
router.post("/add", upload.single("image"), addProducts);

export default router;
