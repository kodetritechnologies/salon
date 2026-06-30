import { Scissors, Instagram, Facebook, MessageCircle, Mail, Phone } from "lucide-react";

export function Footer({ settings }: { settings?: any }) {
  const activeSettings = {
    shopPhone: settings?.shopPhone || "",
    whatsappNumber: settings?.whatsappNumber || "",
    shopEmail: settings?.shopEmail || "",
    shopAddress: settings?.shopAddress || "",
    openTime: settings?.openTime || "",
    closeTime: settings?.closeTime || "",
  };
  return (
    <footer className="relative border-t border-gold/15 pt-20">
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold shadow-gold">
                <Scissors className="h-5 w-5 text-ink" strokeWidth={2.5} />
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg font-bold text-gradient-gold">Royal Gents</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Salon</p>
              </div>
            </a>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              India's premier men's grooming destination. Crafted cuts, royal experiences — every visit.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {["Home", "About", "Gallery", "Testimonials", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-muted-foreground transition-colors hover:text-gold">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {["Hair Cut", "Beard Styling", "Hair Spa", "Facial", "Hair Coloring", "Shaving"].map((l) => (
                <li key={l}>
                  <a href="#services" className="text-muted-foreground transition-colors hover:text-gold">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-foreground">Working Hours</h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Mon — Sun · {activeSettings.openTime && activeSettings.closeTime ? `${activeSettings.openTime} – ${activeSettings.closeTime}` : "Closed / Not Set"}
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
              {activeSettings.shopPhone && (
                <a href={`tel:${activeSettings.shopPhone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-gold">
                  <Phone className="h-4 w-4" /> {activeSettings.shopPhone}
                </a>
              )}
              {activeSettings.whatsappNumber && (
                <a href={`https://wa.me/${activeSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 hover:text-gold">
                  <MessageCircle className="h-4 w-4" /> {activeSettings.whatsappNumber}
                </a>
              )}
              {activeSettings.shopEmail && (
                <a href={`mailto:${activeSettings.shopEmail}`} className="flex items-center gap-2 hover:text-gold">
                  <Mail className="h-4 w-4" /> {activeSettings.shopEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold/15 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Royal Gents Salon {activeSettings.shopAddress ? `· ${activeSettings.shopAddress}` : ""}. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a href="#" className="font-medium text-foreground transition-colors hover:text-gold">
              Kodetri Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
