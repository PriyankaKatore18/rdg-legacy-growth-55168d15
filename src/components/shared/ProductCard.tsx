import { Eye, Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/data/site";

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.mrp - product.cp) / product.mrp) * 100);
  return (
    <article className="card-lift group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <div className="relative aspect-4/3 overflow-hidden bg-surface">
        <div className="bg-leaf absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-15 blur-2xl" />
        <div className="bg-brand absolute -top-12 right-0 h-40 w-40 rounded-full opacity-15 blur-2xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl font-bold text-primary/15 transition-transform duration-500 group-hover:scale-110">
            RDG
          </span>
        </div>
        {product.badge && (
          <span className="bg-gold-grad absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-semibold text-gold-foreground">
            {product.badge}
          </span>
        )}
        <span className="absolute top-4 right-4 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-secondary-foreground">
          {discount}% off
        </span>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 p-4 transition-transform duration-300 group-hover:translate-y-0">
          <button className="bg-brand flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs font-semibold text-primary-foreground">
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </button>
          <button aria-label="Quick view" className="glass flex h-10 w-10 items-center justify-center rounded-full text-primary">
            <Eye className="h-4 w-4" />
          </button>
          <button aria-label="Wishlist" className="glass flex h-10 w-10 items-center justify-center rounded-full text-primary">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium tracking-wide text-primary uppercase">{product.category}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {product.rating}
          </span>
        </div>
        <h3 className="mt-2 font-display text-base leading-snug font-semibold text-foreground">
          {product.name}
        </h3>
        <div className="mt-4 flex items-end gap-2">
          <span className="font-display text-xl font-bold text-foreground">₹{product.cp}</span>
          <span className="text-sm text-muted-foreground line-through">₹{product.mrp}</span>
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-surface p-3 text-center text-[11px]">
          <div>
            <dt className="text-muted-foreground">DP</dt>
            <dd className="font-semibold text-foreground">₹{product.dp}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">PV</dt>
            <dd className="font-semibold text-foreground">{product.pv}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">BV</dt>
            <dd className="font-semibold text-foreground">{product.bv}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}