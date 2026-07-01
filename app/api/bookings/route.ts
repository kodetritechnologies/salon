import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Booking from "@/utils/models/Booking";
import Service from "@/utils/models/Service";
import Staff from "@/utils/models/Staff";
import Customer from "@/utils/models/Customer";
import mongoose from "mongoose";
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

    const bookings = await Booking.find({}).populate("service").populate("barber").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings }, { status: 200 });
  } catch (error: any) {
    console.error("GET Bookings Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, phone, email, service, barber, date, time, price, status } = await req.json();

    if (!name || !phone || !service || !barber || !date || !time) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields." },
        { status: 400 }
      );
    }
    let serviceId = null;
    if (mongoose.Types.ObjectId.isValid(service)) {
      serviceId = new mongoose.Types.ObjectId(service);
    } else {
      const foundService = await Service.findOne({ name: service });
      if (foundService) {
        serviceId = foundService._id;
      } else {
        return NextResponse.json(
          { success: false, message: `Service '${service}' not found.` },
          { status: 404 }
        );
      }
    }
    let barberId = null;
    if (mongoose.Types.ObjectId.isValid(barber)) {
      barberId = new mongoose.Types.ObjectId(barber);
    } else {
      const foundStaff = await Staff.findOne({ name: barber });
      if (foundStaff) {
        barberId = foundStaff._id;
      } else {
        const availableStaff = await Staff.findOne({ status: "Available" });
        if (availableStaff) {
          barberId = availableStaff._id;
        } else {
          const anyStaff = await Staff.findOne({});
          if (anyStaff) {
            barberId = anyStaff._id;
          } else {
            return NextResponse.json(
              { success: false, message: "No barbers/staff available for booking." },
              { status: 404 }
            );
          }
        }
      }
    }

    const newBooking = await Booking.create({
      name,
      phone,
      email: email || "",
      service: serviceId,
      barber: barberId,
      date,
      time,
      price: price !== undefined ? Number(price) : 500,
      status: status || "Pending",
    });

    const populated = await Booking.findById(newBooking._id).populate("service").populate("barber");

    // Auto-create or update Customer based on phone number
    try {
      await Customer.findOneAndUpdate(
        { phone },
        { name, email: email || "" },
        { upsert: true, new: true }
      );
    } catch (custError) {
      console.error("Failed to auto-create/update customer on booking:", custError);
    }

    return NextResponse.json(
      { success: true, message: "Booking registered successfully.", booking: populated },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking.", error: error.message },
      { status: 500 }
    );
  }
}
