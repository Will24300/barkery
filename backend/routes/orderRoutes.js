import express from "express";
import { createOrder, getOrders } from "../controllers/ordersController.js";

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get user's orders
router.get("/", getOrders);

export default router;
