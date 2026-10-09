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

export default Index;
