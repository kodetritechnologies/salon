"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import haircut from "@/assets/service-haircut.jpg";
import beard from "@/assets/service-beard.jpg";
import spa from "@/assets/service-spa.jpg";
import facial from "@/assets/service-facial.jpg";
import color from "@/assets/service-color.jpg";
import massage from "@/assets/service-massage.jpg";
import kids from "@/assets/service-kids.jpg";

interface DBService {
  _id?: string;
  name: string;
  price: number;
  duration: string;
  category: string;
}

export function Services({ initialServices = [] }: { initialServices?: DBService[] }) {
  const finalServices = initialServices.map(s => ({
    name: s.name,
    price: `₹${s.price}`,
    desc: `${s.category} treatment - duration ${s.duration}`,
    img: s.name.toLowerCase().includes("cut") ? haircut.src 
       : s.name.toLowerCase().includes("beard") ? beard.src
       : s.name.toLowerCase().includes("spa") ? spa.src
       : s.name.toLowerCase().includes("facial") ? facial.src
       : s.name.toLowerCase().includes("color") ? color.src
       : s.name.toLowerCase().includes("massage") ? massage.src
       : kids.src
  }));

  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Our Services"
          title={<>Crafted with care, <span className="text-gradient-gold">styled to perfection</span></>}
          description="From signature haircuts to indulgent grooming rituals, every service is delivered by certified Indian barbers using premium products."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {finalServices.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15">
              No services registered yet. Please add them from the admin dashboard.
            </div>
          ) : (
            finalServices.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group glass overflow-hidden rounded-3xl shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-gold"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-ink shadow-gold">
                    from {s.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <a
                    href="#booking"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-bright"
                  >
                    Book Now <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
