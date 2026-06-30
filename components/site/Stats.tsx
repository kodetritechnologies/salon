"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 10, suffix: "+", label: "Professional Barbers" },
  { value: 5000, suffix: "+", label: "Happy Clients" },
  { value: 15000, suffix: "+", label: "Haircuts Completed" },
  { value: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const formatted = decimals
    ? n.toFixed(decimals)
    : Math.floor(n).toLocaleString("en-IN");

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-strong rounded-3xl px-6 py-12 shadow-elegant sm:px-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-5xl font-bold text-gradient-gold sm:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
