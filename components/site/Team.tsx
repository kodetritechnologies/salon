"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

interface DBStaff {
  _id?: string;
  name: string;
  role: string;
  imageUrl?: string;
  status: string;
  rating: number;
  experience: string;
}

export function Team({ initialStaff = [] }: { initialStaff?: DBStaff[] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isForward, setIsForward] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, initialStaff.length - visibleCount);
  const activeIndex = Math.min(currentIndex, maxIndex);

  const activeIndexRef = useRef(activeIndex);
  const isForwardRef = useRef(isForward);

  // Sync refs with the latest state values
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isForwardRef.current = isForward;
  }, [isForward]);

  useEffect(() => {
    if (maxIndex === 0 || isPaused) return;

    const interval = setInterval(() => {
      const currentActive = activeIndexRef.current;
      const currentForward = isForwardRef.current;

      if (currentForward) {
        if (currentActive >= maxIndex) {
          setIsForward(false);
          setCurrentIndex(Math.max(0, maxIndex - 1));
        } else {
          setCurrentIndex(currentActive + 1);
        }
      } else {
        if (currentActive <= 0) {
          setIsForward(true);
          setCurrentIndex(Math.min(1, maxIndex));
        } else {
          setCurrentIndex(currentActive - 1);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, isPaused, resetTrigger]);

  const next = () => {
    setResetTrigger((t) => t + 1);
    setIsForward(true);
    setCurrentIndex(() => Math.min(activeIndex + 1, maxIndex));
  };

  const prev = () => {
    setResetTrigger((t) => t + 1);
    setIsForward(false);
    setCurrentIndex(() => Math.max(activeIndex - 1, 0));
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Meet Our Barbers"
          title={<>The hands behind the <span className="text-gradient-gold">artistry</span></>}
          description="Skilled, certified, and obsessed with details."
        />

        <div className="mt-16">
          {initialStaff.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground font-semibold glass rounded-3xl border border-gold/15">
              No stylists registered yet. Please add them from the admin dashboard.
            </div>
          ) : (
            <div className="relative">
              <div
                className="relative w-full overflow-hidden px-1 py-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              >
                <motion.div
                  className="flex cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragStart={() => setIsPaused(true)}
                  onDragEnd={(e, info) => {
                    setIsPaused(false);
                    setResetTrigger((t) => t + 1);
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      next();
                    } else if (info.offset.x > swipeThreshold) {
                      prev();
                    }
                  }}
                  animate={{ x: `-${activeIndex * (100 / visibleCount)}%` }}
                  transition={{ type: "spring", stiffness: 150, damping: 22 }}
                >
                  {initialStaff.map((m) => {
                    const isAvailable = m.status === "Available";
                    const isOnBreak = m.status === "On Break";

                    return (
                      <div
                        key={m._id || m.name}
                        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-3 flex-shrink-0 select-none"
                      >
                        <div
                          className={`group glass overflow-hidden rounded-3xl shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold h-full flex flex-col justify-between ${
                            !isAvailable ? "opacity-75" : ""
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
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                                  isAvailable
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
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {maxIndex > 0 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-3">
                  <div className="flex gap-2 order-2 sm:order-1">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setResetTrigger((t) => t + 1);
                          if (idx > activeIndex) {
                            setIsForward(true);
                          } else if (idx < activeIndex) {
                            setIsForward(false);
                          }
                          setCurrentIndex(idx);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex
                            ? "w-8 bg-gradient-gold"
                            : "w-2.5 bg-gold/20 hover:bg-gold/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-3 order-1 sm:order-2">
                    <button
                      onClick={prev}
                      disabled={activeIndex === 0}
                      className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-card/50 text-foreground transition-all hover:border-gold hover:bg-gradient-gold hover:text-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Previous team member"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      disabled={activeIndex === maxIndex}
                      className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-card/50 text-foreground transition-all hover:border-gold hover:bg-gradient-gold hover:text-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Next team member"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
