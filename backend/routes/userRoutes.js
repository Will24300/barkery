import express from "express";
import {
  getUserData,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import verifyUser from "../middlewares/verifyUser.js";
import roles from "../middlewares/roles.js";

const router = express.Router();

router.get("/", verifyUser(roles.USER), getUserData);
router.get("/all", verifyUser(roles.ADMIN), getAllUsers);
router.put("/:user_id", verifyUser(roles.ADMIN), updateUser);
router.delete("/:user_id", verifyUser(roles.ADMIN), deleteUser);

export default router;
