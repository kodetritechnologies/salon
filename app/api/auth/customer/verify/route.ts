import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/utils/lib/dbConnect";
import Customer from "@/utils/models/Customer";
import { generateToken } from "@/utils/lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json(
        { success: false, message: "Please enter phone and verification code." },
        { status: 400 }
      );
    }

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer account not found." },
        { status: 404 }
      );
    }

    // Verify dynamic OTP code from database
    if (!customer.otpCode || customer.otpCode !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code." },
        { status: 401 }
      );
    }

    // Check expiration
    if (customer.otpExpires && new Date() > new Date(customer.otpExpires)) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired." },
        { status: 401 }
      );
    }

    // Clear code on successful verification
    customer.otpCode = "";
    customer.otpExpires = null;
    await customer.save();

    // Generate token
    const token = generateToken({ id: customer._id, phone: customer.phone, role: "customer" });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("customerToken", token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully.",
        token,
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("Customer Verification Error:", err);
    return NextResponse.json(
      { success: false, message: "Verification failed.", error: err.message },
      { status: 500 }
    );
  }
}
