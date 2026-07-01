import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Booking from "@/utils/models/Booking";
import Service from "@/utils/models/Service";
import Staff from "@/utils/models/Staff";
import mongoose from "mongoose";
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

    if (body.service) {
      if (mongoose.Types.ObjectId.isValid(body.service)) {
        body.service = new mongoose.Types.ObjectId(body.service);
      } else {
        const foundService = await Service.findOne({ name: body.service });
        if (foundService) {
          body.service = foundService._id;
        }
      }
    }

    if (body.barber) {
      if (mongoose.Types.ObjectId.isValid(body.barber)) {
        body.barber = new mongoose.Types.ObjectId(body.barber);
      } else {
        const foundStaff = await Staff.findOne({ name: body.barber });
        if (foundStaff) {
          body.barber = foundStaff._id;
        }
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("service").populate("barber");

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Booking status updated.", booking: updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update booking.", error: error.message },
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

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return NextResponse.json(
        { success: false, message: "Booking not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Booking deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete booking.", error: error.message },
      { status: 500 }
    );
  }
}
