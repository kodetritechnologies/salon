import mongoose, { Schema, model, models } from "mongoose";

const StaffSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "On Break", "Leave"],
      default: "Available",
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    experience: {
      type: String,
      default: "5 years",
      trim: true,
    },
    avatarIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default models.Staff || model("Staff", StaffSchema);
