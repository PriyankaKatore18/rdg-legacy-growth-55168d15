import { ArrowRight, LockKeyhole, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { loginDistributor, registerDistributor } from "@/lib/distributor-api";

function DistributorAuth() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [sponsorCode, setSponsorCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setError("");
    setNotice("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "register") {
        await registerDistributor({ name, username, email, phone, city, sponsorCode, password });
        setMode("login");
        setPassword("");
        setNotice("Account created successfully. Login with your username and password.");
      } else {
        await loginDistributor(username, password);
        window.location.href = "/become-distributor";
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to continue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-surface px-4 py-16 sm:py-24">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-card lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-brand relative hidden overflow-hidden p-10 text-primary-foreground lg:block">
          <div className="bg-gold-grad absolute -top-24 -right-16 h-72 w-72 rounded-full opacity-25 blur-3xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-gold uppercase">
                RDG distributor access
              </p>
              <h1 className="mt-6 font-display text-4xl font-bold">
                Build your RDG journey with one secure account.
              </h1>
              <p className="mt-5 leading-relaxed text-primary-foreground/75">
                Create your distributor account, then login anytime with your own username and
                password.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/75">
              <LockKeyhole className="h-4 w-4 text-gold" /> Secure distributor access
            </div>
          </div>
        </div>

        <div className="p-7 sm:p-12">
          <div className="flex gap-2 rounded-full bg-surface p-1">
            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Login
            </button>
          </div>

          <p className="mt-8 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            Distributor account
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold">
            {mode === "register" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {mode === "register"
              ? "Register once to receive your distributor ID and secure login access."
              : "Login with the username and password you created."}
          </p>
          <p className="mt-3 rounded-2xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
            Annual distributor subscription: ₹500 per year. Product packages are separate.
          </p>

          <form onSubmit={submit} className="mt-7 grid gap-4">
            {mode === "register" && (
              <>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="field"
                  placeholder="Full name"
                  required
                />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="field"
                  placeholder="Email address"
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="field"
                    placeholder="Mobile number"
                    minLength={10}
                    required
                  />
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    className="field"
                    placeholder="City"
                    required
                  />
                </div>
                <input
                  value={sponsorCode}
                  onChange={(event) => setSponsorCode(event.target.value)}
                  className="field"
                  placeholder="Sponsor ID (optional)"
                />
              </>
            )}
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="field"
              placeholder="Username"
              autoComplete="username"
              required
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="field"
              placeholder="Password (8+ characters)"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={8}
              required
            />
            {notice && (
              <p className="rounded-2xl bg-secondary/10 px-4 py-3 text-sm text-secondary">
                {notice}
              </p>
            )}
            {error && (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Please wait…" : mode === "register" ? "Create account" : "Login"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <a
            href="/become-distributor"
            className="mt-7 inline-flex text-sm font-semibold text-primary"
          >
            Back to distributor information
          </a>
        </div>
      </div>
    </section>
  );
}

export default DistributorAuth;
