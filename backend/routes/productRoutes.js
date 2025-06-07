import express from "express";
import multer from "multer";
import path from "path";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", getProducts);
router.post(
  "/add",
 
  upload.single("image"),
  addProduct
);
router.put(
  "/:product_id",
 
  upload.single("image"),
  updateProduct
);
router.delete("/:product_id", deleteProduct);

export default router;
