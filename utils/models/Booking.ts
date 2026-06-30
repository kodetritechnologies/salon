import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    barber: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Barber is required"],
    },
    date: {
      type: String,
      required: [true, "Booking date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Time slot is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 500,
    },
  },
  { timestamps: true }
);

export default models.Booking || model("Booking", BookingSchema);
