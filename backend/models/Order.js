import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    items: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending", // Pending, Processing, Shipped, Delivered
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
