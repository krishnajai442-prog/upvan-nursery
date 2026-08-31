import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String, image: String, sizeLabel: String, potLabel: String,
  unitPrice: Number, qty: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  email: String,
  items: [orderItemSchema],
  subtotal: Number, shipping: Number, total: Number,
  shippingAddress: { fullName: String, phone: String, line1: String, line2: String, city: String, state: String, pincode: String },
  payment: { razorpayOrderId: String, razorpayPaymentId: String, status: { type: String, default: "captured" } },
  status: { type: String, enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"], default: "PLACED" },
  confirmation: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
  confirmToken: { type: String, select: false },
  confirmedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Order ?? mongoose.model("Order", orderSchema);


