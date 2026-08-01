import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import {
  BlogPreview,
  BonusGrid,
  CTABand,
  CategoryGrid,
  EventsAndTraining,
  FeaturedProducts,
  OpportunitySection,
  RewardsTimeline,
  StatsBand,
  Testimonials,
  WhyChoose,
} from "@/components/home/Sections";

const title = "RDG Future Way Pvt. Ltd. — Ayurveda, Wellness & Business Opportunity";
const description =
  "Quality ayurvedic, healthcare, agriculture and lifestyle products from RDG Future Way, with a transparent generation income plan for distributors across India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "RDG Future Way Pvt. Ltd.",
          description,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Indore",
            addressRegion: "Madhya Pradesh",
            addressCountry: "IN",
          },
          telephone: "+91 98765 43210",
          email: "care@rdgfutureway.com",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <StatsBand />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChoose />
      <OpportunitySection />
      <BonusGrid />
      <Testimonials />
      <EventsAndTraining />
      <RewardsTimeline />
      <BlogPreview />
      <CTABand />
    </>
  );
}
