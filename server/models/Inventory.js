import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    location: {
      type: String,
      default: "",
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock",
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ productId: 1 });
inventorySchema.index({ sku: 1 });

export default mongoose.model("Inventory", inventorySchema);
