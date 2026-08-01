import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Ticket, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { events } from "@/data/site";

const title = "Events — Seminars, Business Meets & Product Launches | RDG";
const description =
  "Upcoming RDG Future Way seminars, business meetings, product launches and recognition nights across India. Register your seat online.";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Events,
});

function daysLeft(date: string) {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000);
  return diff > 0 ? `${diff} days to go` : "Registrations closed";
}

function Events() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Where the business comes alive"
        description="Seminars, launches and recognition nights are where distributors learn fastest. Seats are allocated first-come, first-served."
      />

      <section className="py-16">
        <div className="container-x">
          <Stagger className="grid gap-6 md:grid-cols-2">
            {events.map((e) => (
              <StaggerItem key={e.title}>
                <div className="card-lift h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                  <div className="bg-brand flex items-center justify-between px-7 py-5 text-primary-foreground">
                    <span className="font-display text-sm font-semibold">{e.type}</span>
                    <span className="bg-gold-grad rounded-full px-3 py-1 text-[11px] font-bold text-gold-foreground">
                      {daysLeft(e.date)}
                    </span>
                  </div>
                  <div className="p-7">
                    <h2 className="font-display text-xl font-semibold text-foreground">{e.title}</h2>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        {new Date(e.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> {e.city}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" /> {e.seats} seats
                      </span>
                    </div>
                    <button className="bg-brand mt-6 rounded-full px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                      Register now
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}