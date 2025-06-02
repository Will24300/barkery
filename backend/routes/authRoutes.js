import express from "express";
import {
  login,
  logout,
  signup,
  verifyAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/check-admin", verifyAdmin);
router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
