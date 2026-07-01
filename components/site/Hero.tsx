"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles, ChevronRight, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";

interface HeroProps {
  settings?: any;
  services?: any[];
}

export function Hero({ settings, services = [] }: HeroProps) {
  const openTime = settings?.openTime || "";
  const closeTime = settings?.closeTime || "";

  const activeMenu = services.slice(0, 4).map(s => ({ k: s.name, v: `₹${s.price}` }));

  return (
    <section id="home" className="relative isolate min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-0 -z-10">
        <img
          src={hero.src}
          alt="Indian barber trimming a customer's beard in a luxurious modern salon"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/65 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-12 sm:px-6 md:pt-20 lg:grid-cols-12 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Indore's Premier Men's Salon
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            India's Premium
            <br />
            <span className="text-gradient-gold">Men's Grooming</span>
            <br />
            Experience
          </h1>

          <p className="mt-6 max-w-xl text-base text-foreground/80 sm:text-lg">
            Professional Haircuts, Beard Styling, Facials & Grooming Services by Expert Barbers — crafted in a luxurious atmosphere you'll want to return to.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#booking"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-ink shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-foreground/5 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-gold hover:bg-gold/10"
            >
              View Services
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-gold to-bronze"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
                <span className="ml-1 text-sm font-semibold text-foreground">4.9</span>
              </div>
              <p className="text-xs text-muted-foreground">Trusted by 5,000+ happy clients</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:col-span-5 lg:block"
        >
          <div className="glass-strong mt-10 rounded-3xl p-6 shadow-elegant">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Today's Hours</p>
            <p className="mt-2 font-display text-2xl text-foreground">
              {openTime && closeTime ? `${openTime} — ${closeTime}` : "Closed / Not Set"}
            </p>
            <div className="my-4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            
            {activeMenu.length === 0 ? (
              <p className="text-xs text-muted-foreground/70 italic py-6 text-center">
                No services registered yet.
              </p>
            ) : (
              <ul className="space-y-3 text-sm">
                {activeMenu.map((row) => (
                  <li key={row.k} className="flex items-center justify-between">
                    <span className="text-foreground/80">{row.k}</span>
                    <span className="font-semibold text-gold">{row.v}</span>
                  </li>
                ))}
              </ul>
            )}

            <a
              href="#pricing"
              className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold hover:text-gold-bright"
            >
              See full menu <ChevronRight className="h-3 w-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
