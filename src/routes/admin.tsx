/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Package,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

type User = { id: number; name: string; email: string; role: string };
type Tab =
  | "dashboard"
  | "pages"
  | "banners"
  | "products"
  | "blog"
  | "enquiries"
  | "media"
  | "settings"
  | "activity";
type RecordItem = Record<string, any>;

async function api(path: string, options: RequestInit = {}) {
  const response = await fetch(path, { credentials: "include", ...options });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false)
    throw new Error(payload.error || "Request failed.");
  return payload.data;
}

const buttonPrimary =
  "bg-brand inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5";
const buttonSecondary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent";
const fieldClass =
  "mt-1.5 w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@rdgfutureway.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      window.location.href = "/admin/dashboard";
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-card lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-brand relative hidden overflow-hidden p-10 text-white lg:block">
          <div className="bg-gold-grad absolute -top-28 -right-20 h-80 w-80 rounded-full opacity-25 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
                  RDG
                </span>
                <div>
                  <p className="font-display text-lg font-bold">RDG Future Way</p>
                  <p className="text-xs text-white/70">Content management system</p>
                </div>
              </div>
              <h1 className="mt-20 max-w-sm font-display text-4xl leading-tight font-bold">
                Manage the website with confidence.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
                Publish pages, products, banners and articles. Track enquiries and keep every update
                in one secure workspace.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-2 text-sm text-white/75">
              <ShieldCheck className="h-4 w-4 text-gold" /> Secure administrator access
            </div>
          </div>
        </div>
        <div className="p-7 sm:p-12">
          <div className="mb-10 lg:hidden">
            <p className="font-display text-xl font-bold text-primary-dark">RDG Future Way</p>
            <p className="mt-1 text-xs text-muted-foreground">Admin CMS</p>
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Administrator access
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in to manage your public website content.
          </p>
          <form className="mt-8 space-y-5" onSubmit={submit}>
            <label className="block text-sm font-semibold text-foreground">
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="username"
                className={fieldClass}
                required
              />
            </label>
            <label className="block text-sm font-semibold text-foreground">
              Password
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                required
              />
            </label>
            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <button className={`${buttonPrimary} w-full`} disabled={loading}>
              {loading ? "Signing in…" : "Sign in to dashboard"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
          <a
            href="/"
            className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            ← Back to public website
          </a>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => {
        window.location.href = "/admin/login";
      });
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/admin/login";
  }

  const navigation: { id: Tab; label: string; icon: typeof LayoutDashboard; group: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
    { id: "pages", label: "Website Pages", icon: FileText, group: "Content" },
    { id: "banners", label: "Hero Banners", icon: ImageIcon, group: "Content" },
    { id: "products", label: "Products", icon: Package, group: "Content" },
    { id: "blog", label: "Blog / Insights", icon: Newspaper, group: "Content" },
    { id: "enquiries", label: "Contact Enquiries", icon: Users, group: "Operations" },
    { id: "media", label: "Media Library", icon: Upload, group: "Operations" },
    { id: "settings", label: "Website Settings", icon: Settings2, group: "System" },
    { id: "activity", label: "Activity Logs", icon: Activity, group: "System" },
  ];

  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f8fc] text-sm text-muted-foreground">
        Loading secure workspace…
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-primary-dark text-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <a href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold">
                RDG
              </span>
              <span>
                <span className="block font-display font-bold">RDG Future Way</span>
                <span className="block text-[11px] text-white/55">Admin CMS</span>
              </span>
            </a>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-6 flex-1 space-y-6 overflow-y-auto">
            {Array.from(new Set(navigation.map((item) => item.group))).map((group) => (
              <div key={group}>
                <p className="px-3 text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase">
                  {group}
                </p>
                <div className="mt-2 space-y-1">
                  {navigation
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setTab(item.id);
                            setSidebarOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${tab === item.id ? "bg-white/12 font-semibold text-white" : "text-white/65 hover:bg-white/8 hover:text-white"}`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </nav>
          <div className="border-t border-white/10 pt-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/7 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-grad text-xs font-bold text-gold-foreground">
                {user.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-white/50">{user.role.replace("_", " ")}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/8 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-primary-dark/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <main className="min-h-screen lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl border border-border p-2 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                RDG control center
              </p>
              <h1 className="mt-1 font-display text-xl font-bold">
                {navigation.find((item) => item.id === tab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className={buttonSecondary}>
              View website <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </header>
        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {tab === "dashboard" && <DashboardView onNavigate={setTab} />}
          {tab === "pages" && <PagesView setError={setError} />}
          {tab === "banners" && <BannersView setError={setError} />}
          {tab === "products" && <ProductsView setError={setError} />}
          {tab === "blog" && <BlogView setError={setError} />}
          {tab === "enquiries" && <EnquiriesView setError={setError} />}
          {tab === "media" && <MediaView setError={setError} />}
          {tab === "settings" && <SettingsView setError={setError} />}
          {tab === "activity" && <ActivityView setError={setError} />}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api("/api/admin/dashboard")
      .then(setData)
      .catch(() => undefined);
  }, []);
  if (!data) return <Loading />;
  const cards = [
    {
      label: "Published pages",
      value: data.metrics.publishedPages,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Draft pages",
      value: data.metrics.draftPages,
      icon: BarChart3,
      color: "text-gold-foreground",
    },
    {
      label: "Published products",
      value: data.metrics.products,
      icon: Package,
      color: "text-secondary",
    },
    {
      label: "Unread enquiries",
      value: data.metrics.unreadEnquiries,
      icon: Users,
      color: "text-destructive",
    },
  ];
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">
            Good to see you. Here is your website at a glance.
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold">Good morning, admin.</h2>
        </div>
        <button onClick={() => onNavigate("pages")} className={buttonPrimary}>
          <Plus className="h-4 w-4" />
          Create page
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-accent ${color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs text-muted-foreground">Live data</span>
            </div>
            <p className="mt-6 font-display text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Quick actions</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Jump into the areas you use most.
              </p>
            </div>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Manage pages", tab: "pages" as Tab, icon: FileText },
              { label: "Manage hero banners", tab: "banners" as Tab, icon: ImageIcon },
              { label: "Review enquiries", tab: "enquiries" as Tab, icon: Users },
              { label: "Update global settings", tab: "settings" as Tab, icon: Settings2 },
            ].map(({ label, tab, icon: Icon }) => (
              <button
                key={tab}
                onClick={() => onNavigate(tab)}
                className="flex items-center gap-3 rounded-xl border border-border p-4 text-left transition hover:border-primary/35 hover:bg-accent"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">{label}</span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold">Recent activity</h3>
              <p className="mt-1 text-sm text-muted-foreground">Latest administrative changes.</p>
            </div>
            <button
              onClick={() => onNavigate("activity")}
              className="text-xs font-semibold text-primary"
            >
              View all
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {data.recent.length ? (
              data.recent.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl bg-surface p-3">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize">
                      {item.action} {item.entityType.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState label="No activity yet." />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function PagesView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [search, setSearch] = useState("");
  const blank = {
    title: "",
    slug: "",
    description: "",
    body: "",
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    showInNav: false,
  };
  const [form, setForm] = useState<RecordItem>(blank);
  const load = () =>
    api(`/api/admin/pages?q=${encodeURIComponent(search)}`)
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [search]);
  function open(item?: RecordItem) {
    setEditing(item || null);
    setForm(
      item
        ? {
            ...item,
            seoTitle: item.seo_title || item.seoTitle || "",
            seoDescription: item.seo_description || item.seoDescription || "",
            showInNav: Boolean(item.show_in_nav ?? item.showInNav),
          }
        : blank,
    );
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      await api(editing ? `/api/admin/pages/${editing.id}` : "/api/admin/pages", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this page?")) return;
    try {
      await api(`/api/admin/pages/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Website pages"
      description="Manage publishable page records, navigation visibility and page SEO."
      action={
        <button onClick={() => open()} className={buttonPrimary}>
          <Plus className="h-4 w-4" />
          Add page
        </button>
      }
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages…"
            className={`${fieldClass} mt-0 pl-9`}
          />
        </div>
      </div>
      {editing !== null && (
        <Editor title={editing ? "Edit page" : "New page"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
              required
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(value) => setForm({ ...form, slug: value })}
              required
            />
            <TextField
              label="Short description"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              wide
            />
            <SelectField
              label="Status"
              value={form.status}
              options={["draft", "published"]}
              onChange={(value) => setForm({ ...form, status: value })}
            />
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) => setForm({ ...form, showInNav: e.target.checked })}
              />
              Show in navigation
            </label>
            <TextAreaField
              label="Body content"
              value={form.body}
              onChange={(value) => setForm({ ...form, body: value })}
              wide
              rows={6}
            />
            <TextField
              label="SEO title"
              value={form.seoTitle}
              onChange={(value) => setForm({ ...form, seoTitle: value })}
            />
            <TextField
              label="SEO description"
              value={form.seoDescription}
              onChange={(value) => setForm({ ...form, seoDescription: value })}
            />
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className={buttonPrimary}>Save page</button>
            </div>
          </form>
        </Editor>
      )}
      <DataTable headers={["Title", "Slug", "Status", "Updated", "Actions"]}>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-border">
            <td className="px-4 py-4 font-semibold">{item.title}</td>
            <td className="px-4 py-4 text-sm text-muted-foreground">/{item.slug}</td>
            <td className="px-4 py-4">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {new Date(item.updated_at || item.updatedAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-4">
              <RowActions onEdit={() => open(item)} onDelete={() => remove(item.id)} />
            </td>
          </tr>
        ))}
      </DataTable>
    </ModuleShell>
  );
}

function BannersView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const blank = {
    title: "",
    subtitle: "",
    description: "",
    ctaLabel: "",
    ctaUrl: "",
    imageUrl: "",
    mobileImageUrl: "",
    altText: "",
    sortOrder: 0,
    active: true,
  };
  const [form, setForm] = useState<RecordItem>(blank);
  const load = () =>
    api("/api/admin/banners")
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  function open(item?: RecordItem) {
    setEditing(item || {});
    setForm(item || blank);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      await api(editing?.id ? `/api/admin/banners/${editing.id}` : "/api/admin/banners", {
        method: editing?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this banner?")) return;
    try {
      await api(`/api/admin/banners/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Hero banners"
      description="Control the active hero slides and their calls to action."
      action={
        <button onClick={() => open()} className={buttonPrimary}>
          <Plus className="h-4 w-4" />
          Add banner
        </button>
      }
    >
      {editing && (
        <Editor title={editing.id ? "Edit banner" : "New banner"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
              required
            />
            <TextField
              label="Subtitle"
              value={form.subtitle}
              onChange={(value) => setForm({ ...form, subtitle: value })}
            />
            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              wide
            />
            <TextField
              label="CTA label"
              value={form.ctaLabel}
              onChange={(value) => setForm({ ...form, ctaLabel: value })}
            />
            <TextField
              label="CTA URL"
              value={form.ctaUrl}
              onChange={(value) => setForm({ ...form, ctaUrl: value })}
            />
            <TextField
              label="Desktop image URL"
              value={form.imageUrl}
              onChange={(value) => setForm({ ...form, imageUrl: value })}
              wide
            />
            <TextField
              label="Mobile image URL"
              value={form.mobileImageUrl}
              onChange={(value) => setForm({ ...form, mobileImageUrl: value })}
              wide
            />
            <TextField
              label="Image alt text"
              value={form.altText}
              onChange={(value) => setForm({ ...form, altText: value })}
            />
            <TextField
              label="Display order"
              type="number"
              value={form.sortOrder}
              onChange={(value) => setForm({ ...form, sortOrder: Number(value) })}
            />
            <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active slide
            </label>
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className={buttonPrimary}>Save banner</button>
            </div>
          </form>
        </Editor>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="flex h-40 items-center justify-center bg-surface">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <StatusBadge status={item.active ? "active" : "inactive"} />
              </div>
              <div className="mt-4 flex justify-end">
                <RowActions onEdit={() => open(item)} onDelete={() => remove(item.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}

function ProductsView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const blank = {
    name: "",
    slug: "",
    category: "",
    subtitle: "",
    description: "",
    highlightsText: "",
    price: "",
    imageUrl: "",
    status: "draft",
    sortOrder: 0,
  };
  const [form, setForm] = useState<RecordItem>(blank);
  const load = () =>
    api("/api/admin/products")
      .then((rows) => setItems(rows))
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  function open(item?: RecordItem) {
    setEditing(item || {});
    setForm(item ? { ...item, highlightsText: (item.highlights || []).join("\n") } : blank);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      await api(editing?.id ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price === "" ? null : Number(form.price),
          highlights: String(form.highlightsText || "")
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean),
        }),
      });
      setEditing(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/api/admin/products/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Products"
      description="Manage the product catalogue shown to customers and distributors."
      action={
        <button onClick={() => open()} className={buttonPrimary}>
          <Plus className="h-4 w-4" />
          Add product
        </button>
      }
    >
      {editing && (
        <Editor
          title={editing.id ? "Edit product" : "New product"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Product name"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              required
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(value) => setForm({ ...form, slug: value })}
              required
            />
            <TextField
              label="Category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(value) => setForm({ ...form, price: value })}
            />
            <TextField
              label="Subtitle"
              value={form.subtitle}
              onChange={(value) => setForm({ ...form, subtitle: value })}
              wide
            />
            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(value) => setForm({ ...form, description: value })}
              wide
            />
            <TextAreaField
              label="Highlights (one per line)"
              value={form.highlightsText}
              onChange={(value) => setForm({ ...form, highlightsText: value })}
            />
            <TextField
              label="Image URL"
              value={form.imageUrl}
              onChange={(value) => setForm({ ...form, imageUrl: value })}
            />
            <SelectField
              label="Status"
              value={form.status}
              options={["draft", "published"]}
              onChange={(value) => setForm({ ...form, status: value })}
            />
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className={buttonPrimary}>Save product</button>
            </div>
          </form>
        </Editor>
      )}
      <DataTable headers={["Product", "Category", "Price", "Status", "Actions"]}>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-border">
            <td className="px-4 py-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">/{item.slug}</p>
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">{item.category || "—"}</td>
            <td className="px-4 py-4 text-sm">
              {item.price ? `₹${Number(item.price).toLocaleString("en-IN")}` : "—"}
            </td>
            <td className="px-4 py-4">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-4">
              <RowActions onEdit={() => open(item)} onDelete={() => remove(item.id)} />
            </td>
          </tr>
        ))}
      </DataTable>
    </ModuleShell>
  );
}

function BlogView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const blank = {
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    featuredImage: "",
    imageAlt: "",
    author: "",
    category: "",
    tagsText: "",
    seoTitle: "",
    seoDescription: "",
    status: "draft",
    publishedAt: "",
  };
  const [form, setForm] = useState<RecordItem>(blank);
  const load = () =>
    api("/api/admin/blog-posts")
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  function open(item?: RecordItem) {
    setEditing(item || {});
    setForm(item ? { ...item, tagsText: (item.tags || []).join(", ") } : blank);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    try {
      await api(editing?.id ? `/api/admin/blog-posts/${editing.id}` : "/api/admin/blog-posts", {
        method: editing?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: String(form.tagsText || "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        }),
      });
      setEditing(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this article?")) return;
    try {
      await api(`/api/admin/blog-posts/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Blog / insights"
      description="Create, edit and publish articles with SEO metadata."
      action={
        <button onClick={() => open()} className={buttonPrimary}>
          <Plus className="h-4 w-4" />
          Add article
        </button>
      }
    >
      {editing && (
        <Editor
          title={editing.id ? "Edit article" : "New article"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Title"
              value={form.title}
              onChange={(value) => setForm({ ...form, title: value })}
              required
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(value) => setForm({ ...form, slug: value })}
              required
            />
            <TextField
              label="Author"
              value={form.author}
              onChange={(value) => setForm({ ...form, author: value })}
            />
            <TextField
              label="Category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
            />
            <TextAreaField
              label="Excerpt"
              value={form.excerpt}
              onChange={(value) => setForm({ ...form, excerpt: value })}
              wide
            />
            <TextAreaField
              label="Body"
              value={form.body}
              onChange={(value) => setForm({ ...form, body: value })}
              wide
              rows={8}
            />
            <TextField
              label="Featured image URL"
              value={form.featuredImage}
              onChange={(value) => setForm({ ...form, featuredImage: value })}
            />
            <TextField
              label="Image alt text"
              value={form.imageAlt}
              onChange={(value) => setForm({ ...form, imageAlt: value })}
            />
            <TextField
              label="Tags (comma-separated)"
              value={form.tagsText}
              onChange={(value) => setForm({ ...form, tagsText: value })}
            />
            <SelectField
              label="Status"
              value={form.status}
              options={["draft", "scheduled", "published"]}
              onChange={(value) => setForm({ ...form, status: value })}
            />
            <TextField
              label="SEO title"
              value={form.seoTitle}
              onChange={(value) => setForm({ ...form, seoTitle: value })}
            />
            <TextField
              label="SEO description"
              value={form.seoDescription}
              onChange={(value) => setForm({ ...form, seoDescription: value })}
            />
            <div className="flex justify-end gap-3 sm:col-span-2">
              <button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button className={buttonPrimary}>Save article</button>
            </div>
          </form>
        </Editor>
      )}
      <DataTable headers={["Article", "Category", "Status", "Updated", "Actions"]}>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-border">
            <td className="px-4 py-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">/{item.slug}</p>
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">{item.category || "—"}</td>
            <td className="px-4 py-4">
              <StatusBadge status={item.status} />
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {new Date(item.updatedAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-4">
              <RowActions onEdit={() => open(item)} onDelete={() => remove(item.id)} />
            </td>
          </tr>
        ))}
      </DataTable>
    </ModuleShell>
  );
}

function EnquiriesView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [status, setStatus] = useState("all");
  const load = () =>
    api(`/api/admin/enquiries${status === "all" ? "" : `?status=${status}`}`)
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [status]);
  async function update(item: RecordItem, next: string) {
    try {
      await api(`/api/admin/enquiries/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next, internalNotes: item.internal_notes || "" }),
      });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Contact enquiries"
      description="Review and manage enquiries from contact, distributor and franchise forms."
      action={
        <a href="/api/admin/enquiries/export" className={buttonSecondary}>
          Export CSV <ArrowUpRight className="h-4 w-4" />
        </a>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {["all", "new", "in_progress", "contacted", "closed"].map((value) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${status === value ? "bg-primary text-white" : "border border-border bg-card text-muted-foreground"}`}
          >
            {value.replace("_", " ")}
          </button>
        ))}
      </div>
      <DataTable headers={["Contact", "Type", "Message", "Status", "Received"]}>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-border">
            <td className="px-4 py-4">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.email || item.phone || "No contact details"}
              </p>
            </td>
            <td className="px-4 py-4 text-sm capitalize">{item.enquiry_type}</td>
            <td className="max-w-sm px-4 py-4 text-sm text-muted-foreground">
              {item.message || "—"}
            </td>
            <td className="px-4 py-4">
              <select
                value={item.status}
                onChange={(e) => update(item, e.target.value)}
                className="rounded-lg border border-border bg-card px-2 py-2 text-xs"
              >
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </td>
            <td className="px-4 py-4 text-xs text-muted-foreground">
              {new Date(item.created_at).toLocaleString()}
            </td>
          </tr>
        ))}
      </DataTable>
    </ModuleShell>
  );
}

function MediaView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const load = () =>
    api("/api/admin/media")
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, []);
  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("altText", altText);
      await api("/api/admin/media", { method: "POST", body: form });
      setFile(null);
      setAltText("");
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }
  async function remove(id: number) {
    if (!confirm("Delete this media asset?")) return;
    try {
      await api(`/api/admin/media/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <ModuleShell
      title="Media library"
      description="Upload and manage reusable images and PDFs for the website."
    >
      <form
        onSubmit={upload}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-end"
      >
        <label className="flex-1 text-sm font-semibold">
          File
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className={`${fieldClass} file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white`}
            required
          />
        </label>
        <label className="flex-1 text-sm font-semibold">
          Alt text
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className={fieldClass}
            placeholder="Describe the image"
          />
        </label>
        <button disabled={uploading} className={buttonPrimary}>
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : "Upload asset"}
        </button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            {item.mimeType?.startsWith("image/") ? (
              <img
                src={item.url}
                alt={item.altText || item.originalName}
                className="h-36 w-full object-cover"
              />
            ) : (
              <div className="flex h-36 items-center justify-center bg-surface">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            )}
            <div className="p-4">
              <p className="truncate text-sm font-semibold">{item.originalName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {Math.round(item.sizeBytes / 1024)} KB
              </p>
              <button
                onClick={() => remove(item.id)}
                className="mt-3 text-xs font-semibold text-destructive"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}

function SettingsView({ setError }: { setError: (value: string) => void }) {
  const [settings, setSettings] = useState<RecordItem>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    api("/api/admin/settings")
      .then(setSettings)
      .catch((e) => setError(e.message));
  }, []);
  async function save(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });
  return (
    <ModuleShell
      title="Website settings"
      description="Update global brand, hero and SEO defaults used by the public website."
    >
      <form
        onSubmit={save}
        className="max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Company name"
            value={settings.company_name || ""}
            onChange={(value) => update("company_name", value)}
            wide
          />
          <TextField
            label="Hero CTA label"
            value={settings.hero_cta_label || ""}
            onChange={(value) => update("hero_cta_label", value)}
          />
          <TextField
            label="Hero CTA URL"
            value={settings.hero_cta_url || ""}
            onChange={(value) => update("hero_cta_url", value)}
          />
          <TextAreaField
            label="Hero title"
            value={settings.hero_title || ""}
            onChange={(value) => update("hero_title", value)}
            wide
          />
          <TextAreaField
            label="Hero description"
            value={settings.hero_description || ""}
            onChange={(value) => update("hero_description", value)}
            wide
          />
          <TextField
            label="Default SEO title"
            value={settings.default_seo_title || ""}
            onChange={(value) => update("default_seo_title", value)}
            wide
          />
          <TextAreaField
            label="Default SEO description"
            value={settings.default_seo_description || ""}
            onChange={(value) => update("default_seo_description", value)}
            wide
          />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button className={buttonPrimary}>Save settings</button>
          {saved && (
            <span className="flex items-center gap-2 text-sm font-medium text-secondary">
              <CheckCircle2 className="h-4 w-4" />
              Saved successfully
            </span>
          )}
        </div>
      </form>
    </ModuleShell>
  );
}

function ActivityView({ setError }: { setError: (value: string) => void }) {
  const [items, setItems] = useState<RecordItem[]>([]);
  useEffect(() => {
    api("/api/admin/activity-logs")
      .then(setItems)
      .catch((e) => setError(e.message));
  }, []);
  return (
    <ModuleShell
      title="Activity logs"
      description="An audit trail of administrator actions and content changes."
    >
      <DataTable headers={["Action", "Entity", "User", "Time"]}>
        {items.map((item) => (
          <tr key={item.id} className="border-t border-border">
            <td className="px-4 py-4 font-semibold capitalize">{item.action}</td>
            <td className="px-4 py-4 text-sm">
              {item.entityType.replace("_", " ")} {item.entityId ? `#${item.entityId}` : ""}
            </td>
            <td className="px-4 py-4 text-sm text-muted-foreground">{item.userName || "System"}</td>
            <td className="px-4 py-4 text-sm text-muted-foreground">
              {new Date(item.createdAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </DataTable>
    </ModuleShell>
  );
}

function ModuleShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-3xl font-bold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
function Editor({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">{title}</h3>
        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-accent"
          aria-label="Close editor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
function TextField({
  label,
  value,
  onChange,
  type = "text",
  wide = false,
  required = false,
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  type?: string;
  wide?: boolean;
  required?: boolean;
}) {
  return (
    <label className={`block text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        required={required}
      />
    </label>
  );
}
function TextAreaField({
  label,
  value,
  onChange,
  wide = false,
  rows = 4,
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  wide?: boolean;
  rows?: number;
}) {
  return (
    <label className={`block text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={fieldClass}
      />
    </label>
  );
}
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="rounded-lg p-2 text-primary hover:bg-accent"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
function DataTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-surface text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const positive = ["published", "active", "contacted"].includes(status);
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${positive ? "bg-secondary/10 text-secondary" : status === "new" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
function Loading() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
      Loading data…
    </div>
  );
}
