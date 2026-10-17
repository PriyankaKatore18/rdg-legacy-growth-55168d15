import leadershipMeet from "@/assets/gallery/leadership-meet.jpg";
import headOffice from "@/assets/gallery/head-office.jpg";
import productLaunch from "@/assets/gallery/product-launch.jpg";
import trainingCamp from "@/assets/gallery/training-camp.jpg";
import manufacturing from "@/assets/gallery/manufacturing.jpg";

// Reuse the available gallery artwork until the remaining dedicated images are added.
const treePlantation = trainingCamp;
const carReward = productLaunch;
const kisanAwareness = manufacturing;
const dubaiTour = leadershipMeet;

export const galleryItems = [
  {
    title: "Annual Leadership Meet",
    tag: "Events",
    image: leadershipMeet,
    alt: "Illustration of a speaker addressing an Indian business conference.",
  },
  {
    title: "Corporate Head Office",
    tag: "Office",
    image: headOffice,
    alt: "Illustrative modern office reception with glass meeting rooms and plants.",
  },
  {
    title: "Product Launch Stage",
    tag: "Events",
    image: productLaunch,
    alt: "Illustration of presenters unveiling a wellness drink on a blue and gold stage.",
  },
  {
    title: "Distributor Training Camp",
    tag: "Training",
    image: trainingCamp,
    alt: "Illustration of a facilitator leading a small distributor training workshop.",
  },
  {
    title: "Manufacturing Facility",
    tag: "Office",
    image: manufacturing,
    alt: "Illustrative beverage bottling line with stainless steel equipment and workers.",
  },
  {
    title: "Tree Plantation Drive",
    tag: "CSR",
    image: treePlantation,
    alt: "Illustration of volunteers planting a sapling together in a community park.",
  },
  {
    title: "Car Achievers Handover",
    tag: "Rewards",
    image: carReward,
    alt: "Illustrative car recognition ceremony with a ribbon-decorated white car.",
  },
  {
    title: "Kisan Awareness Program",
    tag: "CSR",
    image: kisanAwareness,
    alt: "Illustration of an agronomist discussing a seedling with farmers beside a field.",
  },
  {
    title: "Foreign Tour — Dubai",
    tag: "Rewards",
    image: dubaiTour,
    alt: "Illustration of colleagues enjoying a group trip beside Dubai Marina.",
  },
] as const;
