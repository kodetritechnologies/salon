"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import b1 from "@/assets/barber-1.jpg";
import b2 from "@/assets/barber-2.jpg";
import b3 from "@/assets/barber-3.jpg";
import b4 from "@/assets/barber-4.jpg";

const avatars = [b1.src, b2.src, b3.src, b4.src];

export function Team({ initialStaff = [] }: { initialStaff?: any[] }) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Meet Our Barbers"
          title={<>The hands behind the <span className="text-gradient-gold">artistry</span></>}
          description="Skilled, certified, and obsessed with details."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {initialStaff.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15">
              No stylists registered yet. Please add them from the admin dashboard.
            </div>
          ) : (
            initialStaff.map((m, i) => {
              const isAvailable = m.status === "Available";
              const isOnBreak = m.status === "On Break";

              return (
                <motion.div
                  key={m._id || m.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`group glass overflow-hidden rounded-3xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold ${!isAvailable ? "opacity-75" : ""
                    }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {m.imageUrl ? (
                      <img
                        src={m.imageUrl}
                        alt={m.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-ink/40 flex flex-col items-center justify-center border border-gold/10 p-5 text-center transition-all duration-700 group-hover:scale-105">
                        <div className="h-20 w-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center font-display text-3xl font-bold text-gold shadow-gold mb-3">
                          {m.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span className="text-xs uppercase tracking-widest text-gold font-semibold">{m.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border ${isAvailable
                            ? "bg-emerald-500/80 text-foreground border-emerald-400/30"
                            : isOnBreak
                              ? "bg-amber-500/80 text-foreground border-amber-400/30"
                              : "bg-red-500/80 text-foreground border-red-400/30"
                          }`}
                      >
                        {m.status}
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="flex items-center gap-1 text-gold">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-xs font-semibold text-white">{m.rating}</span>
                        <span className="text-xs text-white/70">· {m.experience}</span>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-semibold text-white">{m.name}</h3>
                      <p className="text-xs text-white/70">{m.role}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    {isAvailable ? (
                      <a
                        href="#booking"
                        onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("select-barber", { detail: { barberId: m._id } })
                          );
                        }}
                        className="block rounded-full border border-gold/30 bg-foreground/5 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:border-gold hover:bg-gold/10 cursor-pointer"
                      >
                        Book with {m.name.split(" ")[0]}
                      </a>
                    ) : (
                      <span
                        className="block rounded-full border border-white/5 bg-white/5 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 cursor-not-allowed"
                      >
                        Unavailable
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
