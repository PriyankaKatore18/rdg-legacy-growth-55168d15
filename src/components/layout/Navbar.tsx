import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ChevronDown, Globe, Menu, Search, UserPlus, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { company, navigation } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="hidden bg-primary-dark text-[13px] text-primary-foreground/90 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p>Direct Selling • Ayurveda, Wellness, Agriculture & Lifestyle</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-gold">
              {company.phone}
            </a>
            <span className="opacity-40">|</span>
            <a href={`mailto:${company.email}`} className="hover:text-gold">
              {company.email}
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "glass shadow-soft" : "bg-background/40 backdrop-blur-sm",
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-3 py-2 sm:h-18 sm:gap-4">
          <a href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              src={logo}
              alt="RDG Future Way logo"
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-base font-bold text-primary-dark sm:text-lg">
                RDG Future Way
              </span>
              <span className="block text-[10px] tracking-[0.16em] text-muted-foreground uppercase sm:text-[11px] sm:tracking-[0.18em]">
                Pvt. Ltd.
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setMenu(null)}>
            {navigation.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => setMenu(item.label)}>
                <a
                  href={item.to}
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </a>
                <AnimatePresence>
                  {item.children && menu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3"
                    >
                      <div className="glass overflow-hidden rounded-2xl p-2 shadow-card">
                        {item.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.to}
                            className="block rounded-xl px-4 py-3 transition-colors hover:bg-accent"
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {child.label}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {child.desc}
                            </span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary md:flex"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              aria-label="Switch language"
              className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-primary md:flex"
            >
              <Globe className="h-4 w-4" /> EN
            </button>
            <a
              href="/become-distributor"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent xl:block"
            >
              Login
            </a>
            <a
              href="/become-distributor"
              className="bg-brand hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5 sm:flex"
            >
              <UserPlus className="h-4 w-4" /> Become Distributor
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden lg:hidden"
          >
            <div className="container-x max-h-[70vh] space-y-1 overflow-y-auto py-4">
              {navigation.map((item) => (
                <div key={item.label}>
                  <a
                    href={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 font-display font-semibold text-foreground"
                  >
                    {item.label}
                  </a>
                  {item.children?.map((child) => (
                    <a
                      key={child.label}
                      href={child.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-6 py-2 text-sm text-muted-foreground"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ))}
              <a
                href="/become-distributor"
                onClick={() => setOpen(false)}
                className="bg-brand mt-3 block rounded-full px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Become a Distributor
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
