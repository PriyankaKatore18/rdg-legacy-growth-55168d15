import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductVisual } from "@/components/shared/ProductCard";
import { products } from "@/data/site";
import { getPublicProducts, type PublicProduct } from "@/lib/cms";
import { addToCustomerCart } from "@/lib/customer-api";

const money = (value: number | null | undefined) =>
  value === null || value === undefined || Number.isNaN(Number(value))
    ? "Price available on request"
    : `₹${Number(value).toLocaleString("en-IN")}`;

function ProductDetail() {
  const slug = typeof window === "undefined" ? "" : window.location.pathname.split("/").pop() || "";
  const [product, setProduct] = useState<(PublicProduct & { badge?: string }) | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProducts()
      .then((items) => {
        const fallback = products.find((item) => item.id === slug || item.name === slug);
        const mapped = (items || []).find((item) => item.slug === slug);
        setProduct(
          mapped
            ? {
                ...mapped,
                badge: mapped.name === "Anmol Ratan Juice" ? "Signature Product" : "RDG Product",
              }
            : fallback
              ? {
                  ...fallback,
                  slug: fallback.id,
                  price: null,
                  imageUrl: null,
                  id: fallback.id,
                }
              : null,
        );
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function addToCart() {
    if (!product || typeof product.id !== "number") {
      setError("This product is not available for online ordering yet.");
      return;
    }
    try {
      setAdding(true);
      setError("");
      await addToCustomerCart(product.id, quantity);
      setAdded(true);
    } catch (reason) {
      if ((reason as Error & { status?: number }).status === 401) {
        window.location.href = `/customer/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      setError(
        reason instanceof Error ? reason.message : "Unable to add this product to your cart.",
      );
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="container-x py-32 text-center text-muted-foreground">Loading product…</div>
    );
  }

  if (!product) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <a href="/products" className="mt-5 inline-flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </a>
      </div>
    );
  }

  const hasUploadedImage = Boolean(product.imageUrl && !product.imageUrl.startsWith("/src/"));

  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="container-x">
        <a
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all products
        </a>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
            {hasUploadedImage ? (
              <img
                src={product.imageUrl!}
                alt={product.name}
                className="h-[32rem] w-full object-contain p-8"
              />
            ) : (
              <ProductVisual />
            )}
          </div>
          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-card sm:p-10">
            <span className="bg-gold-grad inline-flex rounded-full px-4 py-2 text-xs font-bold text-gold-foreground uppercase">
              {product.badge || "RDG Product"}
            </span>
            <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              {product.category || "RDG wellness product"}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight font-bold text-foreground">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.subtitle}</p>
            <p className="mt-6 text-3xl font-bold text-primary">{money(product.price)}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-full border border-border bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="p-3 text-primary"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  className="p-3 text-primary"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => void addToCart()}
                disabled={adding}
                className="bg-brand inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-card disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" /> {adding ? "Adding…" : "Add to cart"}
              </button>
              <a
                href="/customer/login"
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-5 py-3.5 text-sm font-semibold text-primary"
              >
                <UserRound className="h-4 w-4" /> Customer login
              </a>
            </div>

            {added && (
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary">
                <span>Added to your customer cart.</span>
                <a href="/cart" className="underline">
                  View cart
                </a>
              </div>
            )}
            {error && (
              <p className="mt-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-9 border-t border-border pt-7">
              <h2 className="font-display text-xl font-bold">Product information</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>
              <ul className="mt-6 space-y-3">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Secure customer cart", "Your cart is stored separately for your customer account."],
            ["Order support", "Confirm current price, pack size and delivery details with RDG."],
            [
              "Product care",
              "Follow the serving and storage instructions printed on the current pack.",
            ],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
