"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface CalcResults {
  annualSavings: number;
  tenYearSavings: number;
  co2Reduction: number;
}

const heatingTypes = [
  { value: "gas-boiler", label: "Gas Boiler", multiplier: 0.7 },
  { value: "oil-boiler", label: "Oil Boiler", multiplier: 0.6 },
  { value: "storage-heaters", label: "Storage Heaters", multiplier: 0.65 },
  { value: "lpg", label: "LPG", multiplier: 0.55 },
];

const houseSizes = [
  { value: "1-bed-flat", label: "1-bed flat", multiplier: 0.9 },
  { value: "2-bed-flat", label: "2-bed flat", multiplier: 0.92 },
  { value: "2-bed-house", label: "2-bed house", multiplier: 0.95 },
  { value: "3-bed-house", label: "3-bed house", multiplier: 1.0 },
  { value: "4-bed-house", label: "4-bed house", multiplier: 1.05 },
  { value: "5-plus", label: "5+ bed house", multiplier: 1.1 },
];

function formatGBP(n: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
}

function ChevronDown() {
  return (
    <svg
      className="w-4 h-4 text-white/40 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Calculator() {
  const [heatingType, setHeatingType] = useState("gas-boiler");
  const [houseSize, setHouseSize] = useState("3-bed-house");
  const [rooms, setRooms] = useState(5);
  const [monthlyBill, setMonthlyBill] = useState("");
  const [results, setResults] = useState<CalcResults | null>(null);

  const handleCalculate = () => {
    const bill = parseFloat(monthlyBill);
    if (!bill || bill <= 0) return;

    const heating = heatingTypes.find((h) => h.value === heatingType)!;
    const size = houseSizes.find((s) => s.value === houseSize)!;

    const annualCurrent = bill * 12;
    const annualNeos = annualCurrent * heating.multiplier * size.multiplier;
    const annualSavings = annualCurrent - annualNeos;

    setResults({
      annualSavings,
      tenYearSavings: annualSavings * 10,
      co2Reduction: annualCurrent * 0.002,
    });
  };

  const scrollToQuote = () => {
    document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber transition-colors cursor-pointer";

  return (
    <section
      id="calculator"
      className="py-24"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #0f0f20 55%, #1a1a2e 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-4">
            Savings Calculator
          </p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-white mb-3 text-balance">
            How Much Could You Save?
          </h2>
          <p className="font-sans text-lg text-white/70">
            Enter your details for an instant estimate
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
          className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Heating type */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-white/80">
                Current heating type
              </label>
              <div className="relative">
                <select
                  value={heatingType}
                  onChange={(e) => setHeatingType(e.target.value)}
                  className={selectClass}
                >
                  {heatingTypes.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* House size */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm font-medium text-white/80">
                House size
              </label>
              <div className="relative">
                <select
                  value={houseSize}
                  onChange={(e) => setHouseSize(e.target.value)}
                  className={selectClass}
                >
                  {houseSizes.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Rooms slider */}
            <div className="flex flex-col gap-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="font-sans text-sm font-medium text-white/80">
                  Number of rooms to heat
                </label>
                <span className="font-serif text-3xl font-bold text-brand-amber leading-none">
                  {rooms}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-brand-amber cursor-pointer"
                aria-label="Number of rooms to heat"
              />
              <div className="flex justify-between font-sans text-xs text-white/40">
                <span>1 room</span>
                <span>10 rooms</span>
              </div>
            </div>

            {/* Monthly bill */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label
                htmlFor="monthly-bill"
                className="font-sans text-sm font-medium text-white/80"
              >
                Current monthly heating bill
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-medium text-white/50 select-none">
                  £
                </span>
                <input
                  id="monthly-bill"
                  type="number"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  placeholder="120"
                  min={1}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-amber placeholder:text-white/25 transition-colors"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!monthlyBill || parseFloat(monthlyBill) <= 0}
            className="w-full mt-6"
            size="lg"
          >
            Calculate My Savings
          </Button>
        </motion.div>

        {/* Results panel */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" as const }}
              className="mt-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  {
                    label: "Annual Savings",
                    value: formatGBP(results.annualSavings),
                  },
                  {
                    label: "10-Year Savings",
                    value: formatGBP(results.tenYearSavings),
                  },
                  {
                    label: "CO₂ Reduction",
                    value: `${results.co2Reduction.toFixed(1)} t/yr`,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 text-center"
                  >
                    <p className="font-sans text-[10px] text-white/50 uppercase tracking-widest mb-2">
                      {stat.label}
                    </p>
                    <p className="font-serif text-3xl font-bold text-brand-amber">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToQuote}
                className="w-full py-4 rounded-xl border border-brand-amber/50 text-brand-amber font-sans font-medium hover:bg-brand-amber hover:text-white transition-all duration-200"
              >
                See a personalised quote for your home →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
