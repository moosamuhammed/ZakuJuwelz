// controllers/orderController.js (corrected)

const OrderModel = require("../models/ordermodel");

/**
 * POST /orders
 */
const createOrder = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { items, totalAmount, paymentMethod, shippingAddress, meta } =
      req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain items." });
    }

    const order = await OrderModel.create({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      meta, // if your schema supports it
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * GET /orders/getallorder
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    res.json(orders);
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * GET /orders/orderbyid/:id
 */
const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("getOrderById error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * PATCH /orders/updateorderstatus/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.orderStatus = status;
    }

    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * DELETE /orders/deleteorder/:id
 */
const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();

    res.json({ message: "Order removed" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * GET /orders/myorders
 */
const getMyOrders = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const orders = await OrderModel.find({ userId })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
};
