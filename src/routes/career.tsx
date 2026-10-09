import { Briefcase, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const title = "Career at RDG Future Way — Join Our Team";
const description =
  "Explore openings at RDG Future Way across sales, production, quality, logistics and digital marketing in Indore and regional offices.";

const jobs = [
  { role: "Regional Sales Manager", city: "Indore", type: "Full-time" },
  { role: "Ayurvedic Product Formulator", city: "Indore", type: "Full-time" },
  { role: "Quality Assurance Executive", city: "Bhopal", type: "Full-time" },
  { role: "Digital Marketing Specialist", city: "Remote", type: "Full-time" },
  { role: "Warehouse & Logistics Lead", city: "Nagpur", type: "Full-time" },
  { role: "Distributor Support Executive", city: "Jaipur", type: "Full-time" },
];

function Career() {
  return (
    <>
      <PageHeader
        eyebrow="Career"
        title="Build a company that builds people"
        description="We hire for ownership and honesty. If you want your work to reach lakhs of households, we should talk."
      />
      <section className="py-16">
        <div className="container-x">
          <Stagger className="grid gap-5 md:grid-cols-2">
            {jobs.map((j) => (
              <StaggerItem key={j.role}>
                <div className="card-lift flex h-full flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft sm:flex-nowrap sm:gap-5 sm:p-6">
                  <span className="bg-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold text-foreground">{j.role}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {j.city} • {j.type}
                    </p>
                  </div>
                  <button className="shrink-0 rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary hover:bg-accent">
                    Apply
                  </button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export default Career;
