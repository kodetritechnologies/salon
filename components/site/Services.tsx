"use client";

import { motion } from "framer-motion";
import { ChevronRight, ImageOff } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface DBService {
  _id?: string;
  name: string;
  price: number;
  duration: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
}

export function Services({ initialServices = [] }: { initialServices?: DBService[] }) {
  const finalServices = initialServices.map(s => ({
    id: s._id,
    name: s.name,
    price: `₹${s.price}`,
    desc: `${s.category} treatment - duration ${s.duration}`,
    img: s.imageUrl || null
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
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-ink/40 flex flex-col items-center justify-center border border-gold/10 p-5 text-center transition-all duration-700 group-hover:scale-105">
                      <ImageOff className="h-8 w-8 text-gold/60 mb-2" />
                      <span className="text-xs uppercase tracking-widest text-gold font-semibold">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent pointer-events-none" />
                  <span className="absolute right-3 top-3 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-ink shadow-gold z-10">
                    from {s.price}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-foreground">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <a
                    href="#booking"
                    onClick={() => {
                      if (s.id) {
                        window.dispatchEvent(
                          new CustomEvent("select-service", { detail: { serviceId: s.id } })
                        );
                      }
                    }}
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
