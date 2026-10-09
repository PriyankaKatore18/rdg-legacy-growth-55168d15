import { motion } from "motion/react";
import { ArrowRight, Leaf, PlayCircle, ShieldCheck, Sprout } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

const floatingCards = [
  {
    icon: Leaf,
    title: "Ayurvedic Immunity",
    meta: "12 PV • ₹480 DP",
    pos: "top-24 right-6 md:right-16",
  },
  {
    icon: Sprout,
    title: "Bio Soil Enricher",
    meta: "18 PV • ₹690 DP",
    pos: "bottom-28 right-24 md:right-56",
  },
  {
    icon: ShieldCheck,
    title: "GMP Certified",
    meta: "Batch tested",
    pos: "bottom-56 right-4 md:right-6",
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <img
        src={heroImage}
        alt="Indian family with ayurvedic wellness products beside an organic farm field"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
      <div className="bg-brand animate-blob absolute -top-24 -left-32 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl" />
      <div className="bg-leaf animate-blob absolute bottom-0 left-1/3 h-96 w-96 rounded-full opacity-15 blur-3xl [animation-delay:4s]" />

      <div className="container-x relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold tracking-wide text-primary sm:px-4 sm:text-xs"
          >
            <span className="bg-gold-grad h-2 w-2 rounded-full" />
            Direct Selling • Generation Income Plan
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7 }}
            className="mt-6 text-3xl leading-[1.08] font-extrabold text-foreground sm:text-5xl lg:text-6xl"
          >
            Empowering Every Family Through <span className="text-gradient">Quality Products</span>{" "}
            & Business Opportunities
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.7 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Healthcare, Wellness, Agriculture & Lifestyle products with an innovative Generation
            Income Plan — built for Indian families who want better products and a better future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="/products"
              className="bg-brand group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-7"
            >
              Explore Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/become-distributor"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 bg-background/70 px-5 py-3.5 text-sm font-semibold text-primary backdrop-blur transition-colors hover:bg-accent sm:w-auto sm:px-7"
            >
              Become Distributor
            </a>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:w-auto"
            >
              <PlayCircle className="h-5 w-5" /> Watch company film
            </button>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {["GMP & ISO Certified", "500+ Products", "25+ Cities", "Zero Joining Fee"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden h-[32rem] lg:block">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
              className={`glass animate-float absolute ${card.pos} w-60 rounded-2xl p-4 shadow-card`}
              style={{ animationDelay: `${i * 1.2}s` }}
            >
              <span className="bg-brand flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
                <card.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-sm font-semibold text-foreground">
                {card.title}
              </p>
              <p className="text-xs text-muted-foreground">{card.meta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
