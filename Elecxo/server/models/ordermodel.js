// server/models/ordermodel.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",          // 👈 must match User model name
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",   // 👈 must match Product model name
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["Razorpay", "Stripe", "UPI", "COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    paymentId: String,
    orderId: String,
    signature: String,

    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"],
      default: "Pending",
    },

    trackingInfo: {
      courier: String,
      trackingNumber: String,
      trackingUrl: String,
      expectedDelivery: Date,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate unique orderCode
orderSchema.pre("save", function (next) {
  if (!this.orderCode) {
    this.orderCode = "ZK" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = OrderModel;
