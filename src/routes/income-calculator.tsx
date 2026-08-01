import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { PageHeader } from "@/components/layout/PageHeader";

const title = "Income Calculator — Estimate Your RDG Monthly Earnings";
const description =
  "Use the RDG Future Way income calculator to estimate potential monthly income from your joining level, monthly purchases and team size.";

export const Route = createFileRoute("/income-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Calculator,
});

const levels = [
  { name: "Starter", multiplier: 1, min: 1200 },
  { name: "Silver", multiplier: 1.35, min: 3000 },
  { name: "Gold", multiplier: 1.7, min: 6000 },
  { name: "Platinum", multiplier: 2.2, min: 12000 },
];

function Calculator() {
  const [level, setLevel] = useState(0);
  const [purchase, setPurchase] = useState(3000);
  const [team, setTeam] = useState(25);

  const result = useMemo(() => {
    const lvl = levels[level]!;
    const retail = purchase * 0.22;
    const performance = purchase * team * 0.012 * lvl.multiplier;
    const matching = performance * 0.35;
    const leadership = team > 50 ? performance * 0.15 : 0;
    const total = Math.round(retail + performance + matching + leadership);
    return { retail: Math.round(retail), performance: Math.round(performance), matching: Math.round(matching), leadership: Math.round(leadership), total };
  }, [level, purchase, team]);

  return (
    <>
      <PageHeader
        eyebrow="Income Calculator"
        title="See what your effort could be worth"
        description="Move the sliders to model a month. These are illustrative projections based on the published plan — actual income depends entirely on your activity and team performance."
      />

      <section className="py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
            <p className="font-display text-sm font-semibold tracking-widest text-primary uppercase">
              Joining Level
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {levels.map((l, i) => (
                <button
                  key={l.name}
                  onClick={() => setLevel(i)}
                  className={
                    level === i
                      ? "bg-brand rounded-2xl px-3 py-3 text-sm font-semibold text-primary-foreground"
                      : "rounded-2xl border border-border px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent"
                  }
                >
                  {l.name}
                </button>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <label htmlFor="purchase" className="font-display text-sm font-semibold text-foreground">
                  Monthly purchases (BV value)
                </label>
                <span className="font-display font-bold text-primary">₹{purchase.toLocaleString("en-IN")}</span>
              </div>
              <input
                id="purchase"
                type="range"
                min={1200}
                max={40000}
                step={200}
                value={purchase}
                onChange={(e) => setPurchase(Number(e.target.value))}
                className="mt-4 w-full accent-primary"
              />
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <label htmlFor="team" className="font-display text-sm font-semibold text-foreground">
                  Active team size
                </label>
                <span className="font-display font-bold text-primary">{team} members</span>
              </div>
              <input
                id="team"
                type="range"
                min={0}
                max={500}
                step={5}
                value={team}
                onChange={(e) => setTeam(Number(e.target.value))}
                className="mt-4 w-full accent-primary"
              />
            </div>
          </div>

          <div className="bg-brand rounded-3xl p-8 text-primary-foreground shadow-lift">
            <p className="text-sm tracking-widest uppercase opacity-80">Potential monthly income</p>
            <motion.p
              key={result.total}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 font-display text-5xl font-extrabold"
            >
              ₹{result.total.toLocaleString("en-IN")}
            </motion.p>
            <div className="mt-8 space-y-3 text-sm">
              {[
                ["Retail profit", result.retail],
                ["Performance bonus", result.performance],
                ["Matching bonus", result.matching],
                ["Leadership bonus", result.leadership],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3"
                >
                  <span className="opacity-80">{label}</span>
                  <span className="font-semibold">₹{(value as number).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed opacity-70">
              Illustrative only. RDG Future Way does not guarantee income; earnings depend on personal effort,
              retail sales and team activity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}