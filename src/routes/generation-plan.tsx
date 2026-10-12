import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Gift,
  Network,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import { PageHeader, SectionHeading } from "@/components/layout/PageHeader";
import { bonuses, directReferralPlans, planLevels } from "@/data/site";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const overview = [
  { icon: Network, value: "15", label: "Plan levels" },
  { icon: Calculator, value: "ID × IDs", label: "Network formula" },
  { icon: Trophy, value: "15", label: "Recognition milestones" },
];

function GenerationPlan() {
  return (
    <>
      <PageHeader
        eyebrow="Business Plans"
        title="A clear view of the 15-level income and reward structure"
        description="Explore the ID package values, 100-ID network examples, single-leg referral references and milestone rewards shown in the supplied RDG plan material."
      >
        <a
          href="/income-calculator"
          className="bg-brand inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
        >
          Open plan calculator <ArrowRight className="h-4 w-4" />
        </a>
      </PageHeader>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-5 sm:grid-cols-3">
          {overview.map(({ icon: Icon, value, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.08 }}
              className="card-glow rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <span className="bg-brand flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-3xl font-extrabold text-gradient">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="ID package income plan"
            title="15 levels, shown with the 100-ID formula"
            description="Network value is calculated as the selected ID package value multiplied by the number of active IDs. The table below shows the supplied 100-ID reference for every level."
          />
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="bg-primary-dark text-primary-foreground">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Level</th>
                    <th className="px-5 py-4 font-semibold">ID package</th>
                    <th className="px-5 py-4 font-semibold">100 IDs network value</th>
                    <th className="px-5 py-4 font-semibold">Formula</th>
                    <th className="px-5 py-4 font-semibold">Milestone reward</th>
                  </tr>
                </thead>
                <tbody>
                  {planLevels.map((item) => (
                    <tr
                      key={item.level}
                      className="border-t border-border transition-colors hover:bg-accent/50"
                    >
                      <td className="px-5 py-4 font-display font-bold text-primary">
                        {item.level}
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">
                        {money(item.packageValue)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-secondary">
                        {money(item.networkValue)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {money(item.packageValue)} × 100
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{item.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Single-leg referral plan"
              title="Reference referral income by package"
              description="These are the four package-to-referral values visible in the supplied single-leg plan image."
            />
            <div className="mt-8 space-y-4">
              {directReferralPlans.map((item, index) => (
                <motion.div
                  key={item.packageValue}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.08 }}
                  className="card-tilt flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-soft"
                >
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Package
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-foreground">
                      {money(item.packageValue)}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <div className="text-right">
                    <p className="text-xs font-semibold tracking-[0.16em] text-secondary uppercase">
                      Referral reference
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-secondary">
                      {money(item.referralIncome)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-brand flex h-full flex-col rounded-[2rem] p-8 text-primary-foreground shadow-lift sm:p-10">
            <Gift className="h-8 w-8 text-gold" />
            <h2 className="mt-5 font-display text-2xl font-bold">Rewards are tracked separately</h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/80">
              The reward ladder moves from a certificate and welcome kit through devices, vehicles,
              homes, travel and the chairman award as the listed qualification value increases.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-primary-foreground/85">
              {[
                "15 recognition milestones across the plan",
                "Qualification linked to the listed network value",
                "Referral income and rewards shown as separate references",
                "Fulfilment subject to eligibility and written RDG terms",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a
              href="#rewards"
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5"
            >
              View reward milestones <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Distributor commission streams"
            title="How the business plan builds income"
            description="The direct referral references are calculated above. These additional plan components are qualification-based and are shown separately so the plan is easy to understand without presenting them as guaranteed earnings."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((bonus, index) => (
              <motion.article
                key={bonus.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 3) * 0.07 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="bg-brand flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold text-secondary">
                    {bonus.value}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                  {bonus.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{bonus.detail}</p>
              </motion.article>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Important:</strong> the percentage and pool labels
            are plan references. Actual payout depends on product sales, personal and group volume,
            active IDs, rank qualification, company terms, taxes and payout timing.
          </div>
        </div>
      </section>

      <section id="rewards" className="bg-surface scroll-mt-24 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Award & reward plan"
            title="From welcome kit to leadership recognition"
            description="Reward names below are transcribed from the supplied plan image. Fulfilment is subject to official qualification and company terms."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {planLevels.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 3) * 0.06 }}
                className="card-sheen flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <span className="bg-gold-grad flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-gold-foreground">
                  {item.level}
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    Qualification {money(item.networkValue)}
                  </p>
                  <p className="mt-1 font-display text-sm font-semibold text-foreground">
                    {item.reward}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              The calculator shows plan references and simple arithmetic from the supplied material.
              It does not calculate guaranteed profit because product cost, operating expenses,
              taxes and final payout terms were not provided in the plan images.
            </p>
          </div>
          <div className="mt-10 text-center">
            <a
              href="/income-calculator"
              className="bg-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
            >
              Calculate your plan references <Calculator className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default GenerationPlan;
