"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onOpenModal?: () => void;
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Savings Calculator", href: "#calculator" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#testimonials" },
];

export default function Navigation({ onOpenModal }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 100);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex flex-col leading-none group"
            aria-label="Trust Electric Heating — home"
          >
            <span
              className={cn(
                "font-sans font-black text-[1.7rem] leading-none tracking-tight transition-colors duration-300",
                scrolled
                  ? "text-brand-amber"
                  : "text-white"
              )}
            >
              trust<sup className="text-[0.45em] align-super ml-px font-medium">®</sup>
            </span>
            <span
              className={cn(
                "font-sans text-[10px] leading-none mt-0.5 transition-colors duration-300",
                scrolled ? "text-slate-500" : "text-white/60"
              )}
            >
              Electric Heating
            </span>
          </a>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="font-sans text-sm text-slate-600 hover:text-brand-amber transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onOpenModal}
              size="sm"
              className="hidden md:inline-flex"
            >
              Get Free Quote
            </Button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-brand-dark hover:bg-slate-100 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Amber scroll-progress bar */}
      {scrolled && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-brand-amber transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/98 backdrop-blur-md border-t border-slate-100 shadow-lg"
          >
            <nav className="px-4 py-5 flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left font-sans text-base text-slate-700 hover:text-brand-amber py-3 border-b border-slate-50 last:border-0 transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => { onOpenModal?.(); setMobileOpen(false); }}
                className="w-full mt-4"
                size="lg"
              >
                Get Free Quote
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
