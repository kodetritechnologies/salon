import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Booking from "@/utils/models/Booking";
import { verifyToken } from "@/utils/lib/jwt";
import Service from "@/utils/models/Service";
import Staff from "@/utils/models/Staff";

export async function GET(req: Request) {
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

    // Fetch bookings matching the customer's phone
    const bookings = await Booking.find({ phone: decoded.phone })
      .populate("service")
      .populate("barber")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Customer GET Bookings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings.", error: error.message },
      { status: 500 }
    );
  }
}
