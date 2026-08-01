import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { posts } from "@/data/site";

const title = "Blog — Health Tips, Business Tips, Agriculture & Wellness | RDG";
const description =
  "Practical articles from RDG Future Way on ayurvedic health, direct selling business growth, agriculture, wellness, lifestyle and company news.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const list = posts.filter(
    (p) => (cat === "All" || p.category === cat) && p.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Ideas that grow health and income"
        description="Written by our product team, agronomists and top-performing distributors."
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_16rem]">
          <div>
            <Stagger className="grid gap-6 md:grid-cols-2">
              {list.map((p) => (
                <StaggerItem key={p.slug}>
                  <article className="card-lift h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
                    <div className="bg-brand h-40 opacity-90" />
                    <div className="p-6">
                      <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-semibold text-primary">
                        {p.category}
                      </span>
                      <h2 className="mt-3 font-display text-lg leading-snug font-semibold text-foreground">
                        {p.title}
                      </h2>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {new Date(p.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        • {p.read} min read
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
            {list.length === 0 && <p className="text-muted-foreground">No articles found.</p>}
          </div>

          <aside className="space-y-8">
            <label className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 shadow-soft">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles"
                aria-label="Search articles"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
            <div>
              <h2 className="font-display text-sm font-semibold tracking-widest text-primary uppercase">
                Categories
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={
                      cat === c
                        ? "bg-brand rounded-full px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                        : "rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}