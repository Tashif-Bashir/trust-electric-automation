"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^(\+44|0)[\s-]?7[\d][\d\s-]{7,9}[\d]$/,
      "Please enter a valid UK mobile number"
    ),
  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      "Please enter a valid UK postcode"
    ),
  propertyType: z.enum([
    "flat",
    "terraced",
    "semi-detached",
    "detached",
    "bungalow",
    "other",
  ]),
  roomsToHeat: z.enum(["1", "2", "3", "4", "5-6", "7+"]),
  currentHeating: z.enum([
    "gas-boiler",
    "oil-boiler",
    "storage-heaters",
    "lpg",
    "other",
  ]),
  message: z.string().max(1000).optional(),
  gdprConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to be contacted to receive a quote",
    }),
});

type FormValues = z.infer<typeof schema>;

const roomOptions = [
  { value: "1", label: "1 room" },
  { value: "2", label: "2 rooms" },
  { value: "3", label: "3 rooms" },
  { value: "4", label: "4 rooms" },
  { value: "5-6", label: "5–6 rooms" },
  { value: "7+", label: "7+ rooms" },
];

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[\s-]/g, "");
  if (digits.startsWith("07")) return "+44" + digits.slice(1);
  return digits;
}

function formatPostcode(postcode: string): string {
  const upper = postcode.toUpperCase().replace(/\s/g, "");
  return upper.slice(0, -3) + " " + upper.slice(-3);
}

function SelectChevron() {
  return (
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
      <svg
        className="w-4 h-4 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

interface LeadFormCardProps {
  onSuccess?: () => void;
}

export function LeadFormCard({ onSuccess }: LeadFormCardProps) {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: "semi-detached",
      roomsToHeat: "3",
      currentHeating: "gas-boiler",
      gdprConsent: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitState("idle");
    setErrorMessage("");
    setFirstName(data.fullName.trim().split(" ")[0]);
    try {
      const payload = {
        full_name: data.fullName,
        email: data.email,
        phone: normalizePhone(data.phone),
        postcode: formatPostcode(data.postcode),
        property_type: data.propertyType,
        rooms_to_heat: data.roomsToHeat,
        current_heating: data.currentHeating,
        message: data.message ?? "",
        gdpr_consent: data.gdprConsent,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://trust-electric-api.onrender.com";
      const res = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { detail?: string }).detail ?? "Something went wrong. Please try again.");
      }

      setSubmitState("success");
      setTimeout(() => onSuccess?.(), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitState("error");
    }
  };

  const fieldClass = (hasError: boolean) =>
    [
      "w-full rounded-lg border px-4 py-3 font-sans text-sm text-brand-dark placeholder:text-slate-400",
      "focus:outline-none focus:ring-2 focus:ring-brand-amber transition-colors",
      hasError
        ? "border-brand-warning bg-red-50"
        : "border-slate-200 bg-white hover:border-slate-300",
    ].join(" ");

  const labelClass = "block font-sans text-sm font-medium text-slate-700 mb-1.5";

  if (submitState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" as const }}
        className="flex flex-col items-center justify-center py-10 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-brand-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-brand-success" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">
            Thank you{firstName ? `, ${firstName}` : ""}!
          </h3>
          <p className="font-sans text-slate-600 max-w-sm leading-relaxed">
            We&apos;ve received your enquiry and will call you back within 2 hours during business hours.
          </p>
        </div>
        <p className="font-sans text-sm text-slate-400">This window will close shortly&hellip;</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Error banner */}
      <AnimatePresence>
        {submitState === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full name */}
      <div>
        <label htmlFor="fullName" className={labelClass}>Full name *</label>
        <input
          id="fullName"
          type="text"
          placeholder="Jane Smith"
          autoComplete="name"
          {...register("fullName")}
          className={fieldClass(!!errors.fullName)}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-brand-warning">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email address *</label>
          <input
            id="email"
            type="email"
            placeholder="jane@example.com"
            autoComplete="email"
            {...register("email")}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-brand-warning">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Mobile number *</label>
          <input
            id="phone"
            type="tel"
            placeholder="07700 900000"
            autoComplete="tel"
            {...register("phone")}
            className={fieldClass(!!errors.phone)}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-brand-warning">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Postcode + Property type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="postcode" className={labelClass}>Postcode *</label>
          <input
            id="postcode"
            type="text"
            placeholder="LS25 2JY"
            autoComplete="postal-code"
            {...register("postcode")}
            className={fieldClass(!!errors.postcode)}
          />
          {errors.postcode && (
            <p className="mt-1 text-xs text-brand-warning">{errors.postcode.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="propertyType" className={labelClass}>Property type *</label>
          <div className="relative">
            <select
              id="propertyType"
              {...register("propertyType")}
              className={`${fieldClass(!!errors.propertyType)} appearance-none pr-10 cursor-pointer`}
            >
              <option value="flat">Flat</option>
              <option value="terraced">Terraced house</option>
              <option value="semi-detached">Semi-detached</option>
              <option value="detached">Detached house</option>
              <option value="bungalow">Bungalow</option>
              <option value="other">Other</option>
            </select>
            <SelectChevron />
          </div>
          {errors.propertyType && (
            <p className="mt-1 text-xs text-brand-warning">{errors.propertyType.message}</p>
          )}
        </div>
      </div>

      {/* Rooms + Current heating */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roomsToHeat" className={labelClass}>Rooms to heat *</label>
          <div className="relative">
            <select
              id="roomsToHeat"
              {...register("roomsToHeat")}
              className={`${fieldClass(!!errors.roomsToHeat)} appearance-none pr-10 cursor-pointer`}
            >
              {roomOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </div>
        <div>
          <label htmlFor="currentHeating" className={labelClass}>Current heating *</label>
          <div className="relative">
            <select
              id="currentHeating"
              {...register("currentHeating")}
              className={`${fieldClass(!!errors.currentHeating)} appearance-none pr-10 cursor-pointer`}
            >
              <option value="gas-boiler">Gas boiler</option>
              <option value="oil-boiler">Oil boiler</option>
              <option value="storage-heaters">Storage heaters</option>
              <option value="lpg">LPG</option>
              <option value="other">Other</option>
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      {/* Message (optional) */}
      <div>
        <label htmlFor="message" className={labelClass}>
          Anything else?{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="e.g. I have a Victorian terrace and currently pay £150/month on gas…"
          {...register("message")}
          className={`${fieldClass(!!errors.message)} resize-none`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-brand-warning">{errors.message.message}</p>
        )}
      </div>

      {/* GDPR consent */}
      <div>
        <div className="flex items-start gap-3">
          <input
            id="gdprConsent"
            type="checkbox"
            {...register("gdprConsent")}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-brand-amber cursor-pointer shrink-0"
          />
          <label htmlFor="gdprConsent" className="font-sans text-sm text-slate-600 cursor-pointer leading-relaxed">
            I agree to be contacted by Trust Electric Heating about my enquiry. View our{" "}
            <a href="#" className="text-brand-amber underline underline-offset-2 hover:text-amber-600">
              Privacy Policy
            </a>
            .
          </label>
        </div>
        {errors.gdprConsent && (
          <p className="mt-1.5 text-xs text-brand-warning">{errors.gdprConsent.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-1">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending&hellip;
          </span>
        ) : (
          "Get My Free Quote →"
        )}
      </Button>

      <p className="text-center font-sans text-xs text-slate-400">
        No obligation. We&apos;ll never share your details with third parties.
      </p>
    </form>
  );
}

export default function LeadForm() {
  return (
    <section id="quote" className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-4">
            Free Quote
          </p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-brand-dark mb-4 text-balance">
            Ready to Switch?
          </h2>
          <p className="font-sans text-lg text-slate-600 max-w-xl mx-auto">
            Fill in the form below and one of our heating specialists will call you back within 2 hours.
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
        >
          <LeadFormCard />
        </motion.div>
      </div>
    </section>
  );
}
