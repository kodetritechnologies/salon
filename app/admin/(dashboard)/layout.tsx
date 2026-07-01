"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  Sparkles,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Info,
  MessageSquare
} from "lucide-react";
import Cookies from "js-cookie";
import BasicProvider from "@/utils/BasicProvider";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { getMethod } = BasicProvider();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      try {
        const data = await getMethod("/api/auth/me");
        if (data && data.success) {
          setAdminUser(data.admin);
          setCheckingAuth(false);
        } else {
          Cookies.remove("adminToken");
          router.push("/admin/login");
        }
      } catch (err) {
        Cookies.remove("adminToken");
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getMethod("/api/settings");
        if (data && data.success) {
          setShowBanner(data.settings.showBanner);
          setBannerText(data.settings.bannerText);
        }
      } catch (err) {
        console.error("Failed to load settings in layout", err);
      }
    };
    fetchSettings();
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("adminToken");
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/admin/services", label: "Services", icon: Sparkles },
    { href: "/admin/staff", label: "Staff Crew", icon: Users },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <Scissors className="h-10 w-10 text-gold animate-bounce mb-4" />
        <p className="text-sm font-semibold tracking-widest text-gold uppercase">Loading Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground flex flex-col lg:flex-row relative">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-r border-gold/15 bg-card/65 backdrop-blur-md p-6 justify-between z-30">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Scissors className="h-5 w-5 text-ink" strokeWidth={2.5} />
            </span>
            <div className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wide text-gradient-gold">
                Royal Gents
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Salon Admin
              </span>
            </div>
          </div>

          <div className="glass p-4 rounded-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold/25 border border-gold/40 flex items-center justify-center font-bold text-gold shrink-0">
              {adminUser?.name[0] || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{adminUser?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{adminUser?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href) && pathname !== "/admin/login";
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${isActive
                    ? "bg-gradient-gold text-ink shadow-gold"
                    : "text-muted-foreground hover:text-gold hover:bg-gold/10"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-destructive-foreground hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Logout Console</span>
        </button>
      </aside>

      <header className="lg:hidden flex items-center justify-between border-b border-gold/15 bg-card/70 backdrop-blur-md px-6 py-4 z-40">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <Scissors className="h-4 w-4 text-ink" strokeWidth={2.5} />
          </span>
          <div>
            <span className="block font-display text-sm font-bold tracking-wide text-gradient-gold">
              Royal Gents
            </span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-card border-l border-gold/20 p-6 flex flex-col justify-between z-50 lg:hidden"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <span className="font-display font-bold text-gradient-gold text-lg">Salon Admin Menu</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-gold"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="glass p-4 rounded-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gold/25 border border-gold/40 flex items-center justify-center font-bold text-gold shrink-0">
                    {adminUser?.name[0] || "A"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{adminUser?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{adminUser?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href) && pathname !== "/admin/login";
                    return (
                      <button
                        key={item.href}
                        onClick={() => {
                          router.push(item.href);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${isActive
                          ? "bg-gradient-gold text-ink shadow-gold"
                          : "text-muted-foreground hover:text-gold hover:bg-gold/10"
                          }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-destructive-foreground hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Logout Console</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full flex flex-col gap-8">
        {showBanner && bannerText && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-gold p-4 text-ink font-semibold flex items-center justify-between shadow-gold shrink-0">
            <div className="flex items-center gap-2 pr-8">
              <Info className="h-4.5 w-4.5 shrink-0" />
              <p className="text-xs sm:text-sm tracking-wide leading-snug">
                {bannerText}
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink hover:scale-110 transition-transform"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
