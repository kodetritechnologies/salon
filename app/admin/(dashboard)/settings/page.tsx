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
import toast from "react-hot-toast";

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
  const [theme, setTheme] = useState("dark");
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
          setTheme(s.theme || "dark");
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
        theme,
        ...updatedFields,
      };

      const data = await postMethod("/api/settings", payload);
      if (data && data.success) {
        toast.success("Settings updated successfully.");
      } else {
        toast.error(data.message || "Could not update settings.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
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

      {/* Website Appearance Config */}
      <div className="glass p-6 sm:p-8 rounded-3xl shadow-elegant space-y-6">
        <div>
          <h3 className="font-display text-lg font-bold text-foreground border-b border-gold/15 pb-2.5">
            Website Theme & Brand Appearance
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            Select the default color theme for your premium barber salon website. This will set the primary visual identity for all visiting customers.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {[
            {
              id: "dark",
              name: "Royal Dark",
              desc: "Signature gold & rich warm dark colors",
              bg: "bg-[oklch(0.13_0.012_60)]",
              cardBg: "bg-[oklch(0.17_0.014_60)]",
              textColor: "text-[oklch(0.97_0.012_85)]",
              accentColor: "bg-[oklch(0.82_0.14_85)]",
            },
            {
              id: "light",
              name: "Elegant Cream",
              desc: "Polished ivory, warm beige & gold accents",
              bg: "bg-[oklch(0.98_0.006_70)]",
              cardBg: "bg-[oklch(0.95_0.01_70)]",
              textColor: "text-[oklch(0.16_0.012_60)]",
              accentColor: "bg-[oklch(0.65_0.13_75)]",
            },
            {
              id: "theme-blue",
              name: "Midnight Sapphire",
              desc: "Deep sapphire blue & gold branding",
              bg: "bg-[oklch(0.12_0.03_240)]",
              cardBg: "bg-[oklch(0.16_0.04_240)]",
              textColor: "text-[oklch(0.97_0.012_85)]",
              accentColor: "bg-[oklch(0.82_0.14_85)]",
            },
            {
              id: "theme-green",
              name: "Emerald Forest",
              desc: "Rich forest green & gold accents",
              bg: "bg-[oklch(0.12_0.03_150)]",
              cardBg: "bg-[oklch(0.16_0.04_150)]",
              textColor: "text-[oklch(0.97_0.012_85)]",
              accentColor: "bg-[oklch(0.82_0.14_85)]",
            },
          ].map((themeOpt) => {
            const isSelected = theme === themeOpt.id;
            return (
              <div
                key={themeOpt.id}
                onClick={() => setTheme(themeOpt.id)}
                className={`relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all border-2 duration-300 hover:scale-[1.02] ${
                  isSelected
                    ? "border-gold bg-gold/10 shadow-gold"
                    : "border-gold/10 hover:border-gold/30 bg-card/40"
                }`}
              >
                {/* Small Theme Preview Mockup */}
                <div className={`w-full h-24 rounded-lg p-2.5 flex flex-col justify-between mb-4 border border-gold/15 overflow-hidden ${themeOpt.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-bold tracking-wider ${themeOpt.textColor}`}>ROYAL SALON</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className={`p-2 rounded-md ${themeOpt.cardBg} border border-gold/5 flex flex-col gap-1`}>
                    <div className={`h-1.5 w-12 rounded-full ${themeOpt.accentColor}`} />
                    <div className="h-1 w-8 rounded-full bg-white/20" />
                  </div>
                  <div className="flex justify-end">
                    <div className={`px-2 py-0.5 rounded-full text-[6px] font-bold text-black ${themeOpt.accentColor}`}>
                      Book
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {themeOpt.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal animate-fade-in">
                    {themeOpt.desc}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 bg-gradient-gold h-4 w-4 rounded-full flex items-center justify-center border border-ink shadow-sm animate-scale-up">
                    <svg
                      className="h-2.5 w-2.5 text-ink"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={4}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-gold/15 pt-4">
          <button
            onClick={() => saveAllSettings({ theme })}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-gold rounded-full text-xs font-bold text-ink shadow-gold hover:scale-[1.01] transition-transform cursor-pointer"
          >
            Apply & Save Theme
          </button>
        </div>
      </div>
    </div>
  );
}
