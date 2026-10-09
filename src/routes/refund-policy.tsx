import { PolicyPage } from "@/components/shared/PolicyPage";

const title = "Refund Policy | RDG Future Way Pvt. Ltd.";
const description =
  "RDG Future Way refund and return policy: 30-day returns on unopened products, refund timelines and bonus adjustment rules.";

const RefundPolicy = () => (
  <PolicyPage
    eyebrow="Legal"
    title="Refund Policy"
    description="Fair, simple returns — because we would rather keep the relationship than the order."
    sections={[
      {
        heading: "Return window",
        body: "Unopened, undamaged products in original packaging can be returned within 30 days of delivery.",
      },
      {
        heading: "How to request",
        body: "Raise a request from your distributor panel or email care@rdgfutureway.com with your order ID and reason.",
      },
      {
        heading: "Refund timeline",
        body: "Approved refunds are credited to the original payment method within 7–10 working days of receiving the product.",
      },
      {
        heading: "Bonus adjustment",
        body: "PV/BV earned on returned products is reversed in the next bonus cycle.",
      },
      {
        heading: "Non-returnable items",
        body: "Opened consumables, personal care items and perishable organic foods cannot be returned for hygiene reasons.",
      },
    ]}
  />
);

export default RefundPolicy;
