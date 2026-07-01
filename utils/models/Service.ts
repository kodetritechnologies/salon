import mongoose, { Schema, model, models } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "Grooming",
    },
    features: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Service || model("Service", ServiceSchema);
