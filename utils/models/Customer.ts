import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },
    otpCode: {
      type: String,
      default: "",
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

export default mongoose.model("Customer", CustomerSchema);
