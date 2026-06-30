"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Info,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook
} from "lucide-react";
import BasicProvider from "@/utils/BasicProvider";
import { showSuccess, showError } from "@/utils/helpers/alertHelper";

export default function SettingsManager() {
  const [shopPhone, setShopPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [facebookUsername, setFacebookUsername] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { getMethod, postMethod } = BasicProvider();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getMethod("/api/settings");
        if (data && data.success) {
          const s = data.settings;
          setShopPhone(s.shopPhone || "");
          setWhatsappNumber(s.whatsappNumber || "");
          setShopEmail(s.shopEmail || "");
          setShopAddress(s.shopAddress || "");
          setOpenTime(s.openTime || "");
          setCloseTime(s.closeTime || "");
          setInstagramUsername(s.instagramUsername || "");
          setFacebookUsername(s.facebookUsername || "");
          setBannerText(s.bannerText || "");
          setShowBanner(s.showBanner !== undefined ? s.showBanner : true);
        }
      } catch (error: any) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveAllSettings = async (updatedFields: any) => {
    try {
      const payload = {
        shopPhone,
        whatsappNumber,
        shopEmail,
        shopAddress,
        openTime,
        closeTime,
        instagramUsername,
        facebookUsername,
        bannerText,
        showBanner,
        ...updatedFields,
      };

      const data = await postMethod("/api/settings", payload);
      if (data && data.success) {
        showSuccess("Success", data.message || "Settings updated successfully.");
      } else {
        showError("Failed", data.message || "Could not update settings.");
      }
    } catch (error: any) {
      showError("Error", error.message || "An error occurred.");
    }
  };

  const handleFieldChange = (setter: (val: string) => void, fieldKey: string, value: string) => {
    setter(value);
    if (errors[fieldKey]) {
      setErrors((prev) => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const validateContact = () => {
    const newErrors: { [key: string]: string } = {};

    // shopPhone validation
    if (!shopPhone.trim()) {
      newErrors.shopPhone = "Hotline Number is required.";
    } else {
      const cleanPhone = shopPhone.replace(/[\s\-\+]/g, "");
      if (!/^\d+$/.test(cleanPhone)) {
        newErrors.shopPhone = "Hotline Number must contain only numeric digits.";
      } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        newErrors.shopPhone = "Hotline Number must be between 10 and 15 digits.";
      }
    }

    // whatsappNumber validation
    if (whatsappNumber.trim()) {
      const cleanWA = whatsappNumber.replace(/[\s\-\+]/g, "");
      if (!/^\d+$/.test(cleanWA)) {
        newErrors.whatsappNumber = "WhatsApp Number must contain only numeric digits.";
      } else if (cleanWA.length < 10 || cleanWA.length > 15) {
        newErrors.whatsappNumber = "WhatsApp Number must be between 10 and 15 digits.";
      }
    }

    // shopEmail validation
    if (!shopEmail.trim()) {
      newErrors.shopEmail = "Email address is required.";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(shopEmail)) {
        newErrors.shopEmail = "Please enter a valid email address.";
      }
    }

    // shopAddress validation
    if (!shopAddress.trim()) {
      newErrors.shopAddress = "Physical Address is required.";
    } else if (shopAddress.trim().length < 5) {
      newErrors.shopAddress = "Address must be at least 5 characters.";
    }

    // openTime validation
    if (!openTime.trim()) {
      newErrors.openTime = "Opening Hour is required.";
    }

    // closeTime validation
    if (!closeTime.trim()) {
      newErrors.closeTime = "Closing Hour is required.";
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

  const validateBanner = () => {
    const newErrors: { [key: string]: string } = {};

    if (showBanner && !bannerText.trim()) {
      newErrors.bannerText = "Banner text is required when banner is active.";
    }

    setErrors(newErrors);

    if (newErrors.bannerText) {
      setTimeout(() => {
        const element = document.getElementById("bannerText");
        if (element) {
          element.focus();
        }
      }, 0);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContact()) return;
    saveAllSettings({});
  };

  const handleSaveBanner = () => {
    if (!validateBanner()) return;
    saveAllSettings({});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-foreground">
        <p className="text-sm font-semibold tracking-widest text-gold uppercase animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl font-extrabold text-gradient-gold leading-none">
          Salon Settings
        </h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
          Modify business details and dashboard promotions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shop Details Config */}
        <form onSubmit={handleSaveContact} noValidate className="glass p-6 sm:p-8 rounded-3xl shadow-elegant space-y-6">
          <h3 className="font-display text-lg font-bold text-foreground border-b border-gold/15 pb-2.5">
            Operational Details
          </h3>

          <div className="space-y-4">
            {/* Phone & WhatsApp */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Hotline Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="shopPhone"
                    value={shopPhone}
                    onChange={(e) => handleFieldChange(setShopPhone, "shopPhone", e.target.value)}
                    className={`w-full bg-background border pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                      errors.shopPhone ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                    }`}
                  />
                </div>
                {errors.shopPhone && (
                  <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                    {errors.shopPhone}
                  </span>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="whatsappNumber"
                    value={whatsappNumber}
                    onChange={(e) => handleFieldChange(setWhatsappNumber, "whatsappNumber", e.target.value)}
                    className={`w-full bg-background border pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                      errors.whatsappNumber ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                    }`}
                  />
                </div>
                {errors.whatsappNumber && (
                  <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                    {errors.whatsappNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Customer Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="shopEmail"
                  value={shopEmail}
                  onChange={(e) => handleFieldChange(setShopEmail, "shopEmail", e.target.value)}
                  className={`w-full bg-background border pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                    errors.shopEmail ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                  }`}
                />
              </div>
              {errors.shopEmail && (
                <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                  {errors.shopEmail}
                </span>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Salon Physical Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="shopAddress"
                  value={shopAddress}
                  onChange={(e) => handleFieldChange(setShopAddress, "shopAddress", e.target.value)}
                  className={`w-full bg-background border pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                    errors.shopAddress ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                  }`}
                />
              </div>
              {errors.shopAddress && (
                <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                  {errors.shopAddress}
                </span>
              )}
            </div>

            {/* Social Details */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Instagram Handle
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="instagramUsername"
                    value={instagramUsername}
                    onChange={(e) => handleFieldChange(setInstagramUsername, "instagramUsername", e.target.value)}
                    className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Facebook Page
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <Facebook className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    id="facebookUsername"
                    value={facebookUsername}
                    onChange={(e) => handleFieldChange(setFacebookUsername, "facebookUsername", e.target.value)}
                    className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Opening Hour
                </label>
                <input
                  type="text"
                  id="openTime"
                  value={openTime}
                  onChange={(e) => handleFieldChange(setOpenTime, "openTime", e.target.value)}
                  className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                    errors.openTime ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                  }`}
                />
                {errors.openTime && (
                  <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                    {errors.openTime}
                  </span>
                )}
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Closing Hour
                </label>
                <input
                  type="text"
                  id="closeTime"
                  value={closeTime}
                  onChange={(e) => handleFieldChange(setCloseTime, "closeTime", e.target.value)}
                  className={`w-full bg-background border px-4 py-2.5 rounded-full text-xs text-foreground outline-none transition-colors ${
                    errors.closeTime ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                  }`}
                />
                {errors.closeTime && (
                  <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                    {errors.closeTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-center bg-gradient-gold py-3.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
          >
            Save Details
          </button>
        </form>

        {/* Announcement banner setup */}
        <div className="glass p-6 sm:p-8 rounded-3xl shadow-elegant space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-foreground border-b border-gold/15 pb-2.5">
              Operational Alert Banner
            </h3>

            <div>
              <label className="flex items-center justify-between cursor-pointer select-none mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Display Live Notification Banner
                </span>
                <input
                  type="checkbox"
                  checked={showBanner}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setShowBanner(checked);
                    // Proactively save to avoid manual trigger mismatch
                    saveAllSettings({ showBanner: checked });
                  }}
                  className="accent-gold h-4.5 w-4.5 rounded border-gold/30"
                />
              </label>
              <p className="text-[10px] text-muted-foreground mb-4">
                Enabling this displays an active golden announcement bar at the top of the admin interface workspace.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                Banner Highlight Text
              </label>
              <textarea
                rows={3}
                id="bannerText"
                value={bannerText}
                onChange={(e) => handleFieldChange(setBannerText, "bannerText", e.target.value)}
                className={`w-full bg-background border p-4 rounded-2xl text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 font-sans ${
                  errors.bannerText ? "border-red-500 focus:border-red-500" : "border-gold/20 focus:border-gold/50"
                }`}
              />
              {errors.bannerText && (
                <span className="mt-1.5 block text-[10px] text-red-400 font-medium pl-2">
                  {errors.bannerText}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleSaveBanner}
            className="w-full text-center bg-gradient-gold py-3.5 rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
          >
            Update Live Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
