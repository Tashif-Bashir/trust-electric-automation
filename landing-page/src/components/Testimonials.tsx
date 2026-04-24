"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "We switched from gas two years ago and our bills dropped by 35%. The NEOS heats the room beautifully — it's still warm hours after it cycles off.",
    name: "Sarah T.",
    location: "Leeds, LS12",
    rating: 5,
  },
  {
    quote:
      "No more boiler servicing costs and the radiators actually look fantastic. Honestly the best home improvement we've made.",
    name: "Mark D.",
    location: "Harrogate, HG1",
    rating: 5,
  },
  {
    quote:
      "I was skeptical about electric heating but the stone core technology actually works. Plus the patented system means I'm not constantly adjusting it.",
    name: "James P.",
    location: "York, YO10",
    rating: 5,
  },
];

function StarIcon() {
  return (
    <svg
      className="w-4 h-4 text-brand-amber"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-4">
            Real Customers
          </p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-brand-dark text-balance">
            What Leeds Homeowners Say
          </h2>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none -mx-4 px-4 md:mx-0 md:px-0">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.name}
              className="relative flex-shrink-0 w-[82vw] sm:w-[65vw] md:w-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-100 snap-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: "easeOut" as const,
              }}
            >
              {/* Decorative quote mark */}
              <div
                className="absolute top-5 left-5 text-brand-amber/[0.08] pointer-events-none select-none"
                aria-hidden="true"
              >
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5" aria-label={`${t.rating} out of 5 stars`}>
                {[...Array(t.rating)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-lg italic text-brand-dark leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <footer>
                <p className="font-sans font-semibold text-brand-dark">
                  {t.name}
                </p>
                <p className="font-sans text-sm text-slate-500">{t.location}</p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
