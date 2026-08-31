import mongoose from "mongoose";

  
const optionSchema = new mongoose.Schema(
  { id: String, label: String, priceDelta: { type: Number, default: 0 } },
  { _id: false }
);

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  scientificName: String,
  description: String,
  category: { type: String, enum: ["indoor", "outdoor", "succulents", "flowering", "air-purifying", "herbs", "fruit"], index: true },
  images: [String],
  price: { type: Number, required: true },
  mrp: Number,
  sizes: [optionSchema],
  pots: [optionSchema],
  care: { light: String, water: String, temperature: String, humidity: String, difficulty: String },
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  tags: [String],
}, { timestamps: true });

productSchema.index({ name: "text", scientificName: "text", tags: "text" });

export default mongoose.models.Product ?? mongoose.model("Product", productSchema);