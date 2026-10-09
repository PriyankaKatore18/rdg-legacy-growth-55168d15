import { PolicyPage } from "@/components/shared/PolicyPage";

const title = "Shipping Policy | RDG Future Way Pvt. Ltd.";
const description =
  "Dispatch timelines, delivery charges, serviceable pin codes and tracking information for RDG Future Way orders.";

const ShippingPolicy = () => (
  <PolicyPage
    eyebrow="Legal"
    title="Shipping Policy"
    description="Dispatch in 48 hours, delivery to 400+ pin codes across 25+ cities."
    sections={[
      {
        heading: "Dispatch time",
        body: "Orders placed before 4 PM on working days are dispatched within 48 hours from the nearest warehouse.",
      },
      {
        heading: "Delivery time",
        body: "Metro and tier-2 cities: 2–4 working days. Remote pin codes: up to 7 working days.",
      },
      {
        heading: "Charges",
        body: "Flat ₹60 shipping on orders below ₹1,000. Free delivery above ₹1,000.",
      },
      {
        heading: "Tracking",
        body: "A tracking link is sent by SMS and email as soon as the courier picks up your parcel.",
      },
      {
        heading: "Damaged shipments",
        body: "Report damage within 48 hours of delivery with unboxing photos for a free replacement.",
      },
    ]}
  />
);

export default ShippingPolicy;
