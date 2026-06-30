"use client";

import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const plans = [
  { name: "Classic Haircut", price: 199, features: ["Precision haircut", "Hair wash", "Quick blow dry"] },
  { name: "Premium Haircut", price: 299, features: ["Premium scissor cut", "Hair wash & conditioner", "Styling with product"], popular: true },
  { name: "Haircut + Beard", price: 399, features: ["Haircut", "Beard shaping", "Hot towel finish"] },
  { name: "Luxury Grooming", price: 699, features: ["Haircut + Beard", "Facial cleanup", "Head massage", "Hair spa add-on"] },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Honest pricing, <span className="text-gradient-gold">royal results</span></>}
          description="No hidden costs. Choose what fits your style."
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-3xl p-7 shadow-soft transition-all hover:-translate-y-1 ${
                p.popular
                  ? "glass-strong shadow-gold ring-1 ring-gold/40"
                  : "glass hover:shadow-gold"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink shadow-gold">
                  <Crown className="h-3 w-3" /> Most Popular
                </span>
              )}
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
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] ${
                  p.popular
                    ? "bg-gradient-gold text-ink shadow-gold"
                    : "border border-gold/40 bg-foreground/5 text-foreground hover:border-gold hover:bg-gold/10"
                }`}
              >
                Book This
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
