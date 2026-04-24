"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const STORAGE_KEY = "trust_cookie_consent";

export default function CookieBanner() {
  const [show, setShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem(STORAGE_KEY);
  });

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-white/10 px-4 py-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <p className="font-sans text-sm text-white/70 max-w-2xl leading-relaxed">
              We use cookies to improve your experience and analyse site usage.
              By clicking &ldquo;Accept&rdquo; you consent to our use of cookies.{" "}
              <a href="#" className="text-brand-amber underline underline-offset-2 hover:text-amber-400">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={decline}
                className="font-sans text-sm text-white/50 hover:text-white transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="font-sans text-sm font-medium bg-brand-amber text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={decline}
                aria-label="Close cookie banner"
                className="p-1 text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
