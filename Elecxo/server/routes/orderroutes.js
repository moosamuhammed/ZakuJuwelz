
const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authmiddleware");

const router = express.Router();

// User
router.post("/userorder", authMiddleware, createOrder);
router.get("/myorders", authMiddleware, getMyOrders);

// Admin / general
router.get("/getallorder", getAllOrders);
router.get("/orderbyid/:id", getOrderById);
router.patch("/updateorderstatus/:id/status", updateOrderStatus);
router.delete("/deleteorder/:id", deleteOrder);

module.exports = router;
