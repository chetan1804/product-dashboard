import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      default: "",
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      type: String,
      default: "",
    },
    mainImage: {
      type: String,
      default: "",
    },
    galleryImages: [
      {
        type: String,
      },
    ],
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    tags: [
      {
        type: String,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1 });

export default mongoose.model("Product", productSchema);
