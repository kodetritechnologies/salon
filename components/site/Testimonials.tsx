"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import BasicProvider from "@/utils/BasicProvider";

interface DBTestimonial {
  _id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export function Testimonials({ initialTestimonials = [] }: { initialTestimonials?: DBTestimonial[] }) {
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>(initialTestimonials);
  const [loading, setLoading] = useState(true);
  const { getMethod } = BasicProvider();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getMethod("/api/testimonials");
        if (data && data.success) {
          setTestimonials(data.testimonials);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials dynamically:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by gentlemen <span className="text-gradient-gold">across Indore</span></>}
          description="Real reviews from our regulars."
        />

        <div className="mt-16">
          {loading ? (
            <p className="text-center text-sm font-semibold tracking-wider text-gold uppercase animate-pulse">
              Loading reviews...
            </p>
          ) : testimonials.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15 max-w-lg mx-auto">
              No customer reviews yet. Please check back later.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((r, i) => (
                <motion.div
                  key={r._id || r.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="glass relative rounded-3xl p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold"
                >
                  <Quote className="absolute right-5 top-5 h-10 w-10 text-gold/15" />
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-gold font-display text-base font-bold text-ink">
                      {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
