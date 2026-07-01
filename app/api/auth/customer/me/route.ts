import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Customer from "@/utils/models/Customer";
import { verifyToken } from "@/utils/lib/jwt";

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
        { success: false, message: "No session token found." },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid session credentials." },
        { status: 401 }
      );
    }

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Customer Session Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve session details.", error: error.message },
      { status: 500 }
    );
  }
}
