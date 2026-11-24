/**
 * ─────────────────────────────────────────────────────────────
 *  ARBOR LEADS — ALL SITE COPY, PRICES AND STATS LIVE HERE.
 *  Edit this file and the whole site updates.
 *
 *  CLAIMS RULES
 *  - The only real stats are the Recent Website Case numbers.
 *    Don't add other numbers or percentages.
 *  - The only guarantees are the two in `guarantee.items`.
 *  - Never name or link the case-study client.
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
      "We build your tree service website, get you showing up on Google, and text back every missed call in under 60 seconds. Built by a former tree service owner.",
  },
  /** The main call to action (orange buttons). */
  cta: "Show Me What I'm Missing",
  /** Short version for the header on phones and the sticky bar. */
  ctaShort: "Free Audit",
  secondaryCta: "See Pricing",
  /** Label on the outline button in the phone sticky bar. */
  pricingShort: "Pricing",
};

/** Thin orange bar above the header. Days left are counted from `pricing.deadline`. */
export const announcement = {
  text: "Year-end pricing ends Dec 31",
  lock: "Locked in for life",
  daysLeft: "days left",
  dayLeft: "day left",
  lastDay: "Last day",
  href: "#pricing",
};

export const marquee = [
  "Live in 7 days, or your first month is free",
  "$0 down",
  "Every missed call texted back in 60 seconds, or that month is free",
  "Live in 7 days",
];

export const hero = {
  headline: "Stop losing tree jobs to the guy who called back first.",
  /** These words get the orange underline. Must appear in the headline exactly. */
  highlight: "called back first.",
  subhead:
    "We build your website, get you showing up on Google, and text back every missed call in under 60 seconds, even while you're still in the bucket. Live in 7 days or your first month is free.",
  micro: "Free audit · 60 seconds · No call required",
  /** The number itself comes from `caseStudy.giant`. */
  proofText: "Google clicks in 30 days, our most recent website build",
  proofHref: "#case",
  chips: ["Live in 7 days", "60-second text-back", "$0 down option"],
};

export const analyzer = {
  eyebrow: "Free audit",
  headline: "Next storm, your phone's going to ring. Be ready to answer it.",
  sub: "Free. 60 seconds. We'll email your report and show you exactly what we'd fix.",
  fields: {
    business: "Business name",
    website: "Website URL",
    email: "Email",
    phone: "Phone",
  },
  /** Shown above the form when someone clicks a "Start with…" pricing button. */
  planLabel: "Plan you picked:",
  planClear: "Clear",
  button: "Run My Free Audit",
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
  success: "Your report is on the way. Check your inbox in a few minutes.",
  startOver: "Check another business",
};

/** Cream band right under the hero. Plain statements only, no stats. */
export const pain = {
  headline: "Every missed call is a job you already paid to get.",
  lines: [
    "You're 40 feet up. The phone rings. You can't answer.",
    "They don't leave a voicemail. They call the next guy on Google.",
    "He picks up. He gets the job. You never even knew.",
  ],
};

export const beforeAfter = {
  eyebrow: "Before / After",
  headline: "Your truck looks like a pro. Does your website?",
  sub: "Same company. Left is what most tree sites look like. Right is what we build. Drag it.",
  before: { tag: "Before", text: "what most tree sites look like" },
  after: { tag: "After", text: "what we build" },
  caption: "Ridgeline is a made-up company, and its review is a sample. Shown as an example of our work.",
};

/**
 * RECENT WEBSITE CASE
 * Real numbers from a client build. Do not name or link the client.
 * No lead, call, or revenue numbers here — only what the reports show.
 * Each number counts up to `value`; `prefix`/`suffix` wrap it (e.g. "+153%").
 */
export const caseStudy = {
  eyebrow: "Recent website case",
  headline: "Not a prettier website. A website that gets found.",
  sub: "We rebuilt the structure, pages, speed and Google setup, not just the look. Here's the first 30 days.",
  giant: {
    prefix: "+",
    value: 153,
    decimals: 0,
    suffix: "%",
    line: "more clicks from Google in the first 30 days",
    detail: "151 → 382",
  },
  strip: [
    { prefix: "", value: 2.7, decimals: 1, suffix: "×", text: "Showed up on Google 2.7× as often", detail: "3.9K → 10.4K" },
    { prefix: "", value: 3, decimals: 0, suffix: "×", text: "More appearances in searches for the service, not just the name", detail: "1.97K → 5.84K" },
    { prefix: "+", value: 70, decimals: 0, suffix: "%", text: "Visitors from Google per day", detail: "16 → 28" },
    { prefix: "", value: 98, decimals: 0, suffix: "–100", text: "Mobile speed score", detail: "Google Lighthouse" },
  ],
  changesLabel: "What we changed",
  changes: ["Restructured pages for search", "Built for speed on mobile", "Clear paths to call or book"],
  finePrint:
    "Results from a recent client build, measured Sep 17–Oct 16 vs. Oct 18–Nov 16, 2026 (Google Search Console) and Sep 1–Oct 17 vs. Oct 18–Nov 17, 2026 (Google Analytics). Individual results vary and depend on market, season, and competition.",
};

/**
 * The fictional company used in the slider and phone demo.
 * Everything here (name, phone, rating, review) is made up for the sample.
 */
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
    utility: ["24/7 Storm Response", "Licensed & Insured", "Free Same-Day Quotes"],
    wordmark: ["Ridgeline", "Tree Co."],
    nav: ["Services", "Storm Damage", "Reviews", "Service Area"],
    phoneLabel: "Call 24/7",
    navQuote: "Free Quote",
    rating: "4.9",
    reviews: "212 Google Reviews",
    headline: ["Dangerous Tree?", "Gone Safely.", "Today."],
    sub: "Removals, trimming & 24/7 storm cleanup across Cedar Hollow. Fully insured. Spotless cleanup.",
    call: "Call Now",
    quote: "Get a Free Quote",
    trust: ["Fully Insured", "Same-Day Quotes", "Cleanup Included", "Family Owned"],
    review: {
      quote: "Took down a 70-ft oak hanging over our roof. Not a scratch, and the yard was cleaner than before.",
      name: "Sarah M., Cedar Hollow",
    },
    services: [
      { title: "Tree Removal", body: "Big, dead, or too close to the house." },
      { title: "Trimming & Pruning", body: "Healthier trees. Cleaner yard." },
      { title: "24/7 Storm Damage", body: "Crews on call day and night." },
      { title: "Stump Grinding", body: "Ground out below grade." },
    ],
    stickyCall: "Call Now — 24/7",
  },
};

export const speedToLead = {
  eyebrow: "Speed to lead",
  headline: "You're on the saw. We're on the phone.",
  caption: "Missed call → automatic text in under 60 seconds → they book an estimate. You call back when you're on the ground.",
  /** Big label beside the phone. */
  bigLabel: ["Under 60 seconds.", "Guaranteed."],
  replay: "Replay",
  contactName: "Homeowner",
  missedCall: { title: "Missed call", detail: "(615) 555-0188 · just now" },
  messages: [
    { from: "business", text: "Sorry we missed you! We're on a job. What can we help with?", tag: "Automatic text · under 60 seconds" },
    { from: "customer", text: "Hi, I've got a big dead oak leaning toward my house. Can someone come take a look?" },
    { from: "business", text: "We can help with that. Pick a time for a free estimate:", link: "ridgelinetree.com/book", tag: "Automatic reply" },
  ] as { from: "business" | "customer"; text: string; link?: string; tag?: string }[],
  booked: "Estimate booked: Thursday 10am",
};

/** Full-width photo band. */
export const photoBand = {
  line: "Storm season doesn't wait. Neither do your customers.",
};

/** "What you get" list + the 3-step strip. */
export const offer = {
  eyebrow: "What you get",
  headline: "Here's everything we take off your plate.",
  items: [
    { icon: "site", text: "A site built to get calls. Live in 7 days." },
    { icon: "map", text: "Your Google profile set up so you show up in Maps." },
    { icon: "text", text: "Every missed call texted back in under 60 seconds." },
    { icon: "star", text: "Review requests sent after every job, automatically." },
    { icon: "wrench", text: "Hosting, updates and fixes. Never your problem." },
    { icon: "report", text: "A one-page report every month: what came in and what's working." },
  ] as { icon: "site" | "map" | "text" | "star" | "wrench" | "report"; text: string }[],
  closing: { lead: "You do:", text: "answer the leads and run your crews." },
  steps: ["Free audit", "Live in 7 days", "We run it. You run crews."],
};

export const roi = {
  eyebrow: "Do the math",
  headline: "What's one more removal worth to you?",
  jobSize: { label: "Average job size", min: 300, max: 10000, step: 100, default: 1500 },
  extraJobs: { label: "Extra jobs per month", min: 1, max: 20, step: 1, default: 2 },
  resultLead: "That's",
  resultMonth: "more per month",
  resultYear: "per year.",
  note: "If this books you one extra job a month, it's paid for.",
  disclaimer: "Your numbers, your math. This is a calculator, not a promise.",
};

/**
 * PRICING
 * NOTE: `regular` prices take effect Jan 1 for new customers.
 * `price` is the year-end price, locked in for life for anyone who joins before Jan 1.
 */
export const pricing = {
  eyebrow: "Pricing",
  headline: "Pays for itself with one extra job.",
  /** The orange "sale" tag. */
  saleTag: "Year-end pricing, locked in for life. Ends Dec 31.",
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
  /** Plan buttons read "Start with <plan name>". */
  planCta: "Start with",
  swipeHint: "Swipe to compare plans",
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
      blurb: "Never lose a lead to voicemail again.",
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
      blurb: "Own your whole service area.",
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
    title: "Two ways to start",
    options: [
      { price: "$0 down", detail: "with a 6-month commitment" },
      { price: "$495 one-time setup", detail: "then month-to-month" },
    ],
    or: "or",
  },
};

export const comparison = {
  headline: "Three ways to get more work. Only one lets you stay on the saw.",
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

/** The ONLY two guarantees. Keep this wording. No results or money-back promises. */
export const guarantee = {
  eyebrow: "The guarantee",
  headline: "Two promises. In writing.",
  items: [
    { text: "Live in 7 days, or your first month is free." },
    { text: "Every missed call texted back in 60 seconds, or that month is free." },
  ],
  stamp: "Arbor Leads guarantee",
  note: "We won't promise you a magic number of calls. Anyone who does is guessing. We promise the work gets done, fast, and you see the numbers every month.",
  ownership: {
    lead: "And you're never trapped.",
    body: "Your domain, Google profile and reviews are always yours. Your site is yours after 6 months, or day one with the $495 setup.",
  },
};

export const about = {
  eyebrow: "Built by a former tree service owner",
  title: "I've run the saw. Now I run the phones.",
  copy: "I ran a tree service. I know you don't have time for marketing. You're running crews, quoting jobs and climbing. So we do it for you.",
  signature: "Ben, Founder of Arbor Leads",
  /**
   * Nothing below shows on the site until it's real:
   * - headshot: drop a photo in /public/images and set `src`, e.g. "/images/ben.jpg".
   * - stats: set a real `value` and `placeholder: false`.
   * - testimonials: fill in a real `quote` and `name`. Real quotes only.
   */
  headshot: { src: "", alt: "Ben, founder of Arbor Leads" },
  stats: [
    { value: 0, suffix: "+", label: "Jobs booked", placeholder: true },
    { value: 0, suffix: "+", label: "Reviews gained", placeholder: true },
    { value: 0, suffix: "+", label: "Calls saved", placeholder: true },
  ],
  testimonials: [
    { quote: "", name: "", company: "" },
    { quote: "", name: "", company: "" },
    { quote: "", name: "", company: "" },
  ],
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
      a: "Live in 7 days, or your first month is free.",
    },
    {
      q: "Do I own my site?",
      a: "Your domain, Google profile and reviews are always yours. Your site is yours after 6 months, or day one with the $495 setup.",
    },
    {
      q: "What's the commitment?",
      a: "Two ways to start: $0 down with a 6-month commitment, or a $495 one-time setup, then month-to-month.",
    },
    {
      q: "What if I cancel early?",
      a: "You can buy out your site for $495, or we take it down. Your domain, Google profile and reviews stay yours either way.",
    },
    {
      q: "What if I already have a website?",
      a: "Start with the free audit. We'll show you what we'd fix and why. A modern website is part of every plan.",
    },
    {
      q: "How is this hands-off?",
      a: "We build it, run it, and keep it working. You answer your leads and run your crews.",
    },
    {
      q: "How does the guarantee work?",
      a: "Two promises. Live in 7 days, or your first month is free. Every missed call texted back in 60 seconds, or that month is free. We won't promise you a magic number of calls.",
    },
  ],
};

export const footer = {
  line: "Built for tree service companies. More booked jobs, less chasing.",
  copyright: "© 2026 Arbor Leads.",
  links: [
    { label: "Pricing", href: "/#pricing" },
    { label: "Free Audit", href: "/#analyzer" },
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
