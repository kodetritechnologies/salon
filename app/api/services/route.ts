import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Service from "@/utils/models/Service";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({});

    return NextResponse.json({ success: true, services }, { status: 200 });
  } catch (error: any) {
    console.error("GET Services Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch services.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, price, duration, category } = await req.json();

    if (!name || !price || !duration) {
      return NextResponse.json(
        { success: false, message: "Please provide service name, price, and duration." },
        { status: 400 }
      );
    }

    const newService = await Service.create({
      name,
      price: parseFloat(price),
      duration,
      category: category || "Grooming",
    });

    return NextResponse.json(
      { success: true, message: "Service added successfully.", service: newService },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Service Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create service.", error: error.message },
      { status: 500 }
    );
  }
}
