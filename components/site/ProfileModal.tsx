"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CalendarDays,
  LogOut,
  Phone,
  ShieldCheck,
  Mail,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Scissors
} from "lucide-react";
import Cookies from "js-cookie";
import BasicProvider from "@/utils/BasicProvider";
import { confirmAction } from "@/utils/helpers/alertHelper";
import toast from "react-hot-toast";

interface Booking {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service: {
    _id: string;
    name: string;
    price: number;
  };
  barber: {
    _id: string;
    name: string;
  };
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  price: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onLoginStatusChange
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginStatusChange: (isLoggedIn: boolean) => void;
}) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<"phone" | "otp">("phone");
  
  // Auth Form State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // Bookings Filter
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { getMethod, postMethod, patchMethod } = BasicProvider();

  // Load customer session
  const checkSession = async () => {
    const token = Cookies.get("customerToken");
    if (!token) {
      setCustomer(null);
      return;
    }
    try {
      setLoading(true);
      const data = await getMethod("/api/auth/customer/me");
      if (data && data.success) {
        setCustomer(data.customer);
        onLoginStatusChange(true);
        fetchBookings();
      } else {
        Cookies.remove("customerToken");
        setCustomer(null);
        onLoginStatusChange(false);
      }
    } catch (err) {
      console.error("Failed to load customer profile:", err);
      Cookies.remove("customerToken");
      setCustomer(null);
      onLoginStatusChange(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getMethod("/api/customer/bookings");
      if (data && data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Failed to fetch customer bookings:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        checkSession();
        setPhone("");
        setOtp("");
        setAuthStep("phone");
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (phone.length < 10 || phone.length > 15) {
      toast.error("Please enter a valid phone number between 10 and 15 digits.");
      return;
    }

    setLoading(true);
    try {
      const data = await postMethod("/api/auth/customer/login", { phone });
      if (data && data.success) {
        toast.success(data.message, { duration: 6000 });
        setAuthStep("otp");
      } else {
        toast.error(data.message || "Failed to submit phone number.");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const data = await postMethod("/api/auth/customer/verify", { phone, code: otp });
      if (data && data.success) {
        Cookies.set("customerToken", data.token, { expires: 7 });
        setCustomer(data.customer);
        onLoginStatusChange(true);
        toast.success("Welcome back! Logged in successfully.");
        fetchBookings();
      } else {
        toast.error(data.message || "Invalid verification code.");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = await confirmAction(
      "Cancel Appointment?",
      "Are you sure you want to cancel this booking? This action cannot be undone.",
      "Cancel Booking"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const data = await patchMethod(`/api/customer/bookings/${bookingId}`, {});
      if (data && data.success) {
        toast.success("Appointment cancelled successfully.");
        fetchBookings();
      } else {
        toast.error(data.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await postMethod("/api/auth/customer/logout", {});
    } catch (err) {
      console.error("Logout API call error:", err);
    }
    Cookies.remove("customerToken");
    setCustomer(null);
    setBookings([]);
    onLoginStatusChange(false);
    toast.success("Logged out successfully.");
    onClose();
  };

  const upcomingBookings = bookings.filter(b => b.status === "Pending" || b.status === "Confirmed");
  const pastBookings = bookings.filter(b => b.status === "Completed" || b.status === "Cancelled");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl overflow-hidden glass-strong rounded-3xl border border-gold/25 text-foreground shadow-elegant flex flex-col max-h-[85vh] z-10"
          >
            {/* Scoped scrollbar styles */}
            <style dangerouslySetInnerHTML={{__html: `
              .custom-modal-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(212, 175, 55, 0.2);
                border-radius: 99px;
              }
              .custom-modal-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(212, 175, 55, 0.45);
              }
              .custom-modal-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: rgba(212, 175, 55, 0.2) transparent;
              }
            `}} />

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-gold/15">
              <div className="flex items-center gap-2.5">
                <Scissors className="h-5 w-5 text-gold" />
                <h3 className="font-display text-xl font-bold text-gradient-gold">
                  {customer ? "My Client Profile" : "Client Portal Log In"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-muted-foreground hover:text-gold hover:bg-gold/15 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-modal-scrollbar">
              {loading && !customer ? (
                <div className="flex flex-col items-center justify-center py-20 text-foreground">
                  <Loader2 className="h-8 w-8 text-gold animate-spin mb-4" />
                  <p className="text-xs uppercase tracking-widest text-gold font-semibold">Syncing profile...</p>
                </div>
              ) : !customer ? (
                /* AUTH FLOW */
                <div className="max-w-md mx-auto py-8">
                  {authStep === "phone" ? (
                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold mb-2">
                          <Phone className="h-6 w-6" />
                        </div>
                        <h4 className="font-display text-lg font-bold">Access Your Appointments</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Enter the mobile number you used for booking. We will send a verification code to log you in.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gold font-semibold block">
                          Phone Number
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-4 flex items-center text-sm text-muted-foreground font-semibold">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={15}
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-card/40 border border-gold/20 rounded-2xl py-3.5 pl-14 pr-4 text-sm font-semibold tracking-wider placeholder:text-muted-foreground/40 focus:border-gold/50 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-gold py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-ink hover:scale-[1.01] active:scale-100 transition-all shadow-gold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-ink" />}
                        <span>Get Verification Code</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                      <div className="text-center space-y-2">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold mb-2">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h4 className="font-display text-lg font-bold">Verify Your Identity</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We sent a verification code to <span className="text-gold font-semibold">+91 {phone}</span>. Enter the code to continue.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                            Verification Code (OTP)
                          </label>
                          <button
                            type="button"
                            onClick={() => setAuthStep("phone")}
                            className="text-[10px] text-gold hover:underline cursor-pointer"
                          >
                            Change Number
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-card/40 border border-gold/20 rounded-2xl py-3.5 px-4 text-center text-sm font-semibold tracking-widest placeholder:text-muted-foreground/40 placeholder:tracking-normal focus:border-gold/50 focus:outline-none transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-gold py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-ink hover:scale-[1.01] active:scale-100 transition-all shadow-gold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-ink" />}
                        <span>Verify & Sign In</span>
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                /* PROFILE DASHBOARD */
                <div className="space-y-8">
                  {/* Customer Banner */}
                  <div className="glass rounded-3xl p-5 border border-gold/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold font-display text-lg font-bold text-ink flex-shrink-0">
                        {customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold">{customer.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 text-gold/65" /> +91 {customer.phone}</span>
                          {customer.email && <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-gold/65" /> {customer.email}</span>}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive-foreground hover:text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>

                  {/* Bookings Section */}
                  <div className="space-y-4">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gold/10">
                      <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`pb-3 text-xs font-bold uppercase tracking-widest px-4 border-b-2 transition-all cursor-pointer ${
                          activeTab === "upcoming"
                            ? "border-gold text-gold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Upcoming Bookings ({upcomingBookings.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("past")}
                        className={`pb-3 text-xs font-bold uppercase tracking-widest px-4 border-b-2 transition-all cursor-pointer ${
                          activeTab === "past"
                            ? "border-gold text-gold"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Booking History ({pastBookings.length})
                      </button>
                    </div>

                    {/* Booking List */}
                    <div className="space-y-3.5">
                      {activeTab === "upcoming" ? (
                        upcomingBookings.length === 0 ? (
                          <div className="py-12 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/10">
                            <CalendarDays className="h-8 w-8 text-gold/30 mx-auto mb-2" />
                            <p className="text-xs">No upcoming appointments scheduled.</p>
                          </div>
                        ) : (
                          upcomingBookings.map((b) => (
                            <div
                              key={b._id}
                              className="glass p-5 rounded-2xl border border-gold/10 hover:border-gold/25 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gradient-gold">{b.service?.name || "Grooming Service"}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                      b.status === "Confirmed"
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gold/65" /> {b.date}</span>
                                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-gold/65" /> {b.time}</span>
                                  <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-gold/65" /> Barber: {b.barber?.name || "Stylist"}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-gold/10">
                                <div className="text-left md:text-right">
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Amount</p>
                                  <p className="text-sm font-bold text-foreground">₹{b.price}</p>
                                </div>
                                <button
                                  onClick={() => handleCancelBooking(b._id)}
                                  className="border border-destructive/30 hover:border-destructive bg-destructive/5 hover:bg-destructive/10 text-destructive-foreground hover:text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ))
                        )
                      ) : (
                        pastBookings.length === 0 ? (
                          <div className="py-12 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/10">
                            <CalendarDays className="h-8 w-8 text-gold/30 mx-auto mb-2" />
                            <p className="text-xs">No previous appointments found.</p>
                          </div>
                        ) : (
                          pastBookings.map((b) => (
                            <div
                              key={b._id}
                              className="glass p-5 rounded-2xl border border-gold/10 opacity-80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-foreground/80">{b.service?.name || "Grooming Service"}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                      b.status === "Completed"
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {b.date}</span>
                                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {b.time}</span>
                                  <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Barber: {b.barber?.name || "Stylist"}</span>
                                </div>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Amount</p>
                                <p className="text-xs font-semibold text-foreground/80">₹{b.price}</p>
                              </div>
                            </div>
                          ))
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
