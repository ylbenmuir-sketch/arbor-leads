import { faq, site } from "@/content";
import Header from "@/components/Header";
import { Hero, Pain } from "@/components/Hero";
import BeforeAfter from "@/components/BeforeAfter";
import StickyCta from "@/components/StickyCta";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import { About, AnalyzerSection, CaseStudy, Footer } from "@/components/Sections";

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
        <Pain />
        <CaseStudy />
        <About />
        <BeforeAfter />
        <Pricing />
        <Faq />
        <AnalyzerSection />
      </main>
      {/* The phone sticky bar is hidden from the audit form down, so the footer needs no extra room. */}
      <Footer />
      <StickyCta />
    </>
  );
}
