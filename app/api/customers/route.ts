import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Customer from "@/utils/models/Customer";
import Booking from "@/utils/models/Booking";
import { verifyAdmin } from "@/utils/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized credentials." },
        { status: 401 }
      );
    }

    // Fetch customers
    const customers = await Customer.find({}).sort({ createdAt: -1 });

    // Fetch booking count for each customer
    const customersWithStats = await Promise.all(
      customers.map(async (c) => {
        const bookingsCount = await Booking.countDocuments({ phone: c.phone });
        return {
          ...c.toObject(),
          bookingsCount,
        };
      })
    );

    return NextResponse.json(
      { success: true, customers: customersWithStats },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Customers Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch customers list.", error: error.message },
      { status: 500 }
    );
  }
}
