import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Expand } from "lucide-react";
import galleryBreadcrumbImage from "@/assets/gallery-breadcrumb.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { galleryItems } from "@/data/gallery";

type GalleryItem = { title: string; tag: string; image: string; alt: string };

function Gallery() {
  const [tag, setTag] = useState("All");
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<GalleryItem[]>([...galleryItems]);
  useEffect(() => {
    fetch("/api/public/gallery")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.success && payload.data?.length) {
          setItems(
            payload.data.map(
              (item: { title: string; tag: string; imageUrl: string; altText?: string }) => ({
                title: item.title,
                tag: item.tag,
                image: item.imageUrl,
                alt: item.altText || item.title,
              }),
            ),
          );
        }
      })
      .catch(() => undefined);
  }, []);
  const tags = ["All", ...Array.from(new Set(items.map((item) => item.tag)))];
  const filteredItems = items.filter((g) => tag === "All" || g.tag === tag);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white sm:h-[clamp(390px,29vw,560px)]">
        <img
          src={galleryBreadcrumbImage}
          alt="Media Gallery"
          width={2048}
          height={760}
          className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover sm:object-center"
        />
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div
              role="group"
              aria-label="Filter gallery by category"
              className="flex flex-wrap gap-2"
            >
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tag === t}
                  onClick={() => setTag(t)}
                  className={
                    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
                    (tag === t
                      ? "bg-brand rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
                      : "rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {filteredItems.length} {filteredItems.length === 1 ? "photo" : "photos"}
            </p>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            AI-generated sample images for illustration. Select a photo to view it in full.
          </p>

          <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filteredItems.map((item, i) => (
              <Dialog key={item.title}>
                <DialogTrigger asChild>
                  <motion.button
                    type="button"
                    aria-label={"View " + item.title}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 6) * 0.05 }}
                    className="card-lift group mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl border border-border bg-card text-left shadow-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <div
                      className={
                        "relative overflow-hidden bg-muted " +
                        (i % 3 === 0 ? "h-72" : i % 3 === 1 ? "h-52" : "h-60")
                      }
                    >
                      <img
                        src={item.image}
                        alt={item.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <span
                        className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-dark/75 text-white shadow-soft backdrop-blur-sm"
                        aria-hidden="true"
                      >
                        <Expand className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="font-display text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.tag}</p>
                    </div>
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl gap-0 overflow-y-auto rounded-3xl border-0 p-0 sm:rounded-3xl [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-white [&>button]:text-primary-dark [&>button]:opacity-100 [&>button]:shadow-card">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="max-h-[70dvh] w-full bg-primary-dark object-contain"
                  />
                  <div className="p-5 sm:p-6">
                    <DialogTitle className="font-display">{item.title}</DialogTitle>
                    <DialogDescription className="mt-2">
                      {item.tag} - AI-generated sample image
                    </DialogDescription>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Gallery;
