import { Eye, Flag, Quote, Target } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { stats } from "@/data/site";

const title = "About RDG Future Way — Our Story, Vision & Mission";
const description =
  "RDG Future Way Pvt. Ltd. is an Indian direct selling company manufacturing ayurvedic, healthcare, agricultural and lifestyle products for 50,000+ families.";

const pillars = [
  {
    icon: Eye,
    title: "Our Vision",
    text: "To make certified, affordable wellness and lifestyle products reachable in every Indian household while creating one lakh self-reliant entrepreneurs.",
  },
  {
    icon: Target,
    title: "Our Mission",
    text: "Manufacture with integrity, price with fairness, train relentlessly and pay every rupee of bonus on time — month after month.",
  },
  {
    icon: Flag,
    title: "Our Values",
    text: "Transparency in payouts, honesty in labelling, respect for distributors and long-term thinking over short-term volume.",
  },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="An Indian company built on products people actually reorder"
        description="RDG Future Way Pvt. Ltd. began with a simple belief: if the product is genuinely good and honestly priced, the business builds itself. Today that belief powers 15 categories, 500+ SKUs and thousands of family businesses."
      />

      <section className="py-20">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="card-lift h-full rounded-3xl border border-border bg-card p-8 shadow-soft">
                <span className="bg-brand flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground">
                  <p.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {p.title}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <div className="rounded-[2rem] border border-border bg-card p-10 shadow-card">
              <Quote className="h-8 w-8 text-gold" />
              <p className="mt-6 text-lg leading-relaxed text-foreground">
                “We did not start RDG to sell more boxes. We started it so a family in a small town
                could buy a trustworthy ayurvedic medicine at a fair price — and, if they choose,
                turn that trust into a dignified income. Every policy we write is tested against
                that single sentence.”
              </p>
              <footer className="mt-8">
                <p className="font-display font-semibold text-foreground">Chairman's Message</p>
                <p className="text-sm text-muted-foreground">
                  Founder & Chairman, RDG Future Way Pvt. Ltd.
                </p>
              </footer>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="By the numbers"
              title="Growth measured in families served"
              description="Every metric below is a household that chose RDG for their monthly needs or their monthly income."
            />
            <div className="mt-10 grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <p className="font-display text-3xl font-extrabold text-gradient">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Milestones" title="The road so far" />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              { year: "2019", text: "RDG Future Way incorporated with 40 ayurvedic SKUs." },
              { year: "2021", text: "Agriculture and organic food divisions launched." },
              { year: "2023", text: "Generation Plan v2 released with royalty pool." },
              { year: "2026", text: "25+ cities, new logistics hub and 500+ products." },
            ].map((m) => (
              <StaggerItem key={m.year}>
                <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <p className="font-display text-2xl font-bold text-primary">{m.year}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export default About;
