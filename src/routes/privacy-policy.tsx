import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/shared/PolicyPage";

const title = "Privacy Policy | RDG Future Way Pvt. Ltd.";
const description = "How RDG Future Way collects, uses, stores and protects personal information of customers and distributors.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="We collect only what we need to serve you, and we never sell your data."
      sections={[
        { heading: "Information we collect", body: "Name, contact details, address, KYC documents for distributors, order history and website usage analytics." },
        { heading: "How we use it", body: "To process orders, calculate and pay bonuses, provide support, meet legal obligations and send updates you have opted into." },
        { heading: "Sharing", body: "Shared only with logistics partners, payment processors and regulators when required by law. Never sold to third parties." },
        { heading: "Security", body: "Data is encrypted in transit, access is role-restricted, and distributor financial data is retained per statutory requirements." },
        { heading: "Your rights", body: "You may request access, correction or deletion of your data by writing to care@rdgfutureway.com." },
      ]}
    />
  ),
});