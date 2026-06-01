import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// @route   GET /api/orders
// @desc    Get logged in user orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin Delivery Dashboard)
// @access  Private/Admin
router.get("/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
