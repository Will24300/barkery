import express from "express";
import {
  getUserData,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUserData);
router.get("/all", getAllUsers);
router.put("/:user_id", updateUser);
router.delete("/:user_id", deleteUser);

export default router;
