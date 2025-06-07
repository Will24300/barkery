import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/ordersController.js";
import verifyUser from "../middlewares/verifyUser.js";
import roles from "../middlewares/roles.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", verifyUser(roles.USER), getOrders);
router.get("/all", verifyUser(roles.ADMIN), getAllOrders);
router.put("/:order_id", verifyUser(roles.ADMIN), updateOrder);
router.delete("/:order_id", verifyUser(roles.ADMIN), deleteOrder);

export default router;
