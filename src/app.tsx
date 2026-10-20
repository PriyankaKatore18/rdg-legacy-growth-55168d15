import { Component, type ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import Home from "@/routes/index";
import About from "@/routes/about";
import Blog from "@/routes/blog";
import BusinessOpportunity from "@/routes/business-opportunity";
import Career from "@/routes/career";
import Contact from "@/routes/contact";
import BecomeDistributor from "@/routes/become-distributor";
import Downloads from "@/routes/downloads";
import Events from "@/routes/events";
import Faqs from "@/routes/faqs";
import Franchise from "@/routes/franchise";
import Gallery from "@/routes/gallery";
import GenerationPlan from "@/routes/generation-plan";
import IncomeCalculator from "@/routes/income-calculator";
import Products from "@/routes/products";
import PrivacyPolicy from "@/routes/privacy-policy";
import RefundPolicy from "@/routes/refund-policy";
import ShippingPolicy from "@/routes/shipping-policy";
import SuccessStories from "@/routes/success-stories";
import Terms from "@/routes/terms";
import Cart from "@/routes/cart";
import Checkout from "@/routes/checkout";
import CustomerAuth from "@/routes/customer-auth";
import CustomerOrders from "@/routes/customer-orders";
import DistributorAuth from "@/routes/distributor-auth";
import DistributorDashboard from "@/routes/distributor-dashboard";
import ProductDetail from "@/routes/product-detail";
import { LanguageProvider } from "@/lib/i18n";
import { AdminDashboard, AdminLogin } from "@/routes/admin";

const pages: Record<string, React.ComponentType> = {
  "/": Home,
  "/about": About,
  "/blog": Blog,
  "/business-opportunity": BusinessOpportunity,
  "/career": Career,
  "/contact": Contact,
  "/become-distributor": BecomeDistributor,
  "/downloads": Downloads,
  "/events": Events,
  "/faqs": Faqs,
  "/franchise": Franchise,
  "/gallery": Gallery,
  "/generation-plan": GenerationPlan,
  "/income-calculator": IncomeCalculator,
  "/products": Products,
  "/cart": Cart,
  "/checkout": Checkout,
  "/customer/login": CustomerAuth,
  "/account/orders": CustomerOrders,
  "/distributor/login": DistributorAuth,
  "/distributor/dashboard": DistributorDashboard,
  "/privacy-policy": PrivacyPolicy,
  "/refund-policy": RefundPolicy,
  "/shipping-policy": ShippingPolicy,
  "/success-stories": SuccessStories,
  "/terms": Terms,
  "/admin/login": AdminLogin,
  "/admin/dashboard": AdminDashboard,
};

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.error("Application error", error);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn&apos;t load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. Try refreshing or head back home.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export function App() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, "") || "/");

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname.replace(/\/$/, "") || "/");
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const Page = pages[path] ?? (path.startsWith("/products/") ? ProductDetail : NotFound);
  const isAdmin = path.startsWith("/admin");

  if (isAdmin) {
    return (
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AppErrorBoundary>
        <SmoothScroll />
        <Navbar />
        <main>
          <Page />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </AppErrorBoundary>
    </LanguageProvider>
  );
}
