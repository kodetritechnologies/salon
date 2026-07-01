import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Gallery from "@/utils/models/Gallery";
import { verifyAdmin } from "@/utils/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const gallery = await Gallery.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, gallery }, { status: 200 });
  } catch (error: any) {
    console.error("GET Gallery Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch gallery.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized credentials." },
        { status: 401 }
      );
    }

    const { imageUrl, alt, span } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Please provide an imageUrl." },
        { status: 400 }
      );
    }

    const newGalleryItem = await Gallery.create({
      imageUrl,
      alt: alt || "Royal Gents Salon image",
      span: span || "",
    });

    return NextResponse.json(
      { success: true, message: "Gallery image added successfully.", gallery: newGalleryItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Gallery Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add gallery item.", error: error.message },
      { status: 500 }
    );
  }
}
