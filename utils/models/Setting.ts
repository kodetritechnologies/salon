import mongoose, { Schema, model, models } from "mongoose";

const SettingSchema = new Schema(
  {
    shopPhone: {
      type: String,
      default: "+91 88888 88888",
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: "+91 99999 99999",
      trim: true,
    },
    shopEmail: {
      type: String,
      default: "hello@royalgents.in",
      trim: true,
    },
    shopAddress: {
      type: String,
      default: "MG Road, Indore, Madhya Pradesh, India",
      trim: true,
    },
    openTime: {
      type: String,
      default: "09:00 AM",
      trim: true,
    },
    closeTime: {
      type: String,
      default: "10:00 PM",
      trim: true,
    },
    instagramUsername: {
      type: String,
      default: "@royalgentssalon",
      trim: true,
    },
    facebookUsername: {
      type: String,
      default: "Royal Gents Salon",
      trim: true,
    },
    bannerText: {
      type: String,
      default: "Royal Festival Offer: Flat 20% off on all Premium Facials!",
      trim: true,
    },
    showBanner: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ["dark", "light", "theme-blue", "theme-green"],
      default: "dark",
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Setting) {
  delete mongoose.models.Setting;
}

export default mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
