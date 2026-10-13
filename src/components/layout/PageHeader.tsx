import { motion } from "motion/react";
import type { ReactNode } from "react";
import aboutCertificatesImage from "@/assets/about-certificates.png";
import aboutFoundersImage from "@/assets/about-founders.png";
import aiBusinessImage from "@/assets/ai-business.png";
import aiBlogImage from "@/assets/ai-blog.png";
import aiCalculatorImage from "@/assets/ai-calculator.png";
import aiCareerImage from "@/assets/ai-career.png";
import aiContactImage from "@/assets/ai-contact.png";
import aiEventsImage from "@/assets/ai-events.png";
import aiGalleryImage from "@/assets/ai-gallery.png";
import aiLearningImage from "@/assets/ai-learning.png";
import aiWellnessImage from "@/assets/ai-wellness-product.png";
import heroImage from "@/assets/hero.jpg";
import opportunityImage from "@/assets/opportunity.jpg";
import opportunityNetworkImage from "@/assets/opportunity-network.png";

const pageVisuals: Record<string, { src: string; alt: string }> = {
  "/about": { src: aboutFoundersImage, alt: "RDG founders collaborating in a bright office" },
  "/become-distributor": {
    src: aiBusinessImage,
    alt: "Entrepreneur and mentor planning a business together",
  },
  "/blog": { src: aiBlogImage, alt: "Wellness lifestyle desk with herbs and a notebook" },
  "/business-opportunity": {
    src: opportunityImage,
    alt: "RDG business opportunity network illustration",
  },
  "/career": { src: aiCareerImage, alt: "Team collaborating around a table in a modern office" },
  "/contact": { src: aiContactImage, alt: "Customer support advisor speaking with a visitor" },
  "/downloads": { src: aiLearningImage, alt: "Digital learning resources on a desk" },
  "/events": {
    src: aiEventsImage,
    alt: "Indian business community applauding at a leadership event",
  },
  "/faqs": {
    src: aboutCertificatesImage,
    alt: "RDG certification documents representing trusted answers",
  },
  "/franchise": {
    src: opportunityNetworkImage,
    alt: "Business network illustration for a local franchise opportunity",
  },
  "/gallery": { src: aiGalleryImage, alt: "Camera and event photographs from the RDG community" },
  "/income-calculator": {
    src: aiCalculatorImage,
    alt: "Calculator, coins and network charts for business planning",
  },
  "/products": {
    src: aiWellnessImage,
    alt: "Berry wellness juice with herbs and fresh botanicals",
  },
  "/success-stories": {
    src: heroImage,
    alt: "RDG community celebrating a shared success",
  },
};

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const visual = pageVisuals[currentPath];

  return (
    <section className="relative overflow-hidden bg-surface pt-32 pb-12 sm:pt-40 sm:pb-16 md:pt-48 md:pb-24">
      <div className="bg-brand absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-15 blur-3xl" />
      <div className="bg-leaf absolute -bottom-40 -left-24 h-96 w-96 rounded-full opacity-10 blur-3xl" />
      <div
        className={
          visual
            ? "container-x relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
            : "container-x relative"
        }
      >
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-[0.22em] text-primary uppercase"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-4 max-w-3xl text-3xl leading-tight font-bold text-foreground sm:text-4xl md:text-5xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {description}
          </motion.p>
          {children && <div className="mt-8">{children}</div>}
        </div>
        {visual && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-card"
          >
            <img
              src={visual.src}
              alt={visual.alt}
              className="aspect-[1.45] h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface/20 via-transparent to-primary-dark/10" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.22em] text-primary uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
