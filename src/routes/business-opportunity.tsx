import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Banknote, Compass, GraduationCap, Trophy, Users } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import opportunityImage from "@/assets/opportunity.jpg";
import { journey } from "@/data/site";

const title = "Business Opportunity — Direct Selling with RDG Future Way";
const description =
  "Learn how direct selling works at RDG Future Way: low investment, repurchase income, training support, leadership growth, rewards and recognition.";

export const Route = createFileRoute("/business-opportunity")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Opportunity,
});

const benefits = [
  { icon: Banknote, title: "Low Investment", text: "Free registration. Start with the products you already buy." },
  { icon: Users, title: "Passive Income", text: "Repurchase income from every active generation of your team." },
  { icon: Compass, title: "Leadership Growth", text: "Structured ranks with clear qualification criteria." },
  { icon: GraduationCap, title: "Training", text: "Weekly live sessions plus an on-demand video library." },
  { icon: Trophy, title: "Rewards", text: "Car fund, house fund and quarterly recognition." },
  { icon: ArrowRight, title: "Travel", text: "Domestic and international leadership tours." },
];

function Opportunity() {
  return (
    <>
      <PageHeader
        eyebrow="Business Opportunity"
        title="A business you can start this week, from home"
        description="Direct selling removes advertising, distributors and retail margins from the price — and pays that saving to the people who actually recommend the product. That's you."
      >
        <Link
          to="/become-distributor"
          className="bg-brand inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card"
        >
          Start free registration <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <section className="py-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <img
              src={opportunityImage}
              alt="How direct selling distributes value to distributors"
              loading="lazy"
              width={1280}
              height={1024}
              className="rounded-[2rem] border border-border shadow-card"
            />
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="From your first order to leadership income"
            />
            <div className="mt-8 space-y-3">
              {journey.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.05}>
                  <div className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                    <span className="bg-gold-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-gold-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">{s.step}</p>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Why join RDG" title="Six reasons distributors stay for years" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <StaggerItem key={b.title}>
                <div className="card-lift h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <span className="bg-leaf flex h-12 w-12 items-center justify-center rounded-2xl text-secondary-foreground">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}