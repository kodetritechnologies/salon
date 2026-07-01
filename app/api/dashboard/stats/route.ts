import { NextResponse } from "next/server";
import dbConnect from "@/utils/lib/dbConnect";
import Booking from "@/utils/models/Booking";
import Staff from "@/utils/models/Staff";
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

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "all";

    let dateFilter: any = {};
    if (range !== "all") {
      const now = new Date();
      let days = 7;
      if (range === "month") days = 30;
      if (range === "year") days = 365;

      const pastDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const pastDateStr = pastDate.toISOString().split("T")[0];
      dateFilter = { date: { $gte: pastDateStr } };
    }

    const bookings = await Booking.find(dateFilter)
      .populate("service")
      .populate("barber")
      .sort({ date: -1, time: -1 });

    const totalRevenue = bookings
      .filter((b) => b.status === "Completed" || b.status === "Confirmed")
      .reduce((sum, b) => sum + (b.price || 0), 0);
    const pendingBookingsCount = bookings.filter((b) => b.status === "Pending").length;
    const confirmedBookingsCount = bookings.filter((b) => b.status === "Confirmed").length;
    const activeStylistsCount = await Staff.countDocuments({ status: "Available" });

    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    bookings.forEach((b) => {
      if (b.date) {
        try {
          const d = new Date(b.date);
          const dayIdx = d.getDay();
          if (!isNaN(dayIdx)) {
            dayCounts[dayIdx]++;
          }
        } catch (e) {
        }
      }
    });

    const maxCount = Math.max(...dayCounts, 1);
    const chartItems = [
      { day: "Mon", count: dayCounts[1], height: `${Math.round((dayCounts[1] / maxCount) * 100)}%` },
      { day: "Tue", count: dayCounts[2], height: `${Math.round((dayCounts[2] / maxCount) * 100)}%` },
      { day: "Wed", count: dayCounts[3], height: `${Math.round((dayCounts[3] / maxCount) * 100)}%` },
      { day: "Thu", count: dayCounts[4], height: `${Math.round((dayCounts[4] / maxCount) * 100)}%` },
      { day: "Fri", count: dayCounts[5], height: `${Math.round((dayCounts[5] / maxCount) * 100)}%` },
      { day: "Sat", count: dayCounts[6], height: `${Math.round((dayCounts[6] / maxCount) * 100)}%` },
      { day: "Sun", count: dayCounts[0], height: `${Math.round((dayCounts[0] / maxCount) * 100)}%` }
    ];

    const serviceCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      let serviceName = "Unknown Service";
      if (b.service && typeof b.service === "object") {
        serviceName = b.service.name || "Unknown Service";
      }
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
    });

    const sortedServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const maxServiceCount = sortedServices[0]?.count || 1;
    const popularServices = sortedServices.map((s) => ({
      name: s.name,
      count: s.count,
      percentage: Math.round((s.count / maxServiceCount) * 100),
    }));
    const pendingBookings = bookings.filter((b) => b.status === "Pending");

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalBookingsCount: bookings.length,
          totalRevenue,
          pendingBookingsCount,
          confirmedBookingsCount,
          activeStylistsCount,
          chartItems,
          popularServices,
          pendingBookings
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard stats.", error: error.message },
      { status: 500 }
    );
  }
}
