import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Setting from "@/utils/models/Setting";
import { verifyAdmin } from "@/utils/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const settings = await Setting.findOne({});

    return NextResponse.json({ success: true, settings }, { status: 200 });
  } catch (error: any) {
    console.error("GET Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings.", error: error.message },
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

    const body = await req.json();

    const settings = await Setting.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });

    return NextResponse.json(
      { success: true, message: "Settings updated successfully.", settings },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update settings.", error: error.message },
      { status: 500 }
    );
  }
}
