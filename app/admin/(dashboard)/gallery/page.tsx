"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Upload, Loader2, Pencil } from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import { confirmAction } from "@/utils/helpers/alertHelper";
import toast from "react-hot-toast";

interface GalleryItem {
  _id: string;
  imageUrl: string;
  alt: string;
  span: string;
}

export default function GalleryOrganizer() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit states
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [editFilePreview, setEditFilePreview] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editSpan, setEditSpan] = useState("");

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [alt, setAlt] = useState("");
  const [span, setSpan] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { getMethod, postMethod, patchMethod, deleteMethod } = BasicProvider();

  const fetchGallery = async () => {
    try {
      const data = await getMethod("/api/gallery");
      if (data && data.success) {
        setGallery(data.gallery);
      }
    } catch (error) {
      console.error("Failed to load gallery items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setFile(null);
    setFilePreview("");
    setAlt("Royal Gents Salon image");
    setSpan("");
    setErrors({});
    setShowAddModal(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditItem(item);
    setEditFilePreview("");
    setEditAlt(item.alt);
    setEditSpan(item.span || "");
    setErrors({});
    setShowEditModal(true);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleEditGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    setUploading(true);
    try {
      let finalImageUrl = editItem.imageUrl;

      // Upload new image if chosen
      if (editFilePreview) {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: editFilePreview }),
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          throw new Error(uploadData.message || "Failed to upload image to Cloudinary.");
        }
        finalImageUrl = uploadData.url;
      }

      const payload = {
        imageUrl: finalImageUrl,
        alt: editAlt || "Royal Gents Salon image",
        span: editSpan,
      };

      const data = await patchMethod(`/api/gallery/${editItem._id}`, payload);
      if (data && data.success) {
        toast.success("Gallery image details updated successfully.");
        fetchGallery();
        setShowEditModal(false);
      } else {
        toast.error(data.message || "Failed to update gallery item.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create local preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);

      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!filePreview) {
      newErrors.file = "Please select an image file to upload.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    try {
      // 1. Upload file to /api/upload
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: filePreview }),
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) {
        throw new Error(uploadData.message || "Failed to upload image to Cloudinary.");
      }

      // 2. Save gallery item in MongoDB
      const payload = {
        imageUrl: uploadData.url,
        alt: alt || "Royal Gents Salon image",
        span,
      };

      const data = await postMethod("/api/gallery", payload);
      if (data && data.success) {
        toast.success("Gallery image added successfully.");
        fetchGallery();
        setShowAddModal(false);
      } else {
        toast.error(data.message || "Failed to save gallery item.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    const confirmed = await confirmAction(
      "Are you sure?",
      "Do you want to delete this image from the gallery?",
      "Delete"
    );
    if (!confirmed) return;

    try {
      const data = await deleteMethod(`/api/gallery/${id}`, {});
      if (data && data.success) {
        toast.success("Gallery item deleted successfully.");
        fetchGallery();
      } else {
        toast.error(data.message || "Failed to delete gallery item.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading gallery...
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
            Gallery Management
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
            Manage the royal salon dynamic display grid
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15 max-w-lg mx-auto">
          No custom gallery photos uploaded yet. Standard fallback images will be displayed on the homepage.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
          {gallery.map((item) => (
            <div
              key={item._id}
              className={`group relative overflow-hidden rounded-2xl border border-gold/15 glass shadow-soft ${item.span}`}
            >
              <img
                src={item.imageUrl}
                alt={item.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4" >
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 bg-gold/20 border border-gold/30 rounded-xl text-gold hover:bg-gold hover:text-ink transition-colors cursor-pointer"
                    title="Edit Photo"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-2 bg-destructive/20 border border-destructive/30 rounded-xl text-destructive-foreground hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-wider text-gold font-bold">
                    {item.span === "row-span-2" ? "Tall Grid" : "Normal Grid"}
                  </span>
                  <p className="text-xs text-white font-medium truncate mt-0.5" title={item.alt}>
                    {item.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowAddModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">Upload Gallery Photo</h3>
                <button
                  disabled={uploading}
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10 disabled:opacity-50"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddGalleryItem} noValidate className="space-y-4">
                {/* File picker with preview */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Choose Image File
                  </label>
                  <div className="relative border-2 border-dashed border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center bg-background/50 cursor-pointer">
                    {filePreview ? (
                      <>
                        <img src={filePreview} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setFilePreview("");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer">
                        <Upload className="h-8 w-8 text-gold/60 mb-2" />
                        <span className="text-xs text-muted-foreground">Click to upload photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.file && (
                    <span className="mt-1 block text-[10px] text-red-400 font-medium pl-2">
                      {errors.file}
                    </span>
                  )}
                </div>

                {/* Alt Description */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Photo Description (Alt)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharp beard styling with razor line details"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    className="w-full bg-background border border-gold/20 focus:border-gold/50 px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors"
                  />
                </div>

                {/* Span configuration */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Grid Aspect / Layout
                  </label>
                  <select
                    value={span}
                    onChange={(e) => setSpan(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 appearance-none cursor-pointer"
                  >
                    <option value="">Normal Aspect (Square / Landscape)</option>
                    <option value="row-span-2">Tall Aspect (Vertical - 2 rows)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <span>Register Photo</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Photo Modal */}
      <AnimatePresence>
        {showEditModal && editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploading && setShowEditModal(false)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-gold/25 p-6 rounded-3xl shadow-elegant z-10"
            >
              <div className="flex justify-between items-center border-b border-gold/15 pb-3.5 mb-5">
                <h3 className="font-display text-lg font-bold text-foreground">Edit Gallery Photo</h3>
                <button
                  disabled={uploading}
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-full border border-gold/25 text-gold hover:bg-gold/10 disabled:opacity-50"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleEditGalleryItem} noValidate className="space-y-4">
                {/* File picker with preview */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Image File (Optional - Leave to keep current)
                  </label>
                  <div className="relative border-2 border-dashed border-gold/20 hover:border-gold/50 rounded-2xl overflow-hidden aspect-video flex flex-col items-center justify-center bg-background/50 cursor-pointer">
                    {editFilePreview || editItem.imageUrl ? (
                      <>
                        <img src={editFilePreview || editItem.imageUrl} alt="Upload preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setEditFilePreview("");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer">
                        <Upload className="h-8 w-8 text-gold/60 mb-2" />
                        <span className="text-xs text-muted-foreground">Click to change photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Alt Description */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Photo Description (Alt)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharp beard styling"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="w-full bg-background border border-gold/20 focus:border-gold/50 px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors"
                  />
                </div>

                {/* Grid span configuration */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-gold">
                    Grid Aspect / Layout
                  </label>
                  <select
                    value={editSpan}
                    onChange={(e) => setEditSpan(e.target.value)}
                    className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50 appearance-none cursor-pointer"
                  >
                    <option value="">Normal Aspect (Square / Landscape)</option>
                    <option value="row-span-2">Tall Aspect (Vertical - 2 rows)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-gold py-3 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating in Cloudinary...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
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
