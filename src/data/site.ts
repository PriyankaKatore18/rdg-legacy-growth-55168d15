export const company = {
  name: "RDG Future Way Pvt. Ltd.",
  short: "RDG Future Way",
  tagline: "Empowering Every Family Through Quality Products & Business Opportunities",
  phone: "+91 73979 67779",
  secondaryPhone: "+91 79729 73775",
  email: "rdgfutureway7779@gmail.com",
  website: "rdgfutureway.com",
  address: "RDG Corporate House, Ring Road, Indore, Madhya Pradesh 452001, India",
  branches: ["Bhopal", "Jaipur", "Lucknow", "Nagpur", "Patna"],
};

export type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string; desc?: string }[];
};

export const navigation: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Company",
    to: "/about",
    children: [
      { label: "About Us", to: "/about", desc: "Our story, vision & mission" },
      { label: "Success Stories", to: "/success-stories", desc: "Leaders who built their future" },
      { label: "Events", to: "/events", desc: "Seminars & product launches" },
      { label: "Gallery", to: "/gallery", desc: "Photos from the field" },
      { label: "Career", to: "/career", desc: "Work with us" },
    ],
  },
  {
    label: "Products",
    to: "/products",
    children: [
      { label: "All Categories", to: "/products", desc: "13 categories, 500+ SKUs" },
      {
        label: "Ayurvedic & Healthcare",
        to: "/products",
        desc: "Classical & proprietary formulations",
      },
      { label: "Agriculture & Seeds", to: "/products", desc: "Inputs that grow yields" },
      { label: "Personal & Home Care", to: "/products", desc: "Daily essentials for the family" },
    ],
  },
  {
    label: "Opportunity",
    to: "/business-opportunity",
    children: [
      {
        label: "Business Opportunity",
        to: "/business-opportunity",
        desc: "How direct selling works",
      },
      { label: "Generation Plan", to: "/generation-plan", desc: "Income levels & bonuses" },
      { label: "Income Calculator", to: "/income-calculator", desc: "Estimate your earnings" },
      { label: "Become a Distributor", to: "/become-distributor", desc: "Join in minutes" },
    ],
  },
  {
    label: "Resources",
    to: "/downloads",
    children: [
      { label: "Downloads", to: "/downloads", desc: "Brochures, catalogue, forms" },
      { label: "Blog", to: "/blog", desc: "Health, business & lifestyle" },
      { label: "FAQs", to: "/faqs", desc: "Everything you asked" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export const stats = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 5000, suffix: "+", label: "Active Distributors" },
  { value: 500, suffix: "+", label: "Products" },
  { value: 25, suffix: "+", label: "Cities Served" },
];

export const categories = [
  {
    name: "Healthcare",
    slug: "healthcare",
    items: 64,
    blurb: "Everyday health support for the whole family.",
  },
  {
    name: "Pharmacy",
    slug: "pharmacy",
    items: 48,
    blurb: "GMP-certified pharmaceutical formulations.",
  },
  {
    name: "Ayurvedic",
    slug: "ayurvedic",
    items: 72,
    blurb: "Classical churnas, syrups and tablets.",
  },
  {
    name: "Organic Foods",
    slug: "organic-foods",
    items: 39,
    blurb: "Chemical-free grains, oils and spices.",
  },
  { name: "Agriculture", slug: "agriculture", items: 41, blurb: "Soil health and crop nutrition." },
  { name: "Seeds", slug: "seeds", items: 22, blurb: "High-germination hybrid seeds." },
  { name: "Fertilizers", slug: "fertilizers", items: 27, blurb: "Bio & organic plant nutrition." },
  { name: "Fashion", slug: "fashion", items: 35, blurb: "Everyday ethnic and casual wear." },
  { name: "Clothing", slug: "clothing", items: 44, blurb: "Comfort fabrics at factory pricing." },
  { name: "Personal Care", slug: "personal-care", items: 58, blurb: "Skin, hair and oral care." },
  { name: "Home Care", slug: "home-care", items: 31, blurb: "Safe cleaning for modern homes." },
  {
    name: "Nutraceutical",
    slug: "nutraceutical",
    items: 29,
    blurb: "Protein, vitamins and immunity.",
  },
  { name: "Animal Care", slug: "animal-care", items: 18, blurb: "Cattle and poultry wellness." },
  {
    name: "Daily Essentials",
    slug: "daily-essentials",
    items: 52,
    blurb: "Groceries you reorder monthly.",
  },
  {
    name: "Kitchen Products",
    slug: "kitchen",
    items: 24,
    blurb: "Cookware and storage solutions.",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  mrp: number;
  dp: number;
  cp: number;
  pv: number;
  bv: number;
  rating: number;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "rdg-imm-01",
    name: "Immunity Booster Amla Tablets",
    category: "Ayurvedic",
    mrp: 640,
    dp: 480,
    cp: 545,
    pv: 12,
    bv: 420,
    rating: 4.8,
    badge: "Bestseller",
  },
  {
    id: "rdg-pro-02",
    name: "Plant Protein Nutri Powder",
    category: "Nutraceutical",
    mrp: 1650,
    dp: 1250,
    cp: 1420,
    pv: 32,
    bv: 1120,
    rating: 4.7,
    badge: "New",
  },
  {
    id: "rdg-agr-03",
    name: "Bio Organic Soil Enricher 5kg",
    category: "Agriculture",
    mrp: 900,
    dp: 690,
    cp: 780,
    pv: 18,
    bv: 620,
    rating: 4.6,
  },
  {
    id: "rdg-per-04",
    name: "Neem Tulsi Herbal Face Wash",
    category: "Personal Care",
    mrp: 320,
    dp: 235,
    cp: 275,
    pv: 6,
    bv: 205,
    rating: 4.9,
    badge: "Top Rated",
  },
  {
    id: "rdg-hom-05",
    name: "Plant-Based Floor Cleaner 1L",
    category: "Home Care",
    mrp: 290,
    dp: 210,
    cp: 250,
    pv: 5,
    bv: 185,
    rating: 4.5,
  },
  {
    id: "rdg-org-06",
    name: "Cold Pressed Mustard Oil 1L",
    category: "Organic Foods",
    mrp: 380,
    dp: 295,
    cp: 335,
    pv: 7,
    bv: 260,
    rating: 4.7,
  },
  {
    id: "rdg-pha-07",
    name: "Joint Care Pain Relief Oil",
    category: "Pharmacy",
    mrp: 460,
    dp: 340,
    cp: 395,
    pv: 9,
    bv: 300,
    rating: 4.8,
    badge: "Bestseller",
  },
  {
    id: "rdg-dai-08",
    name: "Premium Whole Wheat Atta 5kg",
    category: "Daily Essentials",
    mrp: 420,
    dp: 330,
    cp: 375,
    pv: 6,
    bv: 290,
    rating: 4.4,
  },
];

export const featuredOfferings = [
  {
    name: "Anmol Ratan Juice",
    category: "Ayurvedic wellness",
    description: "Herbal mixed-berry juice featured in RDG's company material.",
    note: "Natural ingredients • no added sugar • no preservatives",
  },
  {
    name: "Ayurvedic ID Package",
    category: "Business package",
    description: "A 15-level package structure using the published ID × 100 formula.",
    note: "Packages from ₹100 to ₹50,00,000",
  },
  {
    name: "15-Level Award & Reward Plan",
    category: "Recognition",
    description:
      "A recognition ladder featuring welcome kits, apparel, gadgets, vehicles, homes and travel rewards.",
    note: "Eligibility depends on plan terms and performance",
  },
];

export const incomePackages = [
  { level: 1, package: "₹100", network: "₹10,000" },
  { level: 2, package: "₹250", network: "₹25,000" },
  { level: 3, package: "₹500", network: "₹50,000" },
  { level: 4, package: "₹1,000", network: "₹1,00,000" },
  { level: 5, package: "₹2,500", network: "₹2,50,000" },
  { level: 6, package: "₹5,000", network: "₹5,00,000" },
  { level: 7, package: "₹10,000", network: "₹10,00,000" },
  { level: 8, package: "₹25,000", network: "₹25,00,000" },
  { level: 9, package: "₹50,000", network: "₹50,00,000" },
  { level: 10, package: "₹1,00,000", network: "₹1,00,00,000" },
  { level: 11, package: "₹2,50,000", network: "₹2,50,00,000" },
  { level: 12, package: "₹5,00,000", network: "₹5,00,00,000" },
  { level: 13, package: "₹10,00,000", network: "₹10,00,00,000" },
  { level: 14, package: "₹25,00,000", network: "₹25,00,00,000" },
  { level: 15, package: "₹50,00,000", network: "₹50,00,00,000" },
];

export const awardRewards = [
  { level: 1, qualification: "₹10,000", reward: "Certificate + welcome kit" },
  { level: 2, qualification: "₹25,000", reward: "RDG T-shirt + badge" },
  { level: 3, qualification: "₹50,000", reward: "Smart watch" },
  { level: 4, qualification: "₹1,00,000", reward: "Bluetooth earbuds" },
  { level: 5, qualification: "₹2,50,000", reward: "Smartphone" },
  { level: 6, qualification: "₹5,00,000", reward: "LED TV" },
  { level: 7, qualification: "₹10,00,000", reward: "Laptop" },
  { level: 8, qualification: "₹25,00,000", reward: "Bike" },
  { level: 9, qualification: "₹50,00,000", reward: "20 gm gold coin" },
  { level: 10, qualification: "₹1,00,00,000", reward: "Hatchback car" },
  { level: 11, qualification: "₹2,50,00,000", reward: "SUV car" },
  { level: 12, qualification: "₹5,00,00,000", reward: "Luxury car" },
  { level: 13, qualification: "₹10,00,00,000", reward: "2 BHK flat" },
  { level: 14, qualification: "₹25,00,00,000", reward: "Luxury villa" },
  {
    level: 15,
    qualification: "₹50,00,00,000",
    reward: "Dream house + international tour + chairman award",
  },
];

export const whyChoose = [
  {
    title: "Quality Assurance",
    desc: "GMP, ISO and FSSAI certified manufacturing with batch-level testing.",
  },
  {
    title: "Affordable Pricing",
    desc: "Factory-to-family pricing removes every unnecessary middleman.",
  },
  {
    title: "Direct Company Products",
    desc: "Every SKU is owned, formulated and dispatched by RDG.",
  },
  {
    title: "Income Opportunity",
    desc: "A transparent generation plan with lifetime repurchase income.",
  },
  { title: "Training Support", desc: "Weekly online and on-ground training in 7 languages." },
  { title: "Fast Delivery", desc: "48–96 hour dispatch to 25+ cities and 400+ pin codes." },
  {
    title: "Customer Satisfaction",
    desc: "A 4.8/5 average rating across 18,000+ verified reviews.",
  },
  { title: "Trusted Brand", desc: "A registered Indian company with full compliance and audits." },
];

export const journey = [
  { step: "Join", desc: "Register free with a valid ID and start your RDG ID." },
  { step: "Buy Products", desc: "Purchase at distributor price and accumulate PV/BV." },
  { step: "Refer Members", desc: "Share products and enrol customers you already know." },
  { step: "Build Team", desc: "Duplicate the system across generations of your network." },
  { step: "Earn Income", desc: "Retail profit, performance and matching bonuses each month." },
  { step: "Leadership Rewards", desc: "Royalty, car fund, house fund and foreign tours." },
];

export const bonuses = [
  { name: "Retail Profit", detail: "15–30% margin on every product you sell.", value: "Up to 30%" },
  {
    name: "Performance Bonus",
    detail: "Paid on personal + group BV each month.",
    value: "5% – 25%",
  },
  {
    name: "Matching Bonus",
    detail: "Earn on the performance of your direct legs.",
    value: "Up to 20%",
  },
  {
    name: "Generation Bonus",
    detail: "Income across 7 active generations deep.",
    value: "7 Levels",
  },
  { name: "Leadership Bonus", detail: "Unlocked at Silver rank and above.", value: "3% Pool" },
  {
    name: "Royalty Income",
    detail: "Company turnover share for qualified leaders.",
    value: "2% Pool",
  },
];

export const ranks = [
  { rank: "Star", bv: "5,000 BV", reward: "Welcome kit + digital certificate" },
  { rank: "Silver", bv: "25,000 BV", reward: "Leadership bonus pool entry" },
  { rank: "Gold", bv: "1,00,000 BV", reward: "Domestic tour + gadget fund" },
  { rank: "Platinum", bv: "5,00,000 BV", reward: "Car fund ₹15,000/month" },
  { rank: "Diamond", bv: "20,00,000 BV", reward: "House fund + foreign tour" },
  { rank: "Crown", bv: "1,00,00,000 BV", reward: "Royalty pool + Hall of Fame" },
];

export const testimonials = [
  {
    name: "Sunita Verma",
    role: "Diamond Distributor, Indore",
    quote:
      "I started with a ₹1,200 product order for my family. Four years later my team spans three states and my monthly income replaced my husband's salary.",
    rating: 5,
  },
  {
    name: "Ramesh Patidar",
    role: "Platinum Distributor, Ujjain",
    quote:
      "The agriculture range genuinely improved my soybean yield. Selling what I already trusted made building a team effortless.",
    rating: 5,
  },
  {
    name: "Dr. Neha Sharma",
    role: "Customer, Bhopal",
    quote:
      "I recommend the ayurvedic line to my patients. Consistent quality, honest labelling and prices families can actually sustain.",
    rating: 5,
  },
  {
    name: "Ajay Kushwaha",
    role: "Gold Distributor, Jaipur",
    quote:
      "The training academy taught me digital prospecting. I closed 42 customers in my first 90 days without leaving my town.",
    rating: 4,
  },
];

export const events = [
  {
    title: "National Leadership Summit 2026",
    date: "2026-09-12",
    city: "Indore",
    type: "Seminar",
    seats: 1200,
  },
  {
    title: "Ayurveda Product Launch — Immunity Series",
    date: "2026-08-22",
    city: "Bhopal",
    type: "Launch",
    seats: 400,
  },
  {
    title: "Kisan Samriddhi Business Meet",
    date: "2026-10-05",
    city: "Nagpur",
    type: "Business Meet",
    seats: 600,
  },
  {
    title: "Rewards & Recognition Night",
    date: "2026-11-18",
    city: "Jaipur",
    type: "Award Night",
    seats: 900,
  },
];

export const trainings = [
  {
    title: "Product Training",
    desc: "Know every SKU, its usage, dosage and cross-sell story.",
    modules: 14,
  },
  {
    title: "Sales Training",
    desc: "Prospecting, objection handling and closing frameworks.",
    modules: 11,
  },
  {
    title: "Leadership Training",
    desc: "Build, duplicate and retain a productive team.",
    modules: 9,
  },
  {
    title: "Motivation",
    desc: "Habits, goal-setting and mindset sessions with top leaders.",
    modules: 8,
  },
  {
    title: "Digital Marketing",
    desc: "WhatsApp, Instagram and content that converts.",
    modules: 12,
  },
  {
    title: "Compliance",
    desc: "Direct selling guidelines and ethical selling practices.",
    modules: 6,
  },
];

export const posts = [
  {
    slug: "immunity-monsoon",
    title: "7 Ayurvedic Habits That Keep Immunity Strong Through Monsoon",
    category: "Health Tips",
    date: "2026-07-18",
    read: 6,
  },
  {
    slug: "first-90-days",
    title: "Your First 90 Days as an RDG Distributor: A Practical Playbook",
    category: "Business Tips",
    date: "2026-07-04",
    read: 9,
  },
  {
    slug: "soil-health",
    title: "Soil Health 101: Why Organic Inputs Outperform in Year Three",
    category: "Agriculture",
    date: "2026-06-21",
    read: 7,
  },
  {
    slug: "protein-gap",
    title: "The Indian Protein Gap and How to Close It at Home",
    category: "Wellness",
    date: "2026-06-09",
    read: 5,
  },
  {
    slug: "family-budget",
    title: "Cutting a Family Grocery Bill by 18% With Direct Purchase",
    category: "Lifestyle",
    date: "2026-05-27",
    read: 4,
  },
  {
    slug: "rdg-expansion",
    title: "RDG Future Way Expands to 25 Cities With New Logistics Hub",
    category: "Latest News",
    date: "2026-05-12",
    read: 3,
  },
];

export const downloads = [
  { title: "Company Brochure", size: "4.2 MB", type: "PDF" },
  { title: "Product Catalogue 2026", size: "12.8 MB", type: "PDF" },
  { title: "Generation Income Plan", size: "3.1 MB", type: "PDF" },
  { title: "Distributor Application Form", size: "0.6 MB", type: "PDF" },
  { title: "Price List (DP / MRP / PV)", size: "1.9 MB", type: "XLSX" },
  { title: "Business Presentation", size: "9.4 MB", type: "PPTX" },
  { title: "Training Material Pack", size: "22.5 MB", type: "ZIP" },
];

export const faqs = [
  {
    q: "What is the joining fee to become an RDG distributor?",
    a: "Registration is free. You only purchase the product package you actually want, starting from ₹1,200. There is no franchise, security or renewal fee.",
  },
  {
    q: "How is the Generation Plan different from a binary plan?",
    a: "Income flows through active generations of your network rather than balanced legs, so a strong single leg is rewarded instead of being capped.",
  },
  {
    q: "When are payouts released?",
    a: "Bonus cycles close on the last day of each month and payouts are credited to your registered bank account by the 10th of the following month.",
  },
  {
    q: "Are the products certified?",
    a: "Yes. Manufacturing units are GMP and ISO certified, food products carry FSSAI licences, and every batch is tested before dispatch.",
  },
  {
    q: "Can I return a product?",
    a: "Unopened products can be returned within 30 days of delivery for a full refund as per our refund policy.",
  },
  {
    q: "Do I need prior sales experience?",
    a: "No. The Training Academy takes you from product basics to leadership with structured modules, live sessions and downloadable material.",
  },
];

export const galleryItems = [
  { title: "Annual Leadership Meet", tag: "Events" },
  { title: "Corporate Head Office", tag: "Office" },
  { title: "Product Launch Stage", tag: "Events" },
  { title: "Distributor Training Camp", tag: "Training" },
  { title: "Manufacturing Facility", tag: "Office" },
  { title: "Tree Plantation Drive", tag: "CSR" },
  { title: "Car Achievers Handover", tag: "Rewards" },
  { title: "Kisan Awareness Program", tag: "CSR" },
  { title: "Foreign Tour — Dubai", tag: "Rewards" },
];
