import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Testimonial from "@/utils/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, testimonials }, { status: 200 });
  } catch (error: any) {
    console.error("GET Testimonials Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch testimonials.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, role, text, rating } = await req.json();

    if (!name || !text) {
      return NextResponse.json(
        { success: false, message: "Please provide a name and review text." },
        { status: 400 }
      );
    }

    const newTestimonial = await Testimonial.create({
      name,
      role: role || "Customer",
      text,
      rating: rating !== undefined ? Number(rating) : 5,
    });

    return NextResponse.json(
      { success: true, message: "Testimonial registered successfully.", testimonial: newTestimonial },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create testimonial.", error: error.message },
      { status: 500 }
    );
  }
}
