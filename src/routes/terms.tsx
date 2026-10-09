import { PolicyPage } from "@/components/shared/PolicyPage";

const title = "Terms & Conditions | RDG Future Way Pvt. Ltd.";
const description =
  "Terms governing use of the RDG Future Way website, distributor agreements, orders and the generation income plan.";

const Terms = () => (
  <PolicyPage
    eyebrow="Legal"
    title="Terms & Conditions"
    description="Please read these terms carefully before purchasing products or registering as a distributor."
    sections={[
      {
        heading: "Eligibility",
        body: "Distributors must be 18 years or older, Indian residents and provide valid KYC documents.",
      },
      {
        heading: "No income guarantee",
        body: "Income depends entirely on personal effort, retail sales and team activity. RDG does not promise any fixed or guaranteed income.",
      },
      {
        heading: "Conduct",
        body: "Distributors must not make exaggerated product or income claims, or sell outside approved channels and pricing.",
      },
      {
        heading: "Orders and pricing",
        body: "Prices, PV/BV values and offers may change without notice. Orders are confirmed only after payment realisation.",
      },
      {
        heading: "Termination",
        body: "RDG may suspend an ID for policy violations, with pending payouts settled as per the compliance review outcome.",
      },
    ]}
  />
);

export default Terms;
