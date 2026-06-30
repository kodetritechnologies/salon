"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function Contact({ settings }: { settings?: any }) {
  const activeSettings = {
    shopPhone: settings?.shopPhone || "",
    whatsappNumber: settings?.whatsappNumber || "",
    shopEmail: settings?.shopEmail || "",
    shopAddress: settings?.shopAddress || "",
    openTime: settings?.openTime || "",
    closeTime: settings?.closeTime || "",
    instagramUsername: settings?.instagramUsername || "",
    facebookUsername: settings?.facebookUsername || "",
  };

  const items = [
    {
      Icon: Phone,
      label: "Phone",
      value: activeSettings.shopPhone || "Not set",
      href: activeSettings.shopPhone ? `tel:${activeSettings.shopPhone.replace(/\s+/g, "")}` : "#",
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: activeSettings.whatsappNumber || "Not set",
      href: activeSettings.whatsappNumber ? `https://wa.me/${activeSettings.whatsappNumber.replace(/[^0-9]/g, "")}` : "#",
    },
    {
      Icon: Mail,
      label: "Email",
      value: activeSettings.shopEmail || "Not set",
      href: activeSettings.shopEmail ? `mailto:${activeSettings.shopEmail}` : "#",
    },
    {
      Icon: Instagram,
      label: "Instagram",
      value: activeSettings.instagramUsername || "Not set",
      href: activeSettings.instagramUsername
        ? (activeSettings.instagramUsername.startsWith("http")
          ? activeSettings.instagramUsername
          : `https://instagram.com/${activeSettings.instagramUsername.replace("@", "")}`)
        : "#",
    },
    {
      Icon: Facebook,
      label: "Facebook",
      value: activeSettings.facebookUsername || "Not set",
      href: activeSettings.facebookUsername
        ? (activeSettings.facebookUsername.startsWith("http")
          ? activeSettings.facebookUsername
          : `https://facebook.com/${activeSettings.facebookUsername}`)
        : "#",
    },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Visit Us"
          title={<>Drop by, or <span className="text-gradient-gold">drop us a line</span></>}
          description="We're right in the heart of Indore. Walk-ins welcome, bookings preferred."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 lg:col-span-2"
          >
            <div className="glass rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                  <MapPin className="h-5 w-5 text-ink" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-gold">Address</p>
                  <p className="mt-1 font-display text-lg text-foreground">Royal Gents Salon</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {activeSettings.shopAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 shadow-soft">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                  <Clock className="h-5 w-5 text-ink" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold">Business Hours</p>
                  <p className="mt-1 font-display text-lg text-foreground">Monday — Sunday</p>
                  <p className="text-sm text-muted-foreground">{activeSettings.openTime} – {activeSettings.closeTime}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 shadow-soft">
              <p className="text-xs uppercase tracking-widest text-gold">Get in touch</p>
              <ul className="mt-4 space-y-3">
                {items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gold/10"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                        <it.Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{it.label}</p>
                        <p className="truncate text-sm font-medium text-foreground">{it.value}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass overflow-hidden rounded-3xl shadow-elegant">
              <iframe
                title="Royal Gents Salon Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(activeSettings.shopAddress)}&output=embed`}
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
