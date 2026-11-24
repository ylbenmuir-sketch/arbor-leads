import { faq, site } from "@/content";
import Header from "@/components/Header";
import { Hero, Marquee, Problem } from "@/components/Hero";
import BeforeAfter from "@/components/BeforeAfter";
import SpeedToLead from "@/components/SpeedToLead";
import { HowItWorks, RoiCalculator } from "@/components/Roi";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import { About, Comparison, FinalCta, Footer, Guarantee } from "@/components/Sections";

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site.name,
      url: site.url,
      email: site.email,
      slogan: site.tagline,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Problem />
        <BeforeAfter />
        <SpeedToLead />
        <RoiCalculator />
        <HowItWorks />
        <Pricing />
        <Comparison />
        <Guarantee />
        <About />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
