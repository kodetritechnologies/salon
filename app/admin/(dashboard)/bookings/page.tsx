"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Clock,
  X,
  XCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";

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

export default function BookingsManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Add Booking form states
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [newBookingName, setNewBookingName] = useState("");
  const [newBookingPhone, setNewBookingPhone] = useState("");
  const [newBookingService, setNewBookingService] = useState("");
  const [newBookingBarber, setNewBookingBarber] = useState("");
  const [newBookingDate, setNewBookingDate] = useState("");
  const [newBookingTime, setNewBookingTime] = useState("09:30");

  const [servicesList, setServicesList] = useState<{ _id: string; name: string; price: number }[]>([]);
  const [barbersList, setBarbersList] = useState<{ _id: string; name: string }[]>([]);

  const { getMethod, postMethod, patchMethod, deleteMethod } = BasicProvider();

  const getServiceName = (serviceField: any) => {
    if (!serviceField) return "Unknown Service";
    if (typeof serviceField === "object" && serviceField.name) {
      return serviceField.name;
    }
    const serviceId = typeof serviceField === "object" ? serviceField._id : serviceField;
    const found = servicesList.find((s) => s._id === serviceId);
    return found ? found.name : `Service (${serviceId})`;
  };

  const getServiceDuration = (serviceField: any) => {
    if (typeof serviceField === "object" && serviceField && serviceField.duration) {
      return ` (${serviceField.duration})`;
    }
    return "";
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

  const getBarberRole = (barberField: any) => {
    if (typeof barberField === "object" && barberField && barberField.role) {
      return barberField.role;
    }
    return "";
  };

  const fetchBookingsData = async () => {
    try {
      const bookingsResponse = await getMethod("/api/bookings");
      if (bookingsResponse && bookingsResponse.success) {
        setBookings(bookingsResponse.bookings);
      }
      
      const servicesResponse = await getMethod("/api/services");
      if (servicesResponse && servicesResponse.success) {
        const list = servicesResponse.services.map((s: any) => ({ _id: s._id, name: s.name, price: s.price }));
        setServicesList(list);
        if (list.length > 0) setNewBookingService(list[0]._id);
      }

      const staffResponse = await getMethod("/api/staff");
      if (staffResponse && staffResponse.success) {
        const list = staffResponse.staff.map((st: any) => ({ _id: st._id, name: st.name }));
        setBarbersList(list);
        if (list.length > 0) setNewBookingBarber(list[0]._id);
      }
    } catch (error) {
      console.error("Failed to load bookings configs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Booking["status"]) => {
    try {
      const data = await patchMethod(`/api/bookings/${id}`, { status: newStatus });
      if (data && data.success) {
        fetchBookingsData();
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error: any) {
      console.error("Update status error:", error);
    }
  };

  const addBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingName || !newBookingPhone || !newBookingDate) return;
    const selectedS = servicesList.find((s) => s._id === newBookingService);
    
    try {
      const payload = {
        name: newBookingName,
        phone: newBookingPhone,
        service: newBookingService, // This will be the service ObjectId
        barber: newBookingBarber, // This will be the staff ObjectId
        date: newBookingDate,
        time: newBookingTime,
        price: selectedS ? selectedS.price : 500,
        status: "Confirmed",
      };

      const data = await postMethod("/api/bookings", payload);
      if (data && data.success) {
        fetchBookingsData();
        setNewBookingName("");
        setNewBookingPhone("");
        setNewBookingDate("");
        setShowAddBookingModal(false);
      } else {
        alert(data.message || "Failed to create booking.");
      }
    } catch (error: any) {
      console.error("Add booking error:", error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking record?")) return;
    try {
      const data = await deleteMethod(`/api/bookings/${id}`);
      if (data && data.success) {
        fetchBookingsData();
      } else {
        alert(data.message || "Failed to delete booking.");
      }
    } catch (error: any) {
      console.error("Delete booking error:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading bookings manager...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-gradient-gold leading-none">
            Manage Bookings
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
            Review, filter, and schedule reservations
          </p>
        </div>

        <button
          onClick={() => setShowAddBookingModal(true)}
          className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Direct Booking</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 bg-card/40 border border-gold/15 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search by client, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-gold/15 pl-10 pr-4 py-2.5 rounded-full text-xs outline-none focus:border-gold/50 text-foreground"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-background border border-gold/15 px-3 py-2 rounded-full text-xs outline-none text-foreground focus:border-gold/50 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass rounded-3xl overflow-hidden shadow-elegant">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/15 text-[10px] font-bold text-gold uppercase tracking-widest bg-foreground/5">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">Client Info</th>
                <th className="p-4">Service Details</th>
                <th className="p-4">Staff Barber</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-xs">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-sm text-muted-foreground">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const serviceName = getServiceName(b.service);
                  const serviceDuration = getServiceDuration(b.service);
                  const barberName = getBarberName(b.barber);
                  const barberRole = getBarberRole(b.barber);

                  return (
                    <tr key={b._id} className="hover:bg-foreground/5 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gold tracking-wide">
                        {b._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{b.name}</p>
                        <p className="text-[10px] text-muted-foreground">{b.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{serviceName}{serviceDuration}</p>
                        <p className="text-[10px] text-gold">₹{b.price}</p>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">
                        <p className="font-semibold text-foreground">{barberName}</p>
                        {barberRole && <p className="text-[10px] text-muted-foreground">{barberRole}</p>}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-foreground">{b.date}</p>
                        <p className="text-[10px] text-muted-foreground">{b.time}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === "Confirmed"
                              ? "bg-gold/10 text-gold border border-gold/20"
                              : b.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : b.status === "Cancelled"
                              ? "bg-destructive/10 text-destructive-foreground border border-destructive/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${
                              b.status === "Confirmed"
                                ? "bg-gold"
                                : b.status === "Completed"
                                ? "bg-emerald-400"
                                : b.status === "Cancelled"
                                ? "bg-destructive-foreground"
                                : "bg-amber-400"
                            }`}
                          />
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex gap-1 justify-end items-center">
                          {b.status === "Pending" && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, "Confirmed")}
                              className="px-2 py-1 bg-gold/10 border border-gold/25 text-[10px] font-bold text-gold rounded hover:bg-gold hover:text-ink transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === "Confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, "Completed")}
                              className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400 rounded hover:bg-emerald-400 hover:text-white transition-colors cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {b.status !== "Completed" && b.status !== "Cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(b._id, "Cancelled")}
                              className="px-2 py-1 bg-destructive/10 border border-destructive/25 text-[10px] font-bold text-destructive-foreground rounded hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                          {(b.status === "Completed" || b.status === "Cancelled") && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground italic">Archived</span>
                              <button
                                onClick={() => handleDeleteBooking(b._id)}
                                className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Booking Modal */}
      <AnimatePresence>
        {showAddBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBookingModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">Direct/Walk-in Booking</h3>
                <button
                  onClick={() => setShowAddBookingModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={addBooking} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jayesh Rawat"
                    value={newBookingName}
                    onChange={(e) => setNewBookingName(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 90000 11111"
                    value={newBookingPhone}
                    onChange={(e) => setNewBookingPhone(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Select Service
                    </label>
                    <select
                      value={newBookingService}
                      onChange={(e) => setNewBookingService(e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    >
                      {servicesList.length === 0 && (
                        <option value="">No services available</option>
                      )}
                      {servicesList.map((s, idx) => (
                        <option key={idx} value={s._id}>
                          {s.name} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Assign Stylist
                    </label>
                    <select
                      value={newBookingBarber}
                      onChange={(e) => setNewBookingBarber(e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    >
                      {barbersList.length === 0 && (
                        <option value="">No stylist available</option>
                      )}
                      {barbersList.map((barber, idx) => (
                        <option key={idx} value={barber._id}>
                          {barber.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newBookingDate}
                      onChange={(e) => setNewBookingDate(e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Time Slot
                    </label>
                    <select
                      value={newBookingTime}
                      onChange={(e) => setNewBookingTime(e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    >
                      <option value="09:30">09:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:30">03:30 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:30">06:30 PM</option>
                      <option value="20:00">08:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full text-center bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  Create Appointment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
