import { PlayCircle, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { testimonials } from "@/data/site";

const title = "Success Stories — RDG Future Way Distributors & Customers";
const description =
  "Read and watch stories from RDG Future Way distributors and customers who transformed their health and income through direct selling.";

function SuccessStories() {
  return (
    <>
      <PageHeader
        eyebrow="Success Stories"
        title="Ordinary people, extraordinary consistency"
        description="Every leader below started as a customer. What changed was not luck — it was a repeatable system, applied every month."
      />

      <section className="py-16">
        <div className="container-x">
          <Stagger className="grid gap-6 md:grid-cols-3">
            {["Sunita's 4-Year Journey", "From Farmer to Platinum", "Building a Team of 900"].map(
              (v) => (
                <StaggerItem key={v}>
                  <div className="card-lift overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                    <div className="bg-brand relative flex h-48 items-center justify-center">
                      <PlayCircle className="h-14 w-14 text-primary-foreground/90" />
                    </div>
                    <div className="p-6">
                      <p className="font-display font-semibold text-foreground">{v}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Video testimonial • 6 min
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ),
            )}
          </Stagger>

          <Stagger className="mt-16 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="card-lift h-full rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <span className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </span>
                  <p className="mt-4 leading-relaxed text-foreground">“{t.quote}”</p>
                  <p className="mt-6 font-display font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export default SuccessStories;
