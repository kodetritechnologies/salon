"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { io, Socket } from "socket.io-client";
import BasicProvider from "@/utils/BasicProvider";

let socket: Socket | null = null;
if (typeof window !== "undefined") {
  const isVercel = window.location.hostname.includes("vercel.app");
  if (!isVercel) {
    socket = io();
  }
}

const slots = ["09:30", "11:00", "12:30", "14:00", "15:30", "17:00", "18:30", "20:00"];

export function Booking({ services, staff }: { services?: any[]; staff?: any[] }) {
  const { getMethod, postMethod } = BasicProvider();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [staffList, setStaffList] = useState<any[]>(staff || []);
  const [formDataVal, setFormDataVal] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    service: "",
    barber: "No preference",
    notes: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const activeServices = services || [];
  const activeStaff = staffList;

  const serviceOptions = activeServices.map((s) => ({ value: s._id, label: `${s.name} (₹${s.price})` }));
  const staffOptions = [
    { value: "No preference", label: "No preference" },
    ...activeStaff.filter((st) => st.status === "Available").map((st) => ({ value: st._id, label: st.name }))
  ];

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSlotInPast = (selectedDateStr: string, slotTimeStr: string) => {
    const todayStr = getTodayDateString();
    if (selectedDateStr !== todayStr) {
      return false;
    }
    const [slotHours, slotMinutes] = slotTimeStr.split(":").map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (slotHours < currentHours) {
      return true;
    }
    if (slotHours === currentHours && slotMinutes <= currentMinutes) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let active = true;
    const fetchStaff = async () => {
      try {
        const data = await getMethod("/api/staff");
        if (data && data.success && data.staff && active) {
          setStaffList(data.staff);
        }
      } catch (err) {
        console.error("Error fetching staff dynamically:", err);
      }
    };
    fetchStaff();
    return () => {
      active = false;
    };
  }, [staff]);

  useEffect(() => {
    const handleSelectBarber = (e: Event) => {
      const customEvent = e as CustomEvent<{ barberId: string }>;
      if (customEvent.detail && customEvent.detail.barberId) {
        setFormDataVal((prev) => ({
          ...prev,
          barber: customEvent.detail.barberId,
        }));
      }
    };
    window.addEventListener("select-barber", handleSelectBarber);
    return () => {
      window.removeEventListener("select-barber", handleSelectBarber);
    };
  }, []);

  useEffect(() => {
    const today = getTodayDateString();
    const firstAvailableTime = slots.find((s) => !isSlotInPast(today, s)) || slots[0];

    setFormDataVal((prev) => ({
      ...prev,
      date: prev.date || today,
      time: prev.time || firstAvailableTime,
      service: prev.service || (serviceOptions[0]?.value || ""),
      barber: prev.barber || "No preference",
    }));
  }, [activeServices, activeStaff]);

  useEffect(() => {
    if (formDataVal.date) {
      const todayStr = getTodayDateString();
      const isCurrentTimeDisabled = formDataVal.date === todayStr && isSlotInPast(formDataVal.date, formDataVal.time);
      if (isCurrentTimeDisabled) {
        const firstAvailable = slots.find((s) => !isSlotInPast(formDataVal.date, s));
        if (firstAvailable) {
          setFormDataVal((prev) => ({ ...prev, time: firstAvailable }));
        }
      }
    }
  }, [formDataVal.date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;

    if (name === "phone") {
      value = value.replace(/\D/g, "");
    }

    setFormDataVal((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formDataVal.name.trim()) {
      newErrors.name = "Full Name is required.";
    } else if (formDataVal.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!formDataVal.phone) {
      newErrors.phone = "Phone Number is required.";
    } else if (formDataVal.phone.length < 10 || formDataVal.phone.length > 15) {
      newErrors.phone = "Phone Number must be between 10 and 15 digits.";
    }

    if (formDataVal.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formDataVal.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formDataVal.service) {
      newErrors.service = "Service selection is required.";
    }

    if (!formDataVal.barber) {
      newErrors.barber = "Barber selection is required.";
    }

    const todayStr = getTodayDateString();
    if (!formDataVal.date) {
      newErrors.date = "Date is required.";
    } else if (formDataVal.date < todayStr) {
      newErrors.date = "Appointment date cannot be in the past.";
    }

    if (!formDataVal.time) {
      newErrors.time = "Time slot is required.";
    } else if (formDataVal.date === todayStr && isSlotInPast(formDataVal.date, formDataVal.time)) {
      newErrors.time = "Selected time slot has already passed today.";
    }

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      setTimeout(() => {
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
          element.focus();
        }
      }, 0);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const service = formDataVal.service;
    const barber = formDataVal.barber;
    const selectedService = activeServices.find((s) => s._id === service);
    const price = selectedService ? selectedService.price : 500;

    try {
      const resData = await postMethod("/api/bookings", {
        name: formDataVal.name,
        phone: formDataVal.phone,
        email: formDataVal.email,
        service,
        barber,
        date: formDataVal.date,
        time: formDataVal.time,
        price,
        status: "Pending",
        notes: formDataVal.notes,
      });

      if (resData && resData.success) {
        setSubmitted(true);
        if (socket && resData.booking) {
          socket.emit("new-booking", resData.booking);
        }
        setFormDataVal({
          name: "",
          phone: "",
          email: "",
          date: getTodayDateString(),
          time: slots.find((s) => !isSlotInPast(getTodayDateString(), s)) || slots[0],
          service: serviceOptions[0]?.value || "",
          barber: "No preference",
          notes: "",
        });
      } else {
        setErrorMsg(resData.message || "Failed to confirm appointment. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = getTodayDateString();
  const timeOptions = slots.map((s) => ({
    value: s,
    label: s,
    disabled: formDataVal.date === todayStr && isSlotInPast(formDataVal.date, s),
  }));

  return (
    <section id="booking" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Book Appointment"
          title={<>Reserve your <span className="text-gradient-gold">royal chair</span></>}
          description="Pick your service, preferred barber and time — we'll handle the rest."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <div className="glass-strong rounded-3xl p-6 shadow-elegant sm:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-gold shadow-gold">
                  <CheckCircle2 className="h-8 w-8 text-ink" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-foreground">
                  Appointment Confirmed!
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Thank you for choosing Royal Gents Salon. We've received your request and our team will call you shortly to confirm.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full border border-gold/40 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 cursor-pointer"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Aman Sharma"
                  value={formDataVal.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="9999999999"
                  value={formDataVal.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  maxLength={15}
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="sm:col-span-2"
                  value={formDataVal.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <Select
                  label="Service"
                  name="service"
                  options={serviceOptions}
                  value={formDataVal.service}
                  onChange={handleChange}
                  error={errors.service}
                />
                <Select
                  label="Preferred Barber"
                  name="barber"
                  options={staffOptions}
                  value={formDataVal.barber}
                  onChange={handleChange}
                  error={errors.barber}
                />

                <Field
                  label="Date"
                  name="date"
                  type="date"
                  min={todayStr}
                  value={formDataVal.date}
                  onChange={handleChange}
                  error={errors.date}
                />
                <Select
                  label="Time Slot"
                  name="time"
                  options={timeOptions}
                  value={formDataVal.time}
                  onChange={handleChange}
                  error={errors.time}
                />

                {errorMsg && (
                  <div className="sm:col-span-2 text-xs text-red-400 font-semibold bg-red-500/10 border border-red-500/20 p-3.5 rounded-full text-center">
                    {errorMsg}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Anything specific we should know?"
                    value={formDataVal.notes}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gold/20 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-gold/60 focus:bg-foreground/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-4 text-sm font-semibold text-ink shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Calendar className="h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Confirm Appointment"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  className = "",
  error,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  [key: string]: any;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-full border bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:bg-foreground/10 ${error ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/60"
          }`}
        {...props}
      />
      {error && (
        <span className="mt-1.5 block text-xs text-red-400 font-medium pl-2">
          {error}
        </span>
      )}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
  className = "",
  ...props
}: {
  label: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  error?: string;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          className={`w-full appearance-none rounded-full border bg-foreground/5 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:bg-foreground/10 cursor-pointer ${error ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/60"
            }`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-card text-foreground" disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gold">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="mt-1.5 block text-xs text-red-400 font-medium pl-2">
          {error}
        </span>
      )}
    </div>
  );
}
