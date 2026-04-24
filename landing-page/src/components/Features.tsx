"use client";

import { motion } from "framer-motion";
import { Flame, Leaf, Banknote, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Flame,
    title: "Natural Stone Core",
    description:
      "Heats up fast, then releases stored warmth gradually. Your room stays comfortable without constant energy draw.",
  },
  {
    icon: Leaf,
    title: "Zero Emissions",
    description:
      "No boiler, no gas supply, no carbon emissions at point of use. Future-proof your home heating.",
  },
  {
    icon: Banknote,
    title: "Save Up to 40%",
    description:
      "Patented energy-efficient technology means lower running costs compared to traditional heating systems.",
  },
  {
    icon: ShieldCheck,
    title: "No Annual Servicing",
    description:
      "Unlike gas boilers, NEOS requires no annual safety checks or maintenance contracts. Install and forget.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 md:py-32 bg-white relative"
      style={{
        backgroundImage:
          "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-4">
            Why Choose NEOS
          </p>
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-brand-dark mb-5 text-balance">
            Heating Reimagined
          </h2>
          <p className="font-sans text-lg text-slate-600 max-w-2xl mx-auto">
            Traditional radiators heat fast, then cool fast. NEOS holds heat.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut" as const,
                }}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-brand-amber hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-amber/10 flex items-center justify-center mb-5 group-hover:bg-brand-amber/20 transition-colors duration-300">
                  <Icon
                    className="w-6 h-6 text-brand-amber"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-2">
                  {feature.title}
                </h3>
                <p className="font-sans text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
