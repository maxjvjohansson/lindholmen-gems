import CTA from "@/components/CTA/CTA";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import InfoText from "@/components/InfoText/InfoText";
import Instructions from "@/components/Instructions/Instructions";

export default function HomePage() {
  return (
    <section
      className="w-full h-full
  bg-gradient-to-b from-[#FAF3EB] from-50% to-[#FFE3CA] to-100%"
    >
      <Hero />
      <InfoText />
      <Instructions />
      <CTA />
      <Footer />
    </section>
  );
}
