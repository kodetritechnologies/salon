"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Star
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import { showSuccess, showError, confirmAction } from "@/utils/helpers/alertHelper";

interface Staff {
  _id: string;
  name: string;
  role: string;
  status: "Available" | "On Break" | "Leave";
  rating: number;
  experience: string;
  avatarIndex: number;
}

export default function StaffOrganizer() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  
  // Modal Input state
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Barber");
  const [newStaffExperience, setNewStaffExperience] = useState("5 years");
  const [newStaffAvatarIndex, setNewStaffAvatarIndex] = useState(0);
  const [newStaffRating, setNewStaffRating] = useState(5.0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { getMethod, postMethod, patchMethod, deleteMethod } = BasicProvider();

  const fetchStaff = async () => {
    try {
      const data = await getMethod("/api/staff");
      if (data && data.success) {
        setStaff(data.staff);
      }
    } catch (error) {
      console.error("Failed to load staff crew:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddModal = () => {
    setNewStaffName("");
    setNewStaffRole("Barber");
    setNewStaffExperience("5 years");
    setNewStaffAvatarIndex(0);
    setNewStaffRating(5.0);
    setErrors({});
    setShowAddStaffModal(true);
  };

  const handleFieldChange = (setter: (val: any) => void, fieldKey: string, value: any) => {
    setter(value);
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newStaffName.trim()) {
      newErrors.name = "Stylist Full Name is required.";
    } else if (newStaffName.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    if (!newStaffRole.trim()) {
      newErrors.role = "Specialist Role / Title is required.";
    } else if (newStaffRole.trim().length < 3) {
      newErrors.role = "Role must be at least 3 characters long.";
    }

    if (!newStaffExperience.trim()) {
      newErrors.experience = "Experience description is required.";
    }

    if (newStaffRating === undefined || isNaN(newStaffRating)) {
      newErrors.rating = "Rating is required.";
    } else if (newStaffRating < 1.0 || newStaffRating > 5.0) {
      newErrors.rating = "Rating must be between 1.0 and 5.0.";
    }

    setErrors(newErrors);

    // Autofocus on first error
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey) {
      setTimeout(() => {
        const element = document.getElementById(firstErrorKey);
        if (element) {
          element.focus();
        }
      }, 0);
    }

    return Object.keys(newErrors).length === 0;
  };

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        name: newStaffName,
        role: newStaffRole,
        experience: newStaffExperience,
        avatarIndex: Number(newStaffAvatarIndex),
        rating: Number(newStaffRating) || 5.0,
        status: "Available",
      };

      const data = await postMethod("/api/staff", payload);
      if (data && data.success) {
        showSuccess("Success", "Stylist registered successfully.");
        fetchStaff();
        setNewStaffName("");
        setNewStaffRole("Barber");
        setNewStaffExperience("5 years");
        setNewStaffAvatarIndex(0);
        setNewStaffRating(5.0);
        setErrors({});
        setShowAddStaffModal(false);
      } else {
        showError("Failed", data.message || "Failed to register stylist.");
      }
    } catch (error: any) {
      showError("Error", error.message || "Something went wrong.");
    }
  };

  const toggleStaffStatus = async (id: string, currentStatus: Staff["status"]) => {
    const nextStatusMap: Record<Staff["status"], Staff["status"]> = {
      Available: "On Break",
      "On Break": "Leave",
      Leave: "Available",
    };
    const nextStatus = nextStatusMap[currentStatus];

    try {
      const data = await patchMethod(`/api/staff/${id}`, { status: nextStatus });
      if (data && data.success) {
        fetchStaff();
      } else {
        showError("Failed", data.message || "Failed to update status.");
      }
    } catch (error: any) {
      showError("Error", error.message || "Something went wrong.");
    }
  };

  const deleteStaffMember = async (id: string, name: string) => {
    const confirmed = await confirmAction(
      "Are you sure?",
      `Do you want to remove ${name} from the staff crew?`,
      "Delete"
    );
    if (!confirmed) return;

    try {
      const data = await deleteMethod(`/api/staff/${id}`, {});
      if (data && data.success) {
        showSuccess("Deleted", "Stylist removed successfully.");
        fetchStaff();
      } else {
        showError("Failed", data.message || "Failed to delete stylist.");
      }
    } catch (error: any) {
      showError("Error", error.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading staff crew...
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
            Staff & Stylists
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
            Manage barbers, specialty roles, and availability
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Stylist</span>
        </button>
      </div>

      {/* Staff Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {staff.map((s) => (
          <div
            key={s._id}
            className="glass p-5 rounded-2xl hover:border-gold/40 transition-colors flex flex-col justify-between shadow-soft text-center relative"
          >
            {/* Delete Button */}
            <button
              onClick={() => deleteStaffMember(s._id, s.name)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Delete Stylist"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              {/* Profile initials circle */}
              <div className="mx-auto h-16 w-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center font-display text-2xl font-bold text-gold shadow-gold">
                {s.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h4 className="text-base font-bold text-foreground">{s.name}</h4>
                <p className="text-xs text-muted-foreground">{s.role}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Exp: {s.experience}</p>
              </div>

              {/* Rating stars display */}
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-gold bg-gold/10 border border-gold/15 rounded-full max-w-[80px] mx-auto py-0.5">
                ★ {s.rating}
              </div>
            </div>

            {/* Status indicator button */}
            <div className="mt-6 pt-4 border-t border-gold/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Duty:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.status === "Available"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : s.status === "On Break"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-destructive/10 text-destructive-foreground border border-destructive/20"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <button
                onClick={() => toggleStaffStatus(s._id, s.status)}
                className="w-full text-center py-2 bg-foreground/5 hover:bg-gold/15 rounded-full text-[10px] font-bold text-gold border border-gold/15 transition-all cursor-pointer"
              >
                Switch Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAddStaffModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddStaffModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">Add New Stylist</h3>
                <button
                  onClick={() => setShowAddStaffModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={addStaff} noValidate className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Stylist Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Ramesh Dev"
                    value={newStaffName}
                    onChange={(e) => handleFieldChange(setNewStaffName, "name", e.target.value)}
                    className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                      errors.name ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                    }`}
                  />
                  {errors.name && (
                    <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Specialist Role / Title
                  </label>
                  <input
                    type="text"
                    id="role"
                    placeholder="e.g. Hair Sculptor / Massage Pro"
                    value={newStaffRole}
                    onChange={(e) => handleFieldChange(setNewStaffRole, "role", e.target.value)}
                    className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                      errors.role ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                    }`}
                  />
                  {errors.role && (
                    <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                      {errors.role}
                    </span>
                  )}
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Experience
                    </label>
                    <input
                      type="text"
                      id="experience"
                      placeholder="e.g. 5 years"
                      value={newStaffExperience}
                      onChange={(e) => handleFieldChange(setNewStaffExperience, "experience", e.target.value)}
                      className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                        errors.experience ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                      }`}
                    />
                    {errors.experience && (
                      <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                        {errors.experience}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Rating (1.0 - 5.0)
                    </label>
                    <input
                      type="number"
                      id="rating"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newStaffRating}
                      onChange={(e) => handleFieldChange(setNewStaffRating, "rating", Number(e.target.value))}
                      className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                        errors.rating ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                      }`}
                    />
                    {errors.rating && (
                      <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                        {errors.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Select Profile Avatar
                  </label>
                  <select
                    value={newStaffAvatarIndex}
                    onChange={(e) => handleFieldChange(setNewStaffAvatarIndex, "avatarIndex", Number(e.target.value))}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 appearance-none cursor-pointer"
                  >
                    <option value={0}>Barber Avatar 1</option>
                    <option value={1}>Barber Avatar 2</option>
                    <option value={2}>Barber Avatar 3</option>
                    <option value={3}>Barber Avatar 4</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full text-center bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  Register Stylist
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
