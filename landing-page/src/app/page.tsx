"use client";

import { useLeadForm } from "@/hooks/useLeadForm";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import LeadForm, { LeadFormCard } from "@/components/LeadForm";
import Footer from "@/components/Footer";
import Modal from "@/components/ui/Modal";

export default function Home() {
  const { isOpen, open, close } = useLeadForm();

  return (
    <>
      <Navigation onOpenModal={open} />
      <Hero onOpenModal={open} />
      <Features />
      <Calculator />
      <HowItWorks />
      <Testimonials />
      <LeadForm />
      <Footer />

      <Modal isOpen={isOpen} onClose={close}>
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-brand-amber mb-2">
              Free Quote
            </p>
            <h2 className="font-serif text-2xl font-bold text-brand-dark leading-tight">
              Get Your Free Quote
            </h2>
            <p className="font-sans text-sm text-slate-500 mt-1">
              We&apos;ll call you back within 2 hours during business hours.
            </p>
          </div>
          <LeadFormCard onSuccess={close} />
        </div>
      </Modal>
    </>
  );
}
