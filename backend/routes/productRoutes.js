import express from "express";
import multer from "multer";
import path from "path";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import verifyUser from "../middlewares/verifyUser.js";
import roles from "../middlewares/roles.js";


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
  verifyUser(roles.ADMIN),
  upload.single("image"),
  addProduct
);
router.put(
  "/:product_id",
  verifyUser(roles.ADMIN),
  upload.single("image"),
  updateProduct
);
router.delete("/:product_id", verifyUser(roles.ADMIN), deleteProduct);

export default router;
