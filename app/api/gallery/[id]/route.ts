import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Gallery from "@/utils/models/Gallery";
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
    const deletedGalleryItem = await Gallery.findByIdAndDelete(id);

    if (!deletedGalleryItem) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Gallery image deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Gallery Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete gallery item.", error: error.message },
      { status: 500 }
    );
  }
}

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

    const updatedGalleryItem = await Gallery.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedGalleryItem) {
      return NextResponse.json(
        { success: false, message: "Gallery item not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Gallery image details updated successfully.", gallery: updatedGalleryItem },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Gallery Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update gallery item.", error: error.message },
      { status: 500 }
    );
  }
}
