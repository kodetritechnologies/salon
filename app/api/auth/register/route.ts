import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/lib/dbConnect";
import Admin from "@/utils/models/Admin";
import { generateToken } from "@/utils/lib/jwt";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and password." },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Email already registered to an admin account." },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken({ id: newAdmin._id, email: newAdmin.email });

    return NextResponse.json(
      {
        success: true,
        message: "Admin registered successfully.",
        token,
        admin: {
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration.", error: error.message },
      { status: 500 }
    );
  }
}
