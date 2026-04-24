"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    title: "Free Quote",
    description:
      "Tell us about your home and we'll recommend the perfect NEOS setup. Quote arrives within 24 hours.",
  },
  {
    number: "2",
    title: "Professional Install",
    description:
      "Our certified engineers install your NEOS radiators with minimal disruption. Average home takes one day.",
  },
  {
    number: "3",
    title: "Start Saving",
    description:
      "Enjoy lower bills, zero maintenance, and a warmer home from day one. 10-year warranty included.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-4">
            The Process
          </p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-brand-dark text-balance">
            Simple. From Quote to Cosy in 3 Weeks.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Connecting line — desktop only */}
          <div
            className="hidden md:block absolute top-11 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #e8833a55 30%, #e8833a55 70%, transparent)",
            }}
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col items-center md:items-start text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.15,
                ease: "easeOut" as const,
              }}
            >
              {/* Number circle */}
              <div className="relative z-10 w-[88px] h-[88px] rounded-full bg-brand-cream border-2 border-brand-amber/30 flex items-center justify-center mb-6 shadow-sm">
                <span className="font-serif text-5xl font-bold text-brand-amber leading-none">
                  {step.number}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-base text-slate-600 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
