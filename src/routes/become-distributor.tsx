import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

const title = "Become a Distributor — Join RDG Future Way Free";
const description =
  "Register free as an RDG Future Way distributor. Get wholesale pricing, PV/BV income, training support and access to the generation income plan.";

export const Route = createFileRoute("/become-distributor")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BecomeDistributor,
});

type FormValues = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  sponsorId?: string;
  message?: string;
};

function BecomeDistributor() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    reset();
  });

  return (
    <>
      <PageHeader
        eyebrow="Become a Distributor"
        title="Free registration. Lifetime opportunity."
        description="Fill the form and a regional business coach will call you within 24 hours with your ID, starter kit options and your first training session."
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {[
              "Zero joining, renewal or franchise fee",
              "Distributor pricing on all 500+ products",
              "Monthly bonus payouts by the 10th",
              "Free access to the RDG Training Academy",
              "Dedicated support in 7 Indian languages",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl bg-surface p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-sm text-foreground">{point}</p>
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 shadow-card">
            {submitted && (
              <p className="mb-6 rounded-2xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                Thank you! Your application has been received. Our team will contact you shortly.
              </p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <input
                  {...register("fullName", { required: "Name is required" })}
                  className="field"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Mobile number" error={errors.phone?.message}>
                <input
                  {...register("phone", {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9+\s-]{10,15}$/, message: "Enter a valid number" },
                  })}
                  className="field"
                  placeholder="+91 …"
                />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="field"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input {...register("city", { required: "City is required" })} className="field" placeholder="City" />
              </Field>
              <Field label="Sponsor ID (optional)">
                <input {...register("sponsorId")} className="field" placeholder="RDG123456" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Message (optional)">
                  <textarea {...register("message")} rows={4} className="field" placeholder="Tell us about your goals" />
                </Field>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-brand mt-8 w-full rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {isSubmitting ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}