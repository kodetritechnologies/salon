"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  Trash2,
  Edit2,
  X,
  Upload,
  Loader2
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import toast from "react-hot-toast";
import { confirmAction } from "@/utils/helpers/alertHelper";

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: string;
  category: string;
  features?: string[];
  featured?: boolean;
  imageUrl?: string;
}

export default function ServicesCustomizer() {
  const { getMethod, postMethod, patchMethod, deleteMethod } = BasicProvider();
  const [services, setServices] = useState<Service[]>([]);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal Input state
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("30 min");
  const [newServiceCategory, setNewServiceCategory] = useState("Grooming");
  const [newServiceFeatures, setNewServiceFeatures] = useState("");
  const [newServiceFeatured, setNewServiceFeatured] = useState(false);
  const [newServiceImagePreview, setNewServiceImagePreview] = useState("");
  const [newServiceExistingImageUrl, setNewServiceExistingImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fetchServices = async () => {
    const data = await getMethod("/api/services");
    if (data && data.success) {
      setServices(data.services);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setNewServiceName("");
    setNewServicePrice("");
    setNewServiceDuration("30 min");
    setNewServiceCategory("Grooming");
    setNewServiceFeatures("");
    setNewServiceFeatured(false);
    setNewServiceImagePreview("");
    setNewServiceExistingImageUrl("");
    setUploadingImage(false);
    setErrors({});
    setShowAddServiceModal(true);
  };

  const openEditModal = (s: Service) => {
    setEditingId(s._id);
    setNewServiceName(s.name);
    setNewServicePrice(s.price.toString());
    setNewServiceDuration(s.duration);
    setNewServiceCategory(s.category);
    setNewServiceFeatures(s.features ? s.features.join(", ") : "");
    setNewServiceFeatured(!!s.featured);
    setNewServiceImagePreview("");
    setNewServiceExistingImageUrl(s.imageUrl || "");
    setUploadingImage(false);
    setErrors({});
    setShowAddServiceModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewServiceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (setter: (val: any) => void, fieldKey: string, value: any) => {
    setter(value);
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!newServiceName.trim()) {
      newErrors.name = "Treatment Name is required.";
    } else if (newServiceName.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
    }

    const priceVal = parseFloat(newServicePrice);
    if (!newServicePrice.trim()) {
      newErrors.price = "Cost Price is required.";
    } else if (isNaN(priceVal) || priceVal <= 0) {
      newErrors.price = "Cost Price must be a valid positive number.";
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

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploadingImage(true);
    try {
      let finalImageUrl = newServiceExistingImageUrl;

      if (newServiceImagePreview) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: newServiceImagePreview }),
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Failed to upload image.");
        }
        finalImageUrl = uploadData.url;
      }

      const parsedFeatures = newServiceFeatures
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload = {
        name: newServiceName,
        price: parseFloat(newServicePrice),
        duration: newServiceDuration,
        category: newServiceCategory,
        features: parsedFeatures,
        featured: newServiceFeatured,
        imageUrl: finalImageUrl,
      };

      if (editingId) {
        const data = await patchMethod(`/api/services/${editingId}`, payload);
        if (data && data.success) {
          toast.success("Service updated successfully.");
          fetchServices();
          setNewServiceName("");
          setNewServicePrice("");
          setEditingId(null);
          setShowAddServiceModal(false);
        } else {
          toast.error(data.message || "Failed to update service.");
        }
      } else {
        const data = await postMethod("/api/services", payload);
        if (data && data.success) {
          toast.success("Service created successfully.");
          fetchServices();
          setNewServiceName("");
          setNewServicePrice("");
          setShowAddServiceModal(false);
        } else {
          toast.error(data.message || "Failed to create service.");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteService = async (id: string) => {
    const confirmed = await confirmAction(
      "Are you sure?",
      "You want to permanently delete this service?",
      "Delete"
    );
    if (!confirmed) return;

    try {
      const data = await deleteMethod(`/api/services/${id}`);
      if (data && data.success) {
        toast.success("Service deleted successfully.");
        fetchServices();
      } else {
        toast.error(data.message || "Failed to delete service.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-gradient-gold leading-none">
            Services Catalog
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
            Add, update, or remove styling treatments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Treatment</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s._id}
            className={`glass p-5 rounded-2xl flex flex-col justify-between hover:border-gold/45 transition-all shadow-soft animate-fade-in ${
              s.featured ? "ring-1 ring-gold/40 border-gold/40" : ""
            }`}
          >
            <div className="space-y-3">
              {s.imageUrl && (
                <div className="relative h-32 rounded-xl overflow-hidden mb-3 border border-gold/15 shadow-soft">
                  <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-gold/15 text-gold border border-gold/25 rounded-md text-[9px] font-bold uppercase tracking-wider">
                    {s.category}
                  </span>
                  {s.featured && (
                    <span className="px-2 py-0.5 bg-gradient-gold text-ink rounded-md text-[8px] font-bold uppercase tracking-wider shadow-gold">
                      Featured
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteService(s._id)}
                  className="p-1 text-muted-foreground hover:text-destructive-foreground transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <h4 className="text-base font-bold text-foreground">{s.name}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{s.duration}</span>
                </div>
                {s.features && s.features.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gold">Features:</p>
                    <ul className="text-[10px] text-muted-foreground list-disc list-inside space-y-0.5">
                      {s.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="truncate">{feat}</li>
                      ))}
                      {s.features.length > 3 && (
                        <li className="list-none text-gold font-semibold">+{s.features.length - 3} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gold/10 flex justify-between items-center">
              <span className="font-display font-bold text-gradient-gold text-lg">₹{s.price}</span>
              <button
                onClick={() => openEditModal(s)}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-gold hover:underline cursor-pointer"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {showAddServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddServiceModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editingId ? "Edit Treatment" : "Add New Treatment"}
                </h3>
                <button
                  disabled={uploadingImage}
                  onClick={() => setShowAddServiceModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10 disabled:opacity-50"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={saveService} noValidate className="space-y-4">
                {/* Treatment Name (Full Width) */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Treatment Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g. Royal Shaving"
                    value={newServiceName}
                    onChange={(e) => handleFieldChange(setNewServiceName, "name", e.target.value)}
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

                {/* 3-Column Grid for Category, Duration, and Price */}
                <div className="grid gap-4 grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Category
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => handleFieldChange(setNewServiceCategory, "category", e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    >
                      <option value="Grooming">Grooming</option>
                      <option value="Haircare">Haircare</option>
                      <option value="Skincare">Skincare</option>
                      <option value="Coloring">Coloring</option>
                      <option value="Therapy">Therapy</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Duration
                    </label>
                    <select
                      value={newServiceDuration}
                      onChange={(e) => handleFieldChange(setNewServiceDuration, "duration", e.target.value)}
                      className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 cursor-pointer"
                    >
                      <option value="15 min">15 min</option>
                      <option value="20 min">20 min</option>
                      <option value="30 min">30 min</option>
                      <option value="45 min">45 min</option>
                      <option value="60 min">60 min</option>
                      <option value="90 min">90 min</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                      Cost (INR)
                    </label>
                    <input
                      type="number"
                      id="price"
                      placeholder="e.g. 500"
                      value={newServicePrice}
                      onChange={(e) => handleFieldChange(setNewServicePrice, "price", e.target.value)}
                      className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                        errors.price ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                      }`}
                    />
                    {errors.price && (
                      <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                        {errors.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Treatment Features (Full Width) */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Treatment Features (Comma Separated)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Precision haircut, Wash & dry, Styling"
                    value={newServiceFeatures}
                    onChange={(e) => setNewServiceFeatures(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2 rounded-2xl text-xs text-foreground outline-none focus:border-gold/50 resize-none animate-none"
                  />
                </div>

                {/* Service Image (Full Width Dropzone style) */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Service Image (Optional)
                  </label>
                  <div className="relative border border-dashed border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden h-16 flex items-center justify-center bg-background/50 cursor-pointer">
                    {newServiceImagePreview || newServiceExistingImageUrl ? (
                      <div className="flex items-center justify-between w-full h-full px-4 bg-background/40">
                        <div className="flex items-center gap-3">
                          <img src={newServiceImagePreview || newServiceExistingImageUrl} alt="Service preview" className="w-10 h-10 rounded-lg object-cover border border-gold/20" />
                          <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">Selected Image</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewServiceImagePreview("");
                            if (!newServiceImagePreview) {
                              setNewServiceExistingImageUrl("");
                            }
                          }}
                          className="p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-full flex items-center justify-center gap-2 cursor-pointer text-center">
                        <Upload className="h-4 w-4 text-gold/60" />
                        <span className="text-[10px] text-muted-foreground">Select Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Featured Checkbox and Submit Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newServiceFeatured}
                      onChange={(e) => setNewServiceFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-gold/30 text-gold focus:ring-gold bg-background accent-gold cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                      Featured (Show in Pricing)
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Treatment...</span>
                    </>
                  ) : (
                    <span>{editingId ? "Save Changes" : "Add Service"}</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
