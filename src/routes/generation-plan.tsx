import { motion } from "motion/react";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { awardRewards, bonuses, incomePackages, ranks } from "@/data/site";

const title = "Generation Plan — Income Levels, Bonuses & Rewards | RDG Future Way";
const description =
  "The RDG Future Way generation plan explained: retail profit, performance bonus, matching bonus, generation income, leadership bonus, royalty, car fund and foreign tours.";

const tree = [
  { level: "You", nodes: 1, payout: "Retail + Performance" },
  { level: "Generation 1", nodes: 3, payout: "20% matching" },
  { level: "Generation 2", nodes: 9, payout: "12% generation" },
  { level: "Generation 3", nodes: 27, payout: "8% generation" },
];

function GenerationPlan() {
  return (
    <>
      <PageHeader
        eyebrow="Generation Plan"
        title="A published, transparent income plan"
        description="No capping tricks, no forced matching. Income flows through active generations of your network and is paid on the 10th of every month."
      />

      <section className="py-16">
        <div className="container-x">
          <SectionHeading
            eyebrow="Ayurvedic ID package"
            title="15-level package structure"
            description="The reference material presents an ID package value and a 100-ID network value for each level. These figures are shown for information only and are subject to the official plan terms."
          />
          <div className="mt-10 overflow-x-auto rounded-3xl border border-border shadow-soft">
            <table className="w-full min-w-[38rem] text-left text-sm">
              <thead className="bg-primary-dark text-primary-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Level</th>
                  <th className="px-5 py-4 font-semibold">ID package</th>
                  <th className="px-5 py-4 font-semibold">100 IDs total</th>
                  <th className="px-5 py-4 font-semibold">Formula</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {incomePackages.map((item) => (
                  <tr key={item.level} className="border-t border-border">
                    <td className="px-5 py-3 font-semibold text-foreground">{item.level}</td>
                    <td className="px-5 py-3 text-muted-foreground">{item.package}</td>
                    <td className="px-5 py-3 text-muted-foreground">{item.network}</td>
                    <td className="px-5 py-3 text-muted-foreground">ID × 100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Network structure" title="How the generation tree grows" />
          <div className="mt-14 space-y-6">
            {tree.map((row, i) => (
              <Reveal key={row.level} delay={i * 0.1}>
                <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display font-semibold text-foreground">{row.level}</p>
                    <span className="bg-gold-grad rounded-full px-3 py-1 text-[11px] font-bold text-gold-foreground">
                      {row.payout}
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {Array.from({ length: row.nodes }).map((_, n) => (
                      <motion.span
                        key={n}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: n * 0.02, duration: 0.3 }}
                        className="bg-brand h-8 w-8 rounded-full opacity-80"
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Income streams" title="Six ways your business pays you" />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((b) => (
              <StaggerItem key={b.name}>
                <div className="card-lift h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <p className="font-display text-2xl font-bold text-gradient">{b.value}</p>
                  <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                    {b.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Rank ladder" title="Qualifications and rewards" />
          <div className="mt-12 overflow-x-auto rounded-3xl border border-border shadow-soft">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="bg-primary-dark text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Rank</th>
                  <th className="px-6 py-4 font-semibold">Group BV</th>
                  <th className="px-6 py-4 font-semibold">Reward</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {ranks.map((r) => (
                  <tr key={r.rank} className="border-t border-border">
                    <td className="px-6 py-4 font-display font-semibold text-foreground">
                      {r.rank}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.bv}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12 overflow-x-auto rounded-3xl border border-border shadow-soft">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="bg-primary-dark text-primary-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Level</th>
                  <th className="px-5 py-4 font-semibold">Qualification</th>
                  <th className="px-5 py-4 font-semibold">Reference reward</th>
                </tr>
              </thead>
              <tbody className="bg-card">
                {awardRewards.map((item) => (
                  <tr key={item.level} className="border-t border-border">
                    <td className="px-5 py-3 font-semibold text-foreground">{item.level}</td>
                    <td className="px-5 py-3 text-muted-foreground">{item.qualification}</td>
                    <td className="px-5 py-3 text-muted-foreground">{item.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Rewards are illustrative references from the supplied company material. Qualification,
            verification and fulfilment are governed by RDG policies.
          </p>
          <div className="mt-10 text-center">
            <a
              href="/income-calculator"
              className="bg-brand inline-flex rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-card"
            >
              Estimate your income
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default GenerationPlan;
