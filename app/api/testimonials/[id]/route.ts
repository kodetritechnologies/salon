import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Testimonial from "@/utils/models/Testimonial";
import { verifyAdmin } from "@/utils/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized credentials." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Testimonial updated successfully.", testimonial: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update testimonial.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized credentials." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const deleted = await Testimonial.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Testimonial deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete testimonial.", error: error.message },
      { status: 500 }
    );
  }
}
