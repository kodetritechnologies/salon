import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Customer from "@/utils/models/Customer";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Please provide a phone number." },
        { status: 400 }
      );
    }

    let isDev = process.env.NODE_ENV === "development";
    try {
      const envPath = path.join(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        const lines = envContent.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("NODE_ENV=")) {
            const val = trimmed.split("=")[1].trim();
            if (val === "production") {
              isDev = false;
            } else if (val === "development") {
              isDev = true;
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to parse .env file:", e);
    }

    let otp = "123456";
    if (!isDev) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }
    console.log(`[OTP Generate] Phone: ${phone} | Code: ${otp} | Resolved Env (isDev): ${isDev}`);
    
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Find existing customer by phone number
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "No registered customer found with this phone number. Please book an appointment first." },
        { status: 404 }
      );
    }

    customer.otpCode = otp;
    customer.otpExpires = otpExpires;
    await customer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent successfully.",
        otp,
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Customer Login Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to initiate login.", error: err.message },
      { status: 500 }
    );
  }
}
