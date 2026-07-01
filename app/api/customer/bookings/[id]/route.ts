import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Booking from "@/utils/models/Booking";
import { verifyToken } from "@/utils/lib/jwt";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    let token = "";

    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/customerToken=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No session token found." },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id || !decoded.phone) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid session credentials." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    // Verify it belongs to this customer
    if (booking.phone !== decoded.phone) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: You can only cancel your own bookings." },
        { status: 403 }
      );
    }

    // Cancel booking status
    booking.status = "Cancelled";
    await booking.save();

    return NextResponse.json(
      { success: true, message: "Booking cancelled successfully.", booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Customer Cancel Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel booking.", error: error.message },
      { status: 500 }
    );
  }
}
