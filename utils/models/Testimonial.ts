import mongoose, { Schema, model, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      default: "Customer",
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      default: 5,
    },
  },
  { timestamps: true }
);

export default models.Testimonial || model("Testimonial", TestimonialSchema);
