import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Admin from "@/utils/models/Admin";
import { verifyToken } from "@/utils/lib/jwt";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "No token provided." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token) as any;
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, admin },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { success: false, message: "Unauthorized credentials." },
      { status: 401 }
    );
  }
}
