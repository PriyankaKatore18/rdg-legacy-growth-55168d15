import { useState } from "react";
import { useForm } from "react-hook-form";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { company } from "@/data/site";

const title = "Contact RDG Future Way — Head Office, Branches & Support";
const description =
  "Contact RDG Future Way Pvt. Ltd. for product, distributor or business enquiries. Head office in Indore with branches across India.";

type Values = { name: string; email: string; phone: string; message: string };

function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We're a call, mail or visit away"
        description="Product questions, distributor support or partnership enquiries — our team responds within one working day."
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-5">
            {[
              { icon: MapPin, label: "Head Office", value: company.address },
              { icon: Phone, label: "Phone", value: company.phone },
              { icon: Mail, label: "Email", value: company.email },
              { icon: Building2, label: "Branch Offices", value: company.branches.join(" • ") },
            ].map((c) => (
              <div
                key={c.label}
                className="flex gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="bg-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {c.label}
                  </p>
                <p className="mt-1 break-words text-sm text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
            <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
              <iframe
                title="RDG Future Way head office location"
                src="https://www.google.com/maps?q=Indore,Madhya Pradesh&output=embed"
                loading="lazy"
                className="h-64 w-full border-0"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit(async () => {
              await new Promise((r) => setTimeout(r, 500));
              setSent(true);
              reset();
            })}
            className="h-fit rounded-3xl border border-border bg-card p-8 shadow-card"
          >
            <h2 className="font-display text-xl font-semibold text-foreground">Send an enquiry</h2>
            {sent && (
              <p className="mt-5 rounded-2xl bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary">
                Thanks! Your message has been received.
              </p>
            )}
            <div className="mt-6 grid gap-5">
              <input
                {...register("name", { required: true })}
                className="field"
                placeholder="Full name"
                aria-label="Full name"
              />
              {errors.name && <span className="text-xs text-destructive">Name is required</span>}
              <input
                {...register("email", { required: true })}
                type="email"
                className="field"
                placeholder="Email"
                aria-label="Email"
              />
              <input
                {...register("phone", { required: true })}
                className="field"
                placeholder="Mobile number"
                aria-label="Mobile number"
              />
              <textarea
                {...register("message", { required: true })}
                rows={5}
                className="field"
                placeholder="How can we help?"
                aria-label="Message"
              />
            </div>
            <button className="bg-brand mt-6 w-full rounded-full py-3.5 text-sm font-semibold text-primary-foreground shadow-card">
              Send message
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
