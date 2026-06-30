"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, Sparkles, BadgeIndianRupee } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  { Icon: Award, title: "Certified Professional Barbers", desc: "Trained stylists with years of experience in modern grooming." },
  { Icon: ShieldCheck, title: "Hygienic & Sanitized Equipment", desc: "Sterilized tools and single-use blades for every guest." },
  { Icon: Sparkles, title: "Premium Grooming Products", desc: "We use only the world's most trusted men's care brands." },
  { Icon: BadgeIndianRupee, title: "Affordable Pricing", desc: "Luxury salon experience without the luxury price tag." },
];

export function WhyChoose() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={<>The royal treatment, <span className="text-gradient-gold">every visit</span></>}
          description="Four reasons our chairs are always full."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass group relative rounded-3xl p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold shadow-gold transition-transform group-hover:scale-110">
                <it.Icon className="h-7 w-7 text-ink" strokeWidth={2} />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
