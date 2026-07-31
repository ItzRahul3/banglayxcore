"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Blocks } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { SiteSettings } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/vote", label: "Vote" },
  { href: "/ranks", label: "Ranks" },
  { href: "/rules", label: "Rules" },
  { href: "/staff", label: "Staff" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-void/85 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-panel border border-ore/40 shadow-ore slot-notch-sm group-hover:animate-pulse-ring">
            <Blocks className="h-5 w-5 text-ore" strokeWidth={2.5} />
          </span>
          <span className="font-pixel text-[10px] leading-none text-ink text-pixel-shadow sm:text-xs">
            {settings.server_name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-ore" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-ore"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={settings.discord_invite}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-sm border border-ore/40 bg-ore/10 px-4 py-2 text-sm font-semibold text-ore transition hover:bg-ore/20 sm:inline-block"
          >
            Discord
          </a>
          <button
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-void/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-sm px-3 py-2 text-sm font-medium ${
                    pathname === link.href ? "bg-panel text-ore" : "text-ink-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={settings.discord_invite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 rounded-sm border border-ore/40 bg-ore/10 px-3 py-2 text-center text-sm font-semibold text-ore"
              >
                Join Discord
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
