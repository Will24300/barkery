import express from "express";
import {
  login,
  logout,
  signup,
  verify,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);

export default router;
