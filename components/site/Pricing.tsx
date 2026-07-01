"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import BasicProvider from "@/utils/BasicProvider";

interface DBService {
  _id?: string;
  name: string;
  price: number;
  duration: string;
  category: string;
  features?: string[];
  featured?: boolean;
}

export function Pricing({ initialServices = [] }: { initialServices?: DBService[] }) {
  const { getMethod } = BasicProvider();
  const [servicesList, setServicesList] = useState<DBService[]>(initialServices);

  useEffect(() => {
    if (initialServices && initialServices.length > 0) {
      setServicesList(initialServices);
    } else {
      const fetchServices = async () => {
        try {
          const data = await getMethod("/api/services?featured=true");
          if (data && data.success && data.services) {
            setServicesList(data.services);
          }
        } catch (err) {
          console.error("Error fetching services for pricing:", err);
        }
      };
      fetchServices();
    }
  }, [initialServices]);

  const plans = servicesList.map((s) => {
    return {
      id: s._id,
      name: s.name,
      price: s.price,
      features: s.features || []
    };
  });

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Honest pricing, <span className="text-gradient-gold">royal results</span></>}
          description="No hidden costs. Choose what fits your style."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15 animate-fade-in">
              No featured pricing packages registered yet. Please enable "Show in Pricing" for some services in the admin dashboard.
            </div>
          ) : (
            plans.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col rounded-3xl p-7 shadow-soft transition-all hover:-translate-y-1 glass hover:shadow-gold"
              >
                <h3 className="font-display text-xl font-semibold text-foreground">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-5xl font-bold text-gradient-gold">₹{p.price}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#booking"
                  onClick={() => {
                    if (p.id) {
                      window.dispatchEvent(
                        new CustomEvent("select-service", { detail: { serviceId: p.id } })
                      );
                    }
                  }}
                  className="mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] border border-gold/40 bg-foreground/5 text-foreground hover:border-gold hover:bg-gold/10"
                >
                  Book This
                </a>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
