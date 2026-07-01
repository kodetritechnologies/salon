import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Customer from "@/utils/models/Customer";
import { verifyAdmin } from "@/utils/lib/auth";

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
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Customer deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    const err = error as Error;
    console.error("DELETE Customer Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete customer.", error: err.message },
      { status: 500 }
    );
  }
}
