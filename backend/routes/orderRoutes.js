import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/all", getAllOrders);
router.put("/:order_id", updateOrder);
router.delete("/:order_id", deleteOrder);

export default router;
