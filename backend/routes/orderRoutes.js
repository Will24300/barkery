import express from "express";
import { createOrder, getOrders } from "../controllers/ordersController.js";
import verifyUser from "../middlewares/verifyUser.js"; // Use your existing middleware
import roles from "../middlewares/roles.js";

const router = express.Router();

// Create a new order (no auth required for guest orders)
router.post("/", createOrder);

// Get user's orders (requires authentication)
router.get("/", verifyUser(roles.USER), getOrders);

export default router;
