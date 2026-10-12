import { ArrowRight } from "lucide-react";
import bottleImage from "@/assets/anmol-ratan-juice-bottle.png";
import type { Product } from "@/data/site";

export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f7fbe9] via-[#fff7d6] to-[#d7eff7] ${compact ? "min-h-64" : "min-h-[30rem]"}`}
      aria-label="Anmol Ratan Juice bottle with mixed berries"
    >
      <div className="absolute -top-12 -right-10 h-44 w-44 rounded-full bg-[#a8d66d]/40 blur-3xl" />
      <div className="absolute -bottom-14 -left-8 h-48 w-48 rounded-full bg-[#e8a72d]/25 blur-3xl" />
      <img
        src={bottleImage}
        alt="Anmol Ratan Juice herbal and mixed berry juice bottle"
        width={1024}
        height={1536}
        className={`relative w-auto object-contain drop-shadow-2xl ${compact ? "h-60" : "h-[29rem]"}`}
      />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card-sheen group overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <ProductVisual compact />
      <div className="p-6">
        <span className="bg-gold-grad inline-flex rounded-full px-3 py-1 text-[11px] font-semibold text-gold-foreground">
          {product.badge}
        </span>
        <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          {product.category}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.subtitle}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {product.highlights.slice(0, 2).map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              {highlight}
            </li>
          ))}
        </ul>
        <a
          href="/products"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          View product details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
