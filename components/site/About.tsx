"use client";

import { motion } from "framer-motion";
import { Award, Users, Scissors, Sparkles } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import about from "@/assets/gallery-1.jpg";

const highlights = [
  { Icon: Award, label: "10+ Years Experience" },
  { Icon: Users, label: "5000+ Happy Customers" },
  { Icon: Scissors, label: "Professional Stylists" },
  { Icon: Sparkles, label: "Modern Equipment" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] shadow-elegant">
            <img
              src={about.src}
              alt="Royal Gents Salon interior"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="glass-strong absolute -bottom-6 -right-4 rounded-2xl px-5 py-4 shadow-gold sm:right-10">
            <p className="font-display text-3xl font-bold text-gradient-gold">10+</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Years of Craft</p>
          </div>
        </motion.div>

        <div>
          <SectionHeading
            align="left"
            eyebrow="About Us"
            title={<>A decade of <span className="text-gradient-gold">refined grooming</span></>}
            description="Royal Gents Salon began with a simple belief: every man deserves a grooming experience that feels worthy of his story. From a chair in Indore to one of the city's most loved premium salons, we've stayed obsessed with three things — craft, hygiene, and hospitality."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                  <h.Icon className="h-5 w-5 text-ink" />
                </span>
                <span className="text-sm font-medium text-foreground">{h.label}</span>
              </motion.div>
            ))}
          </div>

          <a
            href="#booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-semibold text-ink shadow-gold transition-transform hover:scale-[1.03]"
          >
            Experience It Yourself
          </a>
        </div>
      </div>
    </section>
  );
}
