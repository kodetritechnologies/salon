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

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    saveAllSettings({});
  };

  const handleSaveBanner = () => {
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
        <form onSubmit={handleSaveContact} className="glass p-6 sm:p-8 rounded-3xl shadow-elegant space-y-6">
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
                    value={shopPhone}
                    onChange={(e) => setShopPhone(e.target.value)}
                    className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>
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
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                  />
                </div>
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
                  value={shopEmail}
                  onChange={(e) => setShopEmail(e.target.value)}
                  className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                />
              </div>
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
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full bg-background border border-gold/20 pl-10 pr-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                />
              </div>
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
                    value={instagramUsername}
                    onChange={(e) => setInstagramUsername(e.target.value)}
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
                    value={facebookUsername}
                    onChange={(e) => setFacebookUsername(e.target.value)}
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
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Closing Hour
                </label>
                <input
                  type="text"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  className="w-full bg-background border border-gold/20 px-4 py-2.5 rounded-full text-xs text-foreground outline-none focus:border-gold/50"
                />
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
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full bg-background border border-gold/20 p-4 rounded-2xl text-xs text-foreground outline-none focus:border-gold/50 placeholder:text-muted-foreground/50 font-sans"
              />
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
