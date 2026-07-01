import mongoose, { Schema, model, models } from "mongoose";

const GallerySchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    alt: {
      type: String,
      default: "Royal Gents Salon image",
      trim: true,
    },
    span: {
      type: String,
      default: "", // Empty or 'row-span-2' for grid customization
      trim: true,
    },
  },
  { timestamps: true }
);

export default models.Gallery || model("Gallery", GallerySchema);
