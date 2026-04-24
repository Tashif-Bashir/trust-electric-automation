"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  onOpenModal?: () => void;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const labelVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.3, ease: "easeOut" as const },
  },
};

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-brand-amber" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function DecorativeSVG() {
  return (
    <svg
      className="absolute bottom-0 right-0 w-[480px] h-[480px] text-brand-amber opacity-[0.07] pointer-events-none"
      viewBox="0 0 400 400"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="300" cy="300" r="180" />
      <circle cx="340" cy="200" r="90" />
      <rect x="180" y="280" width="120" height="120" rx="20" transform="rotate(20 240 340)" />
      <circle cx="200" cy="360" r="50" />
    </svg>
  );
}

export default function Hero({ onOpenModal }: HeroProps) {
  const scrollToCalculator = () => {
    document.querySelector("#calculator")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-cream via-white to-white pt-20"
    >
      <DecorativeSVG />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left column ────────────────────────────────────── */}
          <motion.div
            className="flex-1 flex flex-col gap-6 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Label */}
            <motion.p
              variants={labelVariants}
              className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber"
            >
              Premium Electric Heating
            </motion.p>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl text-brand-dark leading-[1.1] text-balance"
            >
              Heat Your Home Smarter.{" "}
              <span className="text-brand-amber">Save Up to 40%</span> on Energy Bills.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="font-sans text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              The NEOS radiator uses patented natural stone core technology to heat
              your room quickly, then maintain comfort by gradually releasing stored
              heat — no gas, no boiler, no annual servicing.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" onClick={onOpenModal}>
                Get a Free Quote
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToCalculator}>
                Calculate Your Savings
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-sm text-slate-500"
            >
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                </span>
                <span className="font-medium text-slate-600">4.8/5 on Trustpilot</span>
              </span>

              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />

              <span>2,000+ UK homes heated</span>

              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" aria-hidden="true" />

              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-brand-amber" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Made in Leeds
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right column — product card ─────────────────────── */}
          <motion.div
            className="flex-1 w-full max-w-md lg:max-w-none"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              className="relative"
            >
              {/* PATENTED badge */}
              <div className="absolute -top-3 right-4 z-10 bg-brand-cream text-brand-amber text-[10px] font-sans font-semibold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full shadow-md border border-brand-amber/20">
                Patented Technology
              </div>

              {/* Main card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]"
                style={{ background: "linear-gradient(145deg, #1a1a2e 0%, #2d2d4e 40%, #e8833a 100%)" }}
              >
                {/* Decorative inner circles */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-brand-amber/20 blur-xl" />
                </div>

                {/* Stone texture lines */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)"
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-brand-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-white">
                    NEOS Radiator
                  </h2>
                  <p className="font-sans text-sm text-white/70">
                    Natural Stone Core Technology
                  </p>
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/40 to-transparent">
                  <p className="font-sans text-xs text-white/60 text-center tracking-widest uppercase">
                    2000W model shown
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400"
      >
        <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
