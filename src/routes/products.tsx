import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SectionHeading } from "@/components/layout/PageHeader";
import { ProductVisual } from "@/components/shared/ProductCard";
import { products } from "@/data/site";
import { getPublicProducts } from "@/lib/cms";
import productsBreadcrumbImage from "@/assets/products-breadcrumb.png";

const labelBenefits = [
  {
    icon: ShieldCheck,
    title: "Everyday immunity support",
    description: "Presented on the label as a wellness drink for daily family routines.",
  },
  {
    icon: Sparkles,
    title: "Antioxidant-rich positioning",
    description: "The berry blend is positioned as a naturally vibrant, antioxidant-rich choice.",
  },
  {
    icon: HeartPulse,
    title: "Digestive wellness",
    description: "A refreshing herbal blend designed to fit into a balanced lifestyle.",
  },
  {
    icon: Leaf,
    title: "Herbal and natural focus",
    description: "The product communication centres on a herbal, fruit-forward formulation.",
  },
];

const productDetails = [
  ["Product", "Anmol Ratan Juice"],
  ["Type", "Herbal & mixed berry juice"],
  ["Positioning", "100% natural, as shown on the provided label"],
  ["Pack details", "Refer to the current pack for size, ingredients and batch information"],
];

function Products() {
  const [activeCategory, setActiveCategory] = useState("All Collections");
  const [catalogProducts, setCatalogProducts] = useState(products);
  useEffect(() => {
    getPublicProducts().then((data) => {
      if (data) {
        setCatalogProducts(
          data.map((item) => ({
            id: String(item.id),
            name: item.name,
            category: item.category || "RDG Product",
            subtitle: item.subtitle || "Discover the RDG product range.",
            description: item.description || "",
            highlights: item.highlights || [],
            badge: item.name === "Anmol Ratan Juice" ? "Signature Product" : "RDG Product",
          })),
        );
      }
    });
  }, []);
  const product = catalogProducts[0] ?? products[0]!;
  const catalogItems = useMemo(
    () =>
      catalogProducts.map((item) => ({
        ...item,
        icon: Sparkles,
        visual: true,
      })),
    [catalogProducts],
  );
  const categories = [
    "All Collections",
    ...Array.from(new Set(catalogItems.map((item) => item.category))),
  ];
  const visibleItems = useMemo(
    () =>
      activeCategory === "All Collections"
        ? catalogItems
        : catalogItems.filter((item) => item.category === activeCategory),
    [activeCategory, catalogItems],
  );

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white sm:h-[clamp(390px,29vw,560px)]">
        <img
          src={productsBreadcrumbImage}
          alt="Products for wellness and opportunity"
          width={2066}
          height={761}
          className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover sm:object-center"
        />
      </section>

      <section className="pb-16">
        <div className="container-x">
          <div className="rounded-[2rem] border border-border bg-card p-4 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  Browse categories
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Find what fits your journey
                </h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                Wellness products, business packages and recognition milestones are organised in one
                place.
              </p>
            </div>

            <div
              className="mt-6 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Product categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                    activeCategory === category
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.id}
                  className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
                >
                  {item.visual ? (
                    <ProductVisual compact />
                  ) : (
                    <div className="bg-gradient-to-br from-primary/10 via-accent to-secondary/10 flex h-52 items-center justify-center">
                      <span className="bg-brand flex h-20 w-20 items-center justify-center rounded-3xl text-primary-foreground shadow-card">
                        <Icon className="h-9 w-9" />
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <span className="bg-gold-grad inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold text-gold-foreground">
                      {item.badge}
                    </span>
                    <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-foreground/75">{item.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                      {item.highlights.slice(0, 3).map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/contact"
                      className="bg-brand mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
                    >
                      Buy this <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-card">
            <ProductVisual />
          </div>
          <div>
            <span className="bg-gold-grad inline-flex rounded-full px-4 py-2 text-xs font-bold tracking-wide text-gold-foreground uppercase">
              {product.badge}
            </span>
            <p className="mt-5 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              {product.category}
            </p>
            <h2 className="mt-3 text-4xl leading-tight font-bold text-foreground md:text-5xl">
              A bright berry blend for your daily routine
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <span className="text-sm leading-relaxed text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="bg-brand inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5"
              >
                Enquire about Anmol Ratan <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="/become-distributor"
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
              >
                Become a distributor <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Current pack size, price, availability and complete ingredient information should be
              confirmed with RDG before purchase.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Label highlights"
            title="What makes Anmol Ratan Juice special"
            description="These are the wellness themes communicated on the product material. They are presented for product education and are not a substitute for medical advice."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {labelBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="card-lift rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="bg-gold-grad flex h-12 w-12 items-center justify-center rounded-2xl text-gold-foreground">
                  <benefit.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Product information"
              title="Everything you need before you order"
              description="We keep the product story clear and the purchasing details transparent. Ask the RDG team for the latest pack and pricing information."
            />
            <dl className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              {productDetails.map(([term, detail]) => (
                <div key={term} className="grid gap-2 px-6 py-5 sm:grid-cols-[10rem_1fr] sm:gap-5">
                  <dt className="text-sm font-semibold text-primary">{term}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-primary/15 bg-accent/50 p-7">
            <h3 className="font-display text-xl font-semibold text-foreground">How to enjoy it</h3>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <span className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                  1
                </span>
                Follow the serving instructions printed on the current pack.
              </li>
              <li className="flex gap-3">
                <span className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                  2
                </span>
                Store and refrigerate only as directed on the label.
              </li>
              <li className="flex gap-3">
                <span className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                  3
                </span>
                Enjoy as part of a balanced diet and healthy lifestyle.
              </li>
            </ol>
            <p className="mt-6 border-t border-primary/10 pt-5 text-xs leading-relaxed text-muted-foreground">
              This product page describes the label positioning and is not intended to diagnose,
              treat, cure or prevent any disease. Consult a qualified healthcare professional for
              personal dietary or medical guidance.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container-x">
          <div className="bg-brand relative overflow-hidden rounded-[2.5rem] px-8 py-14 text-center text-primary-foreground shadow-lift md:px-16">
            <div className="bg-gold-grad absolute -top-24 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl" />
            <p className="relative text-xs font-semibold tracking-[0.22em] text-gold uppercase">
              Ready to know more?
            </p>
            <h2 className="relative mx-auto mt-3 max-w-2xl text-3xl font-bold md:text-4xl">
              Bring Anmol Ratan Juice into your wellness routine
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Connect with RDG for the current pack details, availability and distributor enquiry.
            </p>
            <a
              href="/contact"
              className="bg-gold-grad relative mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-gold-foreground shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Contact RDG <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
