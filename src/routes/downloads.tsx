import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { downloads } from "@/data/site";

const title = "Download Center — Brochure, Catalogue, Income Plan & Forms | RDG";
const description =
  "Download the RDG Future Way company brochure, product catalogue, generation income plan, price list, application form and training material.";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Downloads,
});

function Downloads() {
  return (
    <>
      <PageHeader
        eyebrow="Download Center"
        title="Every document you need, in one place"
        description="Share these with prospects, print them for meetings or keep them on your phone for field work."
      />

      <section className="py-16">
        <div className="container-x">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map((d) => (
              <StaggerItem key={d.title}>
                <div className="card-lift flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <span className="bg-leaf flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-secondary-foreground">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-foreground">{d.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.type} • {d.size}
                    </p>
                  </div>
                  <button
                    aria-label={`Download ${d.title}`}
                    className="bg-brand flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground"
                  >
                    <Download className="h-4 w-4" />
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