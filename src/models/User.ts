import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  label: { type: String, default: "Home" },
  fullName: String, phone: String, line1: String, line2: String,
  city: String, state: String, pincode: String,
  isDefault: { type: Boolean, default: false },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });

export default mongoose.models.User ?? mongoose.model("User", userSchema);