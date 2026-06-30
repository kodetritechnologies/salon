"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  DollarSign,
  Clock,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Check,
  X
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import { showSuccess, showError } from "@/utils/helpers/alertHelper";

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: any;
  barber: any;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  price: number;
}

export default function AdminOverview() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeStylistsCount, setActiveStylistsCount] = useState(0);
  const [servicesList, setServicesList] = useState<{ _id: string; name: string }[]>([]);
  const [barbersList, setBarbersList] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const { getMethod, patchMethod } = BasicProvider();

  const getServiceName = (serviceField: any) => {
    if (!serviceField) return "Unknown Service";
    if (typeof serviceField === "object" && serviceField.name) {
      return serviceField.name;
    }
    const serviceId = typeof serviceField === "object" ? serviceField._id : serviceField;
    const found = servicesList.find((s) => s._id === serviceId);
    return found ? found.name : `Service (${serviceId})`;
  };

  const getBarberName = (barberField: any) => {
    if (!barberField) return "No preference";
    if (barberField === "No preference") return "No preference";
    if (typeof barberField === "object" && barberField.name) {
      return barberField.name;
    }
    const barberId = typeof barberField === "object" ? barberField._id : barberField;
    const found = barbersList.find((b) => b._id === barberId);
    return found ? found.name : `Barber (${barberId})`;
  };

  const fetchOverviewData = async () => {
    try {
      const bookingsResponse = await getMethod("/api/bookings");
      if (bookingsResponse && bookingsResponse.success) {
        setBookings(bookingsResponse.bookings);
      }
      const servicesResponse = await getMethod("/api/services");
      if (servicesResponse && servicesResponse.success) {
        setServicesList(servicesResponse.services.map((s: any) => ({ _id: s._id, name: s.name })));
      }
      const staffResponse = await getMethod("/api/staff");
      if (staffResponse && staffResponse.success) {
        setBarbersList(staffResponse.staff.map((st: any) => ({ _id: st._id, name: st.name })));
        const availableStylists = staffResponse.staff.filter((s: any) => s.status === "Available").length;
        setActiveStylistsCount(availableStylists);
      }
    } catch (error) {
      console.error("Failed to load overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    try {
      const data = await patchMethod(`/api/bookings/${id}`, { status: newStatus });
      if (data && data.success) {
        showSuccess("Updated", `Booking has been marked as ${newStatus}.`);
        fetchOverviewData();
      } else {
        showError("Failed", data.message || "Failed to update status.");
      }
    } catch (error: any) {
      showError("Error", error.message || "Failed to update status.");
    }
  };

  // Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === "Completed" || b.status === "Confirmed")
    .reduce((sum, b) => sum + b.price, 0);

  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;

  // Compute Weekly Chart Data
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
        // Ignore invalid dates
      }
    }
  });

  const maxCount = Math.max(...dayCounts, 1);
  const chartItems = [
    { day: "Mon", count: dayCounts[1] },
    { day: "Tue", count: dayCounts[2] },
    { day: "Wed", count: dayCounts[3] },
    { day: "Thu", count: dayCounts[4] },
    { day: "Fri", count: dayCounts[5] },
    { day: "Sat", count: dayCounts[6] },
    { day: "Sun", count: dayCounts[0] }
  ].map((item) => ({
    ...item,
    height: `${Math.round((item.count / maxCount) * 100)}%`
  }));

  // Compute Popular Services
  const serviceCounts: Record<string, number> = {};
  bookings.forEach((b) => {
    const serviceName = getServiceName(b.service);
    if (serviceName) {
      serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
    }
  });

  const sortedServices = Object.entries(serviceCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const popularServicesFallback = [
    { name: "Classic Haircut", percentage: 78, count: 42 },
    { name: "Luxury Beard Styling", percentage: 56, count: 30 },
    { name: "Gold Facial Treatment", percentage: 38, count: 21 },
    { name: "Herbal Head Spa", percentage: 22, count: 12 }
  ];

  const maxServiceCount = sortedServices[0]?.count || 1;
  const finalPopularServices = sortedServices.length > 0
    ? sortedServices.map((s) => ({
        name: s.name,
        count: s.count,
        percentage: Math.round((s.count / maxServiceCount) * 100)
      }))
    : popularServicesFallback;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading dashboard overview...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Title */}
      <div>
        <h2 className="font-display text-3xl font-extrabold text-gradient-gold leading-none">
          Salon Overview
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
          Key performance metrics and live updates
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Bookings", value: bookings.length, icon: CalendarDays, change: "All bookings logged", path: "/admin/bookings" },
          { label: "Estimated Revenue", value: `₹${totalRevenue}`, icon: DollarSign, change: "Gross earnings", path: "/admin/bookings" },
          { label: "Pending Approvals", value: pendingBookings, icon: Clock, change: "Requires action", path: "/admin/bookings?status=Pending" },
          { label: "Active Stylists", value: activeStylistsCount, icon: UserCheck, change: "On salon floor", path: "/admin/staff" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => router.push(stat.path)}
              className="glass p-5 rounded-2xl shadow-soft hover:border-gold/45 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="p-2 bg-gold/10 border border-gold/20 text-gold rounded-xl">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] font-medium text-gold/80 tracking-wide uppercase">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Analytical Charts & Service Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytic Graph */}
        <div className="glass p-6 rounded-3xl shadow-elegant lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Appointments Frequency</h3>
              <p className="text-xs text-muted-foreground">Showing reservation days distributions</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-gold bg-gold/10 px-3 py-1.5 rounded-full font-semibold border border-gold/25">
              <TrendingUp className="h-3.5 w-3.5" />
              Real-time
            </span>
          </div>

          {/* SVG Chart */}
          <div className="h-56 w-full flex items-end justify-between pt-6 border-b border-gold/15 px-2">
            {chartItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group w-10 relative">
                {/* Tooltip */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-30px] bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded shadow-elegant whitespace-nowrap z-10">
                  {item.count} bks
                </span>
                {/* Bar */}
                <div
                  style={{ height: item.height }}
                  className="w-4 sm:w-6 bg-gradient-gold rounded-t-lg transition-all duration-500 hover:brightness-110 shadow-gold group-hover:scale-y-[1.03] origin-bottom"
                />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-1">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services Progress list */}
        <div className="glass p-6 rounded-3xl shadow-elegant space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Popular Services</h3>
            <p className="text-xs text-muted-foreground">Treatment metrics breakdown</p>
          </div>

          <div className="space-y-4.5 pt-2">
            {finalPopularServices.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-gold">{item.count} bookings</span>
                </div>
                <div className="h-2 w-full bg-foreground/5 border border-gold/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: idx * 0.15 }}
                    className="h-full bg-gradient-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions & Recent bookings summary */}
      <div className="glass p-6 rounded-3xl shadow-elegant space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Pending Action Items</h3>
            <p className="text-xs text-muted-foreground">Bookings currently awaiting confirmations</p>
          </div>
          <button
            onClick={() => router.push("/admin/bookings")}
            className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-gold border border-gold/25 rounded-full px-4 py-2 hover:bg-gold/10 transition-colors"
          >
            <span>Process Bookings</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* List of pending bookings */}
        <div className="divide-y divide-gold/10">
          {bookings.filter((b) => b.status === "Pending").length === 0 ? (
            <p className="text-center py-6 text-sm text-muted-foreground">No pending confirmations!</p>
          ) : (
            bookings
              .filter((b) => b.status === "Pending")
              .map((b) => {
                const serviceName = getServiceName(b.service);
                const barberName = getBarberName(b.barber);

                return (
                  <div key={b._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4.5 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-gold">
                        {b.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {serviceName} with {barberName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-semibold text-foreground">
                          {b.date} @ {b.time}
                        </p>
                        <p className="text-[10px] text-gold font-bold">₹{b.price}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                          className="p-1.5 bg-gold/10 border border-gold/30 rounded-lg text-gold hover:bg-gold hover:text-ink transition-colors cursor-pointer"
                          title="Approve Booking"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                          className="p-1.5 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive-foreground hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                          title="Reject Booking"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}
