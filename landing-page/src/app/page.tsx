import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Calculator from "@/components/Calculator";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import LeadForm from "@/components/LeadForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Features />
      <Calculator />
      <HowItWorks />
      <Testimonials />
      <LeadForm />
      <Footer />
    </>
  );
}
