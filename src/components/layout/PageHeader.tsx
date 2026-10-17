import { ChevronRight, Home } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import aboutCertificatesImage from "@/assets/about-certificates.png";
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
  "/about": { src: heroImage, alt: "RDG family and wellness products representing the company" },
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
  "/privacy-policy": {
    src: aboutCertificatesImage,
    alt: "RDG certification documents representing trusted answers",
  },
  "/refund-policy": {
    src: aiLearningImage,
    alt: "Digital learning resources on a desk",
  },
  "/success-stories": {
    src: heroImage,
    alt: "RDG community celebrating a shared success",
  },
  "/shipping-policy": {
    src: aiBusinessImage,
    alt: "Entrepreneur and mentor planning a business together",
  },
  "/terms": {
    src: opportunityNetworkImage,
    alt: "Business network illustration for RDG terms and conditions",
  },
};

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbLabel,
  variant = "default",
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  breadcrumbLabel?: string;
  variant?: "default" | "image-banner";
  children?: ReactNode;
}) {
  const currentPath = typeof window === "undefined" ? "/" : window.location.pathname;
  const visual = pageVisuals[currentPath];
  const isImageBanner = variant === "image-banner" && Boolean(visual);

  return (
    <section
      className={
        visual
          ? "relative overflow-hidden border-b border-border bg-surface bg-no-repeat"
          : "relative overflow-hidden border-b border-border bg-surface"
      }
      style={
        visual
          ? {
              backgroundImage: `url("${visual.src}")`,
              backgroundPosition: "right center",
              backgroundSize: "auto 100%",
            }
          : undefined
      }
    >
      <div className="bg-brand absolute -top-32 -right-24 h-96 w-96 rounded-full opacity-15 blur-3xl" />
      <div className="bg-leaf absolute -bottom-40 -left-24 h-96 w-96 rounded-full opacity-10 blur-3xl" />
      {visual && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-surface/45"
          aria-hidden="true"
        />
      )}
      {!isImageBanner && (
        <div className="relative border-b border-border/70 bg-card/50">
          <Breadcrumb label={breadcrumbLabel ?? title} />
        </div>
      )}
      <div
        className={
          isImageBanner
            ? "container-x relative flex min-h-[300px] items-center py-9 sm:min-h-[360px] sm:py-10"
            : "container-x relative flex min-h-[190px] items-center py-6 sm:min-h-[220px] sm:py-7"
        }
      >
        <div>
          {isImageBanner ? (
            <Breadcrumb label={breadcrumbLabel ?? title} inline />
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-semibold tracking-[0.22em] text-primary uppercase"
            >
              {eyebrow}
            </motion.p>
          )}
          {isImageBanner && <div className="mt-6 h-1 w-20 rounded-full bg-gold" />}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className={
              isImageBanner
                ? "mt-5 max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-foreground sm:text-5xl"
                : "mt-3 max-w-3xl text-3xl leading-tight font-bold text-foreground sm:text-4xl md:text-5xl"
            }
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {description}
            </motion.p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumb({
  label,
  dark = false,
  inline = false,
}: {
  label: string;
  dark?: boolean;
  inline?: boolean;
}) {
  return (
    <div className={dark ? "border-b border-white/15 bg-black/10" : "bg-transparent"}>
      <div className={inline ? "flex h-10 items-center" : "container-x flex h-10 items-center"}>
        <nav
          aria-label="Breadcrumb"
          className={
            dark
              ? "flex items-center gap-2 text-sm text-primary-foreground/70"
              : "flex items-center gap-2 text-sm text-muted-foreground"
          }
        >
          <a
            href="/"
            className={
              dark
                ? "inline-flex items-center gap-1.5 transition-colors hover:text-white"
                : "inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            }
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </a>
          <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
          <span className={dark ? "font-medium text-white" : "font-medium text-foreground"}>
            {label}
          </span>
        </nav>
      </div>
    </div>
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
