/**
 * ─────────────────────────────────────────────────────────────
 *  ARBOR LEADS — ALL SITE COPY, PRICES AND STATS LIVE HERE.
 *  Edit this file and the whole site updates.
 *  Anything marked `placeholder: true` shows a "Placeholder" tag
 *  on the page until you replace it and set it to false.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Arbor Leads",
  domain: "arborleads.co",
  url: "https://arborleads.co",
  email: "hello@arborleads.co",
  tagline: "More booked jobs. Less chasing leads.",
  seo: {
    title: "Arbor Leads | Websites, SEO & Lead Systems for Tree Service Companies",
    description:
      "Websites, Google rankings, and instant lead follow-up for tree service companies. We build it, run it, and keep it working. Built by a former tree service owner.",
  },
  /** The main call to action (orange buttons). */
  cta: "Get My Free Business Analysis",
  /** Short version for the header on phones. */
  ctaShort: "Free Analysis",
  secondaryCta: "See Pricing",
};

export const marquee = [
  "Built for tree pros",
  "Never miss a call",
  "Live in 7 days",
  "Automatic review requests",
  "Your domain stays yours",
];

export const hero = {
  headline: "More booked jobs. Less chasing leads.",
  subhead:
    "Websites, Google rankings, and instant lead follow-up for tree service companies. We build it, run it, and keep it working. You run crews.",
  trustLine: "Built by a former tree service owner. $0 down option. Live in 7 days.",
};

export const analyzer = {
  eyebrow: "Free analysis",
  headline: "See where your business stands.",
  sub: "Free. Takes 60 seconds. We'll email you a report and a time to walk through it.",
  fields: {
    business: "Business name",
    website: "Website URL",
    email: "Email",
    phone: "Phone",
  },
  button: "Analyze My Business",
  scanSteps: [
    "Checking speed…",
    "Checking Google profile…",
    "Checking reviews…",
    "Checking mobile…",
  ],
  scoreLabel: "Your starting score",
  scoreVerdict: "There's room to pick up more jobs.",
  redFlagsTitle: "3 things to fix",
  /** Shown blurred. Real findings come from the backend later. */
  redFlags: ["Finding #1", "Finding #2", "Finding #3"],
  success: "Your report is on the way — check your inbox in a few minutes.",
  startOver: "Check another business",
};

export const problem = {
  eyebrow: "The problem",
  headline: "Good tree guys lose jobs every day. Not on the work. On the phone.",
  /** Plain statements only. No stats unless you can source them. */
  cards: [
    { icon: "phone", title: "You miss calls while you're up in a tree." },
    { icon: "clock", title: "The company that calls back first usually gets the job." },
    { icon: "site", title: "Your site looks older than your equipment." },
    { icon: "star", title: "Customers check Google reviews before they ever call." },
  ] as { icon: "phone" | "clock" | "site" | "star"; title: string }[],
};

export const beforeAfter = {
  eyebrow: "Before / After",
  headline: "Same company. Which one would you call?",
  sub: "Drag the handle.",
  before: "Before",
  after: "After",
  caption: "Ridgeline Tree Service is a made-up company, shown as an example.",
};

/**
 * RECENT WEBSITE CASE
 * Real numbers from a client build. Do not name or link the client.
 * No lead, call, or revenue numbers here — only what the reports show.
 * Each stat counts up to `value`; `prefix`/`suffix` wrap it (e.g. "+153%").
 */
export const caseStudy = {
  eyebrow: "Recent website case",
  headline: "Not just a prettier website. Rebuilt to get found.",
  sub: "We didn't just redesign it. We rebuilt the structure, pages, speed, and Google setup so the right customers find it, trust it, and reach out. Here's what changed in the first 30 days.",
  changesLabel: "What we changed",
  changes: ["Restructured pages for search", "Built for speed on mobile", "Clear paths to call or book"],
  stats: [
    { prefix: "+", value: 153, decimals: 0, suffix: "%", label: "Google clicks", detail: "151 → 382 (30 days before vs. after)" },
    { prefix: "+", value: 167, decimals: 0, suffix: "%", label: "Times shown on Google", detail: "3.9K → 10.4K impressions" },
    { prefix: "", value: 2.3, decimals: 1, suffix: "x", label: "Click rate when people search the business name", detail: "11.7% → 26.8%" },
    { prefix: "", value: 3, decimals: 0, suffix: "x", label: "Shown for non-branded searches", detail: "1.97K → 5.84K impressions" },
    { prefix: "+", value: 70, decimals: 0, suffix: "%", label: "Organic visitors per day", detail: "16 → 28 per day" },
    { prefix: "", value: 98, decimals: 0, suffix: "–100", label: "Mobile speed score", detail: "Google Lighthouse, after launch" },
  ],
  finePrint:
    "Results from a recent client build, measured Sep 17–Oct 16 vs. Oct 18–Nov 16, 2026 (Google Search Console) and Sep 1–Oct 17 vs. Oct 18–Nov 17, 2026 (Google Analytics). Individual results vary and depend on market, season, and competition.",
};

/** The fictional company used in the slider and phone demo. */
export const mock = {
  company: "Ridgeline Tree Service",
  town: "Cedar Hollow",
  state: "TN",
  phone: "(615) 555-0142",
  address: "1420 Old Mill Rd, Cedar Hollow, TN",
  gmail: "ridgelinetreeservice@gmail.com",
  before: {
    menu: [
      "Home",
      "Services",
      "Service Areas",
      "Testimonials",
      "Photo Gallery",
      "FAQ",
      "Contact Us",
      "News & Media",
    ],
    welcome: "Welcome to Ridgeline Tree Service",
    wall: [
      "At Ridgeline Tree Service, we pride ourselves in providing prompt and reliable tree services at affordable rates. Our team of experienced professionals is dedicated to meeting all of your tree care needs. We offer a wide variety of services including tree removal, tree trimming, tree pruning, stump grinding, stump removal, lot clearing, storm damage cleanup, emergency tree service and much more.",
      "We have been proudly serving the area and the surrounding communities for many years. We are fully committed to customer satisfaction and we treat every property as if it were our own. No job is too big or too small. Whether you need one tree removed or an entire lot cleared, we have the equipment and the knowledge to get the job done right the first time.",
      "If you are looking for a tree service company you can trust, look no further. Please do not hesitate to contact us today for more information about our services or fill out the form to request your free estimate. We look forward to hearing from you.",
    ],
    estimate: "REQUEST A FREE ESTIMATE",
  },
  after: {
    nav: ["Services", "Reviews", "Our Work"],
    headline: ["Dangerous Tree?", "Gone Safely.", "Today."],
    sub: "Removal, trimming and storm cleanup. Same-day quotes.",
    call: "Tap to Call",
    rating: "4.9",
    reviews: "212 Google reviews",
    badge: "Licensed & Insured",
    formTitle: "Free Quote in 60 Seconds",
    formFields: ["Your name", "Phone number", "What's going on?"],
    formButton: "Get My Free Quote",
    services: [
      { title: "Tree Removal", body: "Big, dead or too close to the house." },
      { title: "Trimming & Pruning", body: "Healthier trees. Cleaner yard." },
      { title: "Storm Cleanup", body: "24/7 emergency crews." },
    ],
  },
};

export const speedToLead = {
  eyebrow: "Speed to lead",
  headline: "You're up a tree. The phone rings. Here's what happens next.",
  caption: "A missed call gets an automatic text within seconds. You pick it up when you're back on the ground.",
  replay: "Replay",
  contactName: "Homeowner",
  missedCall: { title: "Missed call", detail: "(615) 555-0188 · just now" },
  messages: [
    { from: "business", text: "Sorry we missed you! We're on a job. What can we help with?", tag: "Automatic text · sent in seconds" },
    { from: "customer", text: "Hi, I've got a big dead oak leaning toward my house. Can someone come take a look?" },
    { from: "business", text: "We can help with that. Pick a time for a free estimate:", link: "ridgelinetree.com/book", tag: "Automatic reply" },
  ] as { from: "business" | "customer"; text: string; link?: string; tag?: string }[],
  booked: "Estimate booked: Thursday 10am",
};

export const roi = {
  eyebrow: "Do the math",
  headline: "What's one more job worth?",
  jobSize: { label: "Average job size", min: 300, max: 10000, step: 100, default: 1500 },
  extraJobs: { label: "Extra jobs per month", min: 1, max: 20, step: 1, default: 2 },
  resultLead: "That's",
  resultMonth: "more per month",
  resultYear: "per year.",
  footnote: "Arbor Leads starts at $149/mo.",
  disclaimer: "Your numbers, your math. This is a calculator, not a promise.",
};

export const howItWorks = {
  eyebrow: "How it works",
  headline: "Three steps. Then back to work.",
  steps: [
    { title: "Free analysis", body: "We look at your site and your Google profile and show you what we'd fix. No pitch." },
    { title: "We rebuild & launch in 7 days", body: "New site. Google profile set up. Text-back switched on. You approve it, we launch it." },
    { title: "We run it. You run crews.", body: "Hosting, updates, follow-up and a report every month. You answer your leads and do the work." },
  ],
};

/**
 * PRICING
 * NOTE: `regular` prices take effect Jan 1 for new customers.
 * `price` is the year-end price, locked in for life for anyone who joins before Jan 1.
 */
export const pricing = {
  eyebrow: "Pricing",
  headline: "Simple pricing. No surprises.",
  /** The orange "sale" tag. */
  saleTag: "Year-end pricing — locked in for life if you join before Jan 1.",
  /** Countdown target (visitor's local time). Regular prices start then. */
  deadline: "2027-01-01T00:00:00",
  ended: "Year-end pricing has ended.",
  toggle: { monthly: "Monthly", annual: "Annual", annualNote: "2 months free" },
  /** Annual = pay for (12 − monthsFree) months, shown as a per-month price. */
  annualMonthsFree: 2,
  billedYearly: "billed yearly",
  billedMonthly: "billed monthly",
  regularLabel: "Regular",
  perMonth: "/mo",
  plans: [
    {
      name: "Get Found",
      blurb: "Show up when they search.",
      regular: 249,
      price: 149,
      priceSuffix: "",
      featured: false,
      features: [
        "Modern website",
        "Google Business Profile setup + optimization",
        "Local SEO basics",
        "Hosting and updates",
      ],
    },
    {
      name: "Get Booked",
      blurb: "Follow up with every lead, fast.",
      regular: 499,
      price: 349,
      priceSuffix: "",
      featured: true,
      features: [
        "Everything in Get Found",
        "Missed-call text-back",
        "Instant lead follow-up",
        "Review request automation",
        "Monthly report",
      ],
    },
    {
      name: "Dominate",
      blurb: "Cover more ground.",
      regular: 999,
      price: 749,
      priceSuffix: "+ ad spend",
      featured: false,
      features: [
        "Everything in Get Booked",
        "Google/Facebook ad management",
        "More service-area pages",
        "Priority support",
      ],
    },
  ],
  featuredBadge: "Most Popular",
  setup: {
    title: "Setup",
    options: [
      { price: "$0 down", detail: "with a 6-month commitment" },
      { price: "$495 one-time setup", detail: "then month-to-month" },
    ],
    or: "or",
  },
  trust: ["$0 down option", "Live in 7 days", "Your domain and reviews stay yours", "Price locked for life"],
};

export const comparison = {
  headline: "Three ways to get more work.",
  columns: { us: "Arbor Leads", agency: "Typical agency", diy: "Doing it yourself" },
  /** Keep these general. No competitor names, no numbers you can't source. */
  rows: [
    { label: "Monthly cost", us: "From $149/mo", agency: "Often much higher", diy: "Free, but it's your time" },
    { label: "Setup", us: "$0 down option", agency: "Setup fees are common", diy: "You build it" },
    { label: "Contract", us: "6 months or month-to-month", agency: "Often a year", diy: "None" },
    { label: "Missed-call text-back", us: "In Get Booked and up", agency: "Often extra", diy: "You set it up" },
    { label: "Time to launch", us: "7 days", agency: "Varies", diy: "Whenever you find time" },
    { label: "Built by", us: "A former tree service owner", agency: "Marketers", diy: "You, after work" },
  ],
};

export const guarantee = {
  eyebrow: "The guarantee",
  headline: "Two promises we can keep.",
  items: [
    { label: "Guarantee 1", text: "Live in 7 days — or your first month is free." },
    { label: "Guarantee 2", text: "Every missed call gets a text back within 60 seconds — or that month is free." },
  ],
  note: "We don't promise a magic number of calls. We promise the work gets done, fast, and we show you the results every month.",
};

export const ownership = {
  eyebrow: "Ownership",
  headline: "What's yours stays yours.",
  body: "Your domain, Google profile, and reviews are always yours. Your website is yours after 6 months — or right away with the $495 setup.",
  points: ["Your domain", "Your Google profile", "Your reviews"],
};

export const about = {
  eyebrow: "About",
  title: "Work with the guy who ran a tree company.",
  copy: "I ran a tree service. I know you don't have time for marketing — you're running crews, quoting jobs, and climbing. That's why we do it for you.",
  signature: "— Ben, Founder of Arbor Leads",
  headshot: {
    /** Drop a photo in /public/images and put its path here, e.g. "/images/ben.jpg". */
    src: "",
    alt: "Ben, founder of Arbor Leads",
    placeholderText: "Headshot placeholder",
  },
  /** Set `value` to a real number and `placeholder` to false when you have them. */
  stats: [
    { value: 0, suffix: "+", label: "Jobs booked", placeholder: true },
    { value: 0, suffix: "+", label: "Reviews gained", placeholder: true },
    { value: 0, suffix: "+", label: "Calls saved", placeholder: true },
  ],
  /** Add real quotes only. Leave `quote` empty to keep the placeholder slot. */
  testimonials: [
    { quote: "", name: "", company: "" },
    { quote: "", name: "", company: "" },
    { quote: "", name: "", company: "" },
  ],
  testimonialPlaceholder: "Testimonial placeholder — a real customer quote goes here.",
  placeholderTag: "Placeholder",
};

/** Keep answers to things we can back up. No result or ranking promises. */
export const faq = {
  headline: "Straight answers.",
  items: [
    {
      q: "Do I need to change my phone?",
      a: "No. You keep your number and your phone. We handle the setup.",
    },
    {
      q: "How fast do you launch?",
      a: "Live in 7 days — or your first month is free.",
    },
    {
      q: "Do I own my site?",
      a: "Your domain, Google profile, and reviews are always yours. Your website is yours after 6 months — or right away with the $495 setup.",
    },
    {
      q: "What's the commitment?",
      a: "Two ways to start: $0 down with a 6-month commitment, or a $495 one-time setup, then month-to-month.",
    },
    {
      q: "What if I cancel early?",
      a: "You can buy out your site for $495, or we take it down. Your domain, Google profile, and reviews stay yours either way.",
    },
    {
      q: "What if I already have a website?",
      a: "Start with the free analysis. We'll show you what we'd fix and why. A modern website is part of every plan.",
    },
    {
      q: "How is this hands-off?",
      a: "We build it, run it, and keep it working. You answer your leads and run your crews.",
    },
    {
      q: "How does the guarantee work?",
      a: "Two guarantees. Live in 7 days — or your first month is free. And every missed call gets a text back within 60 seconds — or that month is free. We don't promise a magic number of calls.",
    },
  ],
};

export const footer = {
  line: "Built for tree service companies. More booked jobs, less chasing.",
  copyright: "© 2026 Arbor Leads.",
  links: [
    { label: "Pricing", href: "/#pricing" },
    { label: "Free Analysis", href: "/#analyzer" },
    { label: "FAQ", href: "/#faq" },
  ],
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const legal = {
  privacy: {
    title: "Privacy Policy",
    body: "Placeholder page. Your privacy policy goes here before launch.",
  },
  terms: {
    title: "Terms of Service",
    body: "Placeholder page. Your terms of service go here before launch.",
  },
  back: "← Back to home",
};
