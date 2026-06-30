"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const items = [
  { src: g1.src, span: "row-span-2", alt: "Modern Indian salon interior with gold LED mirrors" },
  { src: g2.src, span: "", alt: "Customer with fresh haircut and styled beard" },
  { src: g3.src, span: "", alt: "Premium barber tools — scissors and razor" },
  { src: g4.src, span: "row-span-2", alt: "Hot-towel shave in luxury barber chair" },
  { src: g5.src, span: "", alt: "Relaxing head massage with oil" },
  { src: g6.src, span: "", alt: "Wide view of premium Indian salon" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Gallery"
          title={<>Step inside the <span className="text-gradient-gold">Royal experience</span></>}
          description="Modern interiors, sharp cuts, and the artistry of true barbers."
        />

        <div className="mt-16 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`group relative overflow-hidden rounded-2xl shadow-soft ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs uppercase tracking-[0.25em] text-gold">Royal Gents</p>
                <p className="mt-1 text-sm font-medium text-foreground">{it.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
