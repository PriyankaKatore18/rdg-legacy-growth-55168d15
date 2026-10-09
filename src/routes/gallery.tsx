import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { galleryItems } from "@/data/site";

const title = "Gallery — Events, Training, Office & CSR | RDG Future Way";
const description =
  "Photos and videos from RDG Future Way events, distributor training camps, corporate offices, manufacturing units and CSR activities.";

const tags = ["All", "Events", "Training", "Office", "CSR", "Rewards"];

function Gallery() {
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const items = galleryItems.filter((g) => tag === "All" || g.tag === tag);

  return (
    <>
      <PageHeader
        eyebrow="Media Gallery"
        title="Moments from the RDG movement"
        description="Stages, training halls, factory floors and plantation drives — the everyday work behind the brand."
      />

      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={
                  tag === t
                    ? "bg-brand rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent"
                }
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <motion.button
                key={item.title}
                onClick={() => setOpen(item.title)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.05 }}
                className="card-lift group mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl border border-border bg-card text-left shadow-soft"
              >
                <div
                  className={`bg-brand relative ${i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-48" : "h-56"} opacity-90 transition-transform duration-500 group-hover:scale-105`}
                />
                <div className="p-5">
                  <p className="font-display text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.tag}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-100 flex items-center justify-center bg-foreground/70 p-3 backdrop-blur sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-card"
            >
              <div className="bg-brand h-56 sm:h-80" />
              <p className="p-4 font-display font-semibold text-foreground sm:p-6">{open}</p>
              <button
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="glass absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Gallery;
