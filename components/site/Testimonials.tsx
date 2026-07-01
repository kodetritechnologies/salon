"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const activeIndex = Math.min(currentIndex, maxIndex);

  const [isPaused, setIsPaused] = useState(false);
  const [isForward, setIsForward] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);

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
                  {testimonials.map((r) => (
                    <div
                      key={r._id || r.name}
                      className="w-full md:w-1/2 lg:w-1/3 p-3 flex-shrink-0 select-none"
                    >
                      <div className="glass relative rounded-3xl p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-gold h-full flex flex-col justify-between">
                        <div>
                          <Quote className="absolute right-5 top-5 h-10 w-10 text-gold/15" />
                          <div className="flex items-center gap-1 text-gold">
                            {Array.from({ length: r.rating }).map((_, k) => (
                              <Star key={k} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                          <p className="mt-4 text-sm leading-relaxed text-foreground/90">&ldquo;{r.text}&rdquo;</p>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-gold font-display text-base font-bold text-ink flex-shrink-0">
                            {r.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={next}
                      disabled={activeIndex === maxIndex}
                      className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-card/50 text-foreground transition-all hover:border-gold hover:bg-gradient-gold hover:text-ink disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      aria-label="Next testimonial"
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

