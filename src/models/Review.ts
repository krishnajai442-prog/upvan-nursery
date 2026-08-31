import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, default: "", maxlength: 600 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // one review per plant per person

export default mongoose.models.Review ?? mongoose.model("Review", reviewSchema);