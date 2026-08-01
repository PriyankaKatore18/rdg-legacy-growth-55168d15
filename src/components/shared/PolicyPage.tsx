import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/motion/Reveal";

export function PolicyPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <section className="py-16">
        <div className="container-x max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.05}>
              <article className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <h2 className="font-display text-lg font-semibold text-foreground">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
              </article>
            </Reveal>
          ))}
          <p className="text-sm text-muted-foreground">Last updated: 1 August 2026</p>
        </div>
      </section>
    </>
  );
}