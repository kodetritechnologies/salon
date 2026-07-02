"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, Sun, Moon, User } from "lucide-react";
import Cookies from "js-cookie";
import ProfileModal from "./ProfileModal";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Navbar({ themeSetting = "dark" }: { themeSetting?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<string>("dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("customerToken");
    setTimeout(() => {
      setIsLoggedIn(!!token);
    }, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const classList = document.documentElement.classList;
    let activeTheme = themeSetting;
    
    if (classList.contains("light")) {
      activeTheme = "light";
    } else if (classList.contains("theme-blue")) {
      activeTheme = "theme-blue";
    } else if (classList.contains("theme-green")) {
      activeTheme = "theme-green";
    }
    
    const pref = localStorage.getItem("theme_preference");
    if (pref === "light") {
      activeTheme = "light";
    } else if (pref === "brand") {
      activeTheme = themeSetting;
    }

    setTimeout(() => {
      setTheme(activeTheme || "dark");
    }, 0);
  }, [themeSetting]);

  const toggleTheme = () => {
    let nextTheme = "light";
    let pref = "light";
    if (theme === "light") {
      nextTheme = themeSetting === "light" ? "dark" : themeSetting;
      pref = "brand";
    } else {
      nextTheme = "light";
      pref = "light";
    }
    
    setTheme(nextTheme);
    localStorage.setItem("theme_preference", pref);
    
    document.documentElement.classList.remove("light", "theme-blue", "theme-green");
    if (nextTheme !== "dark") {
      document.documentElement.classList.add(nextTheme);
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-500 sm:px-6 ${
            scrolled ? "glass-strong shadow-elegant" : "glass"
          }`}
        >
          <a href="#home" className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Scissors className="h-5 w-5 text-ink" strokeWidth={2.5} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-lg font-bold tracking-wide text-gradient-gold">
                Royal Gents
              </span>
              <span className="block truncate text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Salon
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className={`grid h-10 w-10 place-items-center rounded-full border transition-colors cursor-pointer ${
                isLoggedIn
                  ? "border-gold bg-gold/15 text-gold hover:bg-gold/25"
                  : "border-gold/30 text-gold hover:bg-gold/10"
              }`}
              aria-label="User Profile"
              title={isLoggedIn ? "My Profile" : "Client Log In"}
            >
              <User className="h-5 w-5" />
            </button>
            <a
              href="#booking"
              className="hidden rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-ink shadow-gold transition-transform hover:scale-105 sm:inline-flex"
            >
              Book Now
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold lg:hidden animate-fade-in"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 lg:hidden"
            >
              <div className="glass-strong flex flex-col gap-1 rounded-2xl p-3 shadow-elegant">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-gold/10 hover:text-gold"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#booking"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-xl bg-gradient-gold px-4 py-3 text-center text-sm font-semibold text-ink shadow-gold"
                >
                  Book Now
                </a>
                <button
                  onClick={() => {
                    setOpen(false);
                    setProfileOpen(true);
                  }}
                  className={`mt-1 rounded-xl border px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider cursor-pointer ${
                    isLoggedIn
                      ? "border-gold bg-gold/15 text-gold hover:bg-gold/25"
                      : "border-gold/30 text-gold hover:bg-gold/10"
                  }`}
                >
                  {isLoggedIn ? "My Profile" : "Client Log In"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onLoginStatusChange={setIsLoggedIn}
      />
    </motion.header>
  );
}
