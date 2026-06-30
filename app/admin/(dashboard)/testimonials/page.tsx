"use client";

import { useEffect, useState } from "react";
import { Plus, X, Pencil, Trash2, Star, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BasicProvider from "@/utils/BasicProvider";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  const { getMethod, postMethod, patchMethod, deleteMethod } = BasicProvider();

  const fetchTestimonials = async () => {
    try {
      const data = await getMethod("/api/testimonials");
      if (data && data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setRole("Customer");
    setText("");
    setRating(5);
    setShowModal(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingId(t._id);
    setName(t.name);
    setRole(t.role);
    setText(t.text);
    setRating(t.rating);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    try {
      const payload = { name, role, text, rating };

      if (editingId) {
        const data = await patchMethod(`/api/testimonials/${editingId}`, payload);
        if (data && data.success) {
          fetchTestimonials();
          setShowModal(false);
        } else {
          alert(data.message || "Failed to update review.");
        }
      } else {
        const data = await postMethod("/api/testimonials", payload);
        if (data && data.success) {
          fetchTestimonials();
          setShowModal(false);
        } else {
          alert(data.message || "Failed to add review.");
        }
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this testimonial?")) return;

    try {
      const data = await deleteMethod(`/api/testimonials/${id}`);
      if (data && data.success) {
        fetchTestimonials();
      } else {
        alert(data.message || "Failed to delete testimonial.");
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading testimonials console...
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
            Testimonials & Reviews
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
            Organize customer reviews displayed on the website
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid of reviews */}
      {testimonials.length === 0 ? (
        <div className="glass p-12 text-center rounded-3xl border border-gold/15">
          <MessageSquare className="h-10 w-10 text-gold/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-semibold">No reviews registered yet!</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Click the button above to register your first review.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t._id} className="glass p-6 rounded-3xl shadow-elegant border border-gold/10 relative flex flex-col justify-between hover:border-gold/30 transition-colors">
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5 text-gold mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="flex gap-1.5 z-10">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1.5 bg-gold/10 border border-gold/25 rounded hover:bg-gold hover:text-ink text-gold transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 bg-destructive/10 border border-destructive/25 rounded hover:bg-destructive hover:text-white text-destructive-foreground transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 italic">"{t.text}"</p>
              </div>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gold/10">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 border border-gold/30 font-display text-sm font-bold text-gold shrink-0">
                  {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editingId ? "Modify Testimonial" : "Register Testimonial"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Profession / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer (or Customer)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Star Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Fair)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Review Text
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide the client's review text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-3 rounded-2xl text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-6 w-full text-center bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  {editingId ? "Save Changes" : "Register Testimonial"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
