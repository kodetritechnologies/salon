import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Staff from "@/utils/models/Staff";

export async function GET() {
  try {
    await dbConnect();
    const staff = await Staff.find({});

    return NextResponse.json({ success: true, staff }, { status: 200 });
  } catch (error: any) {
    console.error("GET Staff Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch staff.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, role, status, rating, experience, avatarIndex } = await req.json();

    if (!name || !role) {
      return NextResponse.json(
        { success: false, message: "Please provide staff name and role." },
        { status: 400 }
      );
    }

    const newStaff = await Staff.create({
      name,
      role,
      status: status || "Available",
      rating: rating !== undefined ? Number(rating) : 5.0,
      experience: experience || "5 years",
      avatarIndex: avatarIndex !== undefined ? Number(avatarIndex) : 0,
    });

    return NextResponse.json(
      { success: true, message: "Staff registered successfully.", staff: newStaff },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Staff Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register staff.", error: error.message },
      { status: 500 }
    );
  }
}
