import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Calculator as CalculatorIcon, Info, Network, Wallet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { bonuses, directReferralPlans, planLevels } from "@/data/site";

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function Calculator() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [activeIds, setActiveIds] = useState(100);
  const [directPlanIndex, setDirectPlanIndex] = useState(0);
  const [directReferrals, setDirectReferrals] = useState(10);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  const result = useMemo(() => {
    const level = planLevels[levelIndex]!;
    const directPlan = directReferralPlans[directPlanIndex]!;
    const networkValue = level.packageValue * activeIds;
    const grossReferral = directPlan.referralIncome * directReferrals;
    const netReference = grossReferral - monthlyExpenses;
    const qualified =
      planLevels.filter((item) => networkValue >= item.networkValue).at(-1) ?? planLevels[0]!;
    const next = planLevels.find((item) => item.networkValue > networkValue);
    const progress = next
      ? Math.min(100, Math.round((networkValue / next.networkValue) * 100))
      : 100;

    return {
      level,
      directPlan,
      networkValue,
      grossReferral,
      netReference,
      qualified,
      next,
      progress,
    };
  }, [activeIds, directPlanIndex, directReferrals, levelIndex, monthlyExpenses]);

  return (
    <>
      <PageHeader
        eyebrow="Plan Calculator"
        title="Calculate plan value, referral references and reward progress"
        description="Use the formulas visible in the supplied RDG plan material. This tool separates network value from referral references and subtracts only the expenses you enter."
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
            <div className="flex items-center gap-3">
              <span className="bg-brand flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
                <CalculatorIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Choose your assumptions
                </p>
                <p className="text-sm text-muted-foreground">
                  Adjust the inputs to model a scenario.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-3">
                <label className="font-display text-sm font-semibold text-foreground">
                  ID package level
                </label>
                <span className="font-display text-sm font-bold text-primary">
                  Level {result.level.level} · {money(result.level.packageValue)}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {planLevels.map((item, index) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setLevelIndex(index)}
                    className={
                      levelIndex === index
                        ? "bg-brand rounded-xl px-2 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
                        : "rounded-xl border border-border px-2 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
                    }
                  >
                    L{item.level}
                    <span className="mt-0.5 block text-[10px] opacity-80">
                      {money(item.packageValue)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-9">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="active-ids"
                  className="font-display text-sm font-semibold text-foreground"
                >
                  Active IDs in your network
                </label>
                <span className="font-display font-bold text-primary">{activeIds} IDs</span>
              </div>
              <input
                id="active-ids"
                type="range"
                min={1}
                max={100}
                value={activeIds}
                onChange={(event) => setActiveIds(Number(event.target.value))}
                className="mt-4 w-full accent-primary"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Formula: {money(result.level.packageValue)} × {activeIds} active IDs
              </p>
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="direct-package"
                  className="font-display text-sm font-semibold text-foreground"
                >
                  Direct referral package
                </label>
                <select
                  id="direct-package"
                  value={directPlanIndex}
                  onChange={(event) => setDirectPlanIndex(Number(event.target.value))}
                  className="field mt-3"
                >
                  {directReferralPlans.map((item, index) => (
                    <option key={item.packageValue} value={index}>
                      {money(item.packageValue)} package → {money(item.referralIncome)} reference
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="direct-referrals"
                    className="font-display text-sm font-semibold text-foreground"
                  >
                    Direct referrals
                  </label>
                  <span className="font-display font-bold text-primary">{directReferrals}</span>
                </div>
                <input
                  id="direct-referrals"
                  type="range"
                  min={0}
                  max={100}
                  value={directReferrals}
                  onChange={(event) => setDirectReferrals(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
              </div>
            </div>

            <div className="mt-9">
              <label
                htmlFor="expenses"
                className="font-display text-sm font-semibold text-foreground"
              >
                Monthly business expenses
              </label>
              <input
                id="expenses"
                type="number"
                min={0}
                step={100}
                value={monthlyExpenses}
                onChange={(event) => setMonthlyExpenses(Math.max(0, Number(event.target.value)))}
                className="field mt-3"
                placeholder="0"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Optional: travel, promotion, delivery or other costs you want to subtract.
              </p>
            </div>
          </div>

          <div className="bg-brand rounded-3xl p-6 text-primary-foreground shadow-lift sm:p-8">
            <p className="text-sm tracking-[0.18em] uppercase opacity-75">Illustrative scenario</p>
            <motion.div
              key={`${result.networkValue}-${result.grossReferral}-${result.netReference}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <p className="text-xs uppercase opacity-70">Net referral reference after expenses</p>
              <p className="mt-1 font-display text-4xl font-extrabold sm:text-5xl">
                {money(result.netReference)}
              </p>
            </motion.div>

            <div className="mt-8 space-y-3 text-sm">
              <ResultRow icon={Network} label="Network value" value={result.networkValue} />
              <ResultRow
                icon={Wallet}
                label="Gross direct referral reference"
                value={result.grossReferral}
              />
              <ResultRow icon={Info} label="Expenses entered" value={monthlyExpenses} />
            </div>

            <div className="mt-8 rounded-2xl bg-primary-foreground/10 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="opacity-80">Current reward qualification</span>
                <span className="font-semibold">Level {result.qualified.level}</span>
              </div>
              <p className="mt-2 font-display font-semibold">{result.qualified.reward}</p>
              {result.next && (
                <>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
                    <motion.div
                      className="h-full rounded-full bg-gold"
                      animate={{ width: `${result.progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <p className="mt-2 text-xs opacity-70">
                    {result.progress}% toward Level {result.next.level}: {result.next.reward}
                  </p>
                </>
              )}
            </div>

            <p className="mt-8 text-xs leading-relaxed opacity-70">
              This is not guaranteed profit. The supplied material does not state product margin,
              operating costs, taxes or final payout terms, so those are not invented here.
            </p>
            <a
              href="/generation-plan"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary-dark transition-transform hover:-translate-y-0.5"
            >
              View complete plan <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Distributor income structure
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground">
              More than one way to build income
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The calculator can calculate the direct referral reference and network arithmetic
              shown in the supplied plan. The following streams require their own sales, volume and
              qualification conditions.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((bonus, index) => (
              <motion.article
                key={bonus.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.06 }}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="bg-gold flex h-10 w-10 items-center justify-center rounded-2xl text-gold-foreground">
                    {index + 1}
                  </span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
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
          <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
            Percentage and pool labels are displayed as plan references. They are not added to the
            numeric result because the supplied material does not define the qualifying BV rules,
            payout caps, timing, taxes or final settlement conditions.
          </p>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container-x">
          <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p>
              Network value is not the same as personal income. Use this calculator to understand
              the arithmetic shown in the plan posters; confirm eligibility, qualification, payout
              timing and expenses with RDG before making a business decision.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ResultRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Network;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary-foreground/10 px-4 py-3">
      <span className="flex items-center gap-2 opacity-80">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="font-semibold">{money(value)}</span>
    </div>
  );
}

export default Calculator;
