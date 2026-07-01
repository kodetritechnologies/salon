import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Staff from "@/utils/models/Staff";
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

    const updatedStaff = await Staff.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedStaff) {
      return NextResponse.json(
        { success: false, message: "Staff member not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Staff status updated.", staff: updatedStaff },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Staff Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update staff.", error: error.message },
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

    const deletedStaff = await Staff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return NextResponse.json(
        { success: false, message: "Staff member not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Staff member deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Staff Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete staff.", error: error.message },
      { status: 500 }
    );
  }
}
