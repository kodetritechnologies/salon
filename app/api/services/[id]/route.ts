import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Service from "@/utils/models/Service";
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

    if (body.price !== undefined) {
      body.price = parseFloat(body.price);
    }

    const updated = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Service updated successfully.", service: updated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Service Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update service.", error: error.message },
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

    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Service deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Service Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete service.", error: error.message },
      { status: 500 }
    );
  }
}
