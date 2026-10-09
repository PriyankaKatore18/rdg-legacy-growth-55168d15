import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shared/ProductCard";
import { categories, featuredOfferings, products } from "@/data/site";
import productsImage from "@/assets/products.jpg";

const title = "Products — Ayurvedic, Organic, Agriculture & Daily Essentials | RDG";
const description =
  "Browse 500+ RDG Future Way products across ayurvedic, pharmacy, organic foods, agriculture, personal care, home care and daily essentials with DP, MRP and PV/BV details.";

function Products() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (active === "All" || p.category === active) &&
          p.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, active],
  );

  const chips = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Everything your family needs, direct from the company"
        description="Distributor price, customer price and PV/BV points are published on every product — so you always know exactly what you pay and what you earn."
      />

      <section className="pb-4">
        <div className="container-x">
          <img
            src={productsImage}
            alt="RDG wellness products and natural ingredients"
            width={1280}
            height={960}
            className="h-64 w-full rounded-[2rem] object-cover shadow-card md:h-80"
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="container-x">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Featured from the RDG material
            </p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">
              Products and packages people ask about
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore the Anmol Ratan wellness drink and the published package and recognition
              plans. Final pricing, eligibility and availability should always be confirmed with
              RDG.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredOfferings.map((offering) => (
              <article
                key={offering.name}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="bg-brand inline-flex rounded-full px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                  {offering.category}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {offering.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {offering.description}
                </p>
                <p className="mt-5 border-t border-border pt-4 text-xs font-semibold text-primary">
                  {offering.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex flex-1 items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-soft">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
                className="w-full bg-transparent text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  active === c
                    ? "bg-brand rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground"
                    : "rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                }
              >
                {c}
              </button>
            ))}
          </div>

          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
          {filtered.length === 0 && (
            <p className="mt-16 text-center text-muted-foreground">
              No products match that search.
            </p>
          )}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <h2 className="text-2xl font-bold text-foreground">All categories</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="card-lift rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">{c.name}</h3>
                  <span className="text-xs text-muted-foreground">{c.items} items</span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
