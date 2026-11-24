/**
 * ─────────────────────────────────────────────────────────────
 *  ARBOR LEADS — ALL SITE COPY, PRICES AND STATS LIVE HERE.
 *  Edit this file and the whole site updates.
 *
 *  CLAIMS RULES
 *  - The only real stats are the Recent Website Case numbers, plus what
 *    Ben paid agencies himself (in `comparison` and `about`). Don't add others.
 *  - The only guarantees are the two in `guarantee.items`.
 *  - No ranking, call-volume or results promises.
 *  - Missed-call text-back and review requests are Get Booked & up.
 *    Every plan gets a monthly report. Ads and extra service-area pages are Dominate.
 *    Don't write copy that implies every plan includes them.
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
      "Websites, Google Maps and ads for tree service companies, so homeowners in your town find you, trust you, and call. Built by a former tree service owner.",
  },
  /** The main call to action (orange buttons). */
  cta: "Who's Beating Me?",
  /** Short version for the header on phones and the sticky bar. */
  ctaShort: "Who's Beating Me?",
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
  "Websites that get calls",
  "Google & Maps",
  "Review growth",
  "Ads when you want more work",
  "Live in 7 days",
  "$0 down option",
];

export const hero = {
  headline: "When your town searches “tree service near me,” it should be you.",
  /** These closing words go on their own line with the orange underline. Must match the headline exactly. */
  highlight: "it should be you.",
  subhead:
    "We build your website, work your Google profile every month so you show up on the map, and run ads when you want more work, so homeowners find you, trust you, and call. Live in 7 days or your first month is free.",
  micro: "Free Google audit · 60 seconds · No call required",
  /** The number itself comes from `caseStudy.giant`. */
  proofText: "Google clicks in 30 days, our most recent website build",
  proofHref: "#case",
  chips: ["Website live in 7 days", "Google Maps optimized", "$0 down option"],
};

/**
 * The made-up Google Maps result shown beside the hero. It uses the same
 * fictional company as the before/after slider and is captioned "Example."
 */
export const mapPack = {
  query: "tree service near me",
  marker: "#1",
  top: { name: "Ridgeline Tree Service", rating: "4.9", count: "(212)", hours: "Open 24 hours", call: "Call", website: "Website" },
  others: ["Tree Company", "Tree & Stump Co."],
  caption: "Example of what we aim for.",
};

export const analyzer = {
  eyebrow: "Free audit",
  /** Short line above the headline. */
  vibe: "Next storm, your phone's going to ring. Make sure it's yours.",
  headline: "See who's beating you on Google, and how to pass them.",
  sub: "Free. 60 seconds. We'll email your report and show you exactly what we'd fix.",
  fields: {
    business: "Business name",
    website: "Website URL",
    email: "Email",
    phone: "Phone",
  },
  /** Shown above the form when someone clicks a "Start with…" pricing button. */
  planLabel: "Plan you picked:",
  /** Shown when someone clicks one of the "Two ways to start" buttons. */
  setupLabel: "Setup you picked:",
  planClear: "Clear",
  button: "Run My Free Audit",
  /** Small print under the button. The link goes to /privacy. */
  consent: {
    text: "By submitting, you agree to be contacted by Arbor Leads by email, phone or text about your audit. Msg & data rates may apply. Reply STOP to opt out. See our",
    link: "Privacy Policy",
  },
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
  headline: "If they can't find you, they can't hire you.",
  lines: [
    "Someone in your town just searched “tree removal near me.”",
    "Three companies showed up on the map. You weren't one of them.",
    "They called the first one. He's booked through next week.",
  ],
};

/** "How we grow you": the three pillars. `tag` says which plans include it. */
export const pillars = {
  eyebrow: "How we grow you",
  headline: "Get found. Get chosen. Get the call.",
  items: [
    {
      icon: "site",
      title: "A website that sells.",
      body: "Built to turn a search into a phone call. Fast on mobile, clear prices and services, one-tap call. Live in 7 days.",
      tag: "All plans",
    },
    {
      icon: "map",
      title: "Google & Maps.",
      body: "Your Google Business Profile set up and worked every month, plus local SEO and service-area pages, so you show up where your town is looking.",
      tag: "All plans",
    },
    {
      icon: "ads",
      title: "Ads when you want more work.",
      body: "Google and Facebook ads managed for you. You set the budget; ad spend goes straight to Google and Meta.",
      tag: "Dominate plan",
    },
  ] as { icon: "site" | "map" | "ads"; title: string; body: string; tag: string }[],
  also: {
    text: "And no lead slips through: every missed call texted back in under 60 seconds, plus automatic review requests.",
    tag: "Get Booked & up",
  },
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
  /** Small orange tag above the headline. */
  tag: "Case study · Real client",
  headline: "One recent project. 30 days after launch.",
  sub: "We rebuilt the structure, pages, speed and Google setup, not just the look. Here's what changed.",
  /** The "job ticket" row. Keep it general enough that the client can't be identified. */
  ticket: [
    { icon: "project", label: "Project", value: "Local service business" },
    { icon: "rebuild", label: "Rebuild", value: "Old WordPress → Arbor build" },
    { icon: "measured", label: "Measured", value: "30 days before vs. 30 days after" },
    { icon: "source", label: "Source", value: "Google Search Console & Analytics" },
  ] as { icon: "project" | "rebuild" | "measured" | "source"; label: string; value: string }[],
  giant: {
    prefix: "+",
    value: 153,
    decimals: 0,
    suffix: "%",
    line: "more clicks from Google, 30 days after launch",
    detail: "151 → 382",
  },
  strip: [
    { prefix: "", value: 2.7, decimals: 1, suffix: "×", text: "Showed up on Google 2.7× as often", detail: "3.9K → 10.4K" },
    { prefix: "", value: 3, decimals: 0, suffix: "×", text: "More appearances in searches for the service, not just the name", detail: "1.97K → 5.84K" },
    { prefix: "+", value: 70, decimals: 0, suffix: "%", text: "Visitors from Google per day", detail: "16 → 28" },
    { prefix: "", value: 98, decimals: 0, suffix: "–100", text: "Mobile speed score", detail: "Google Lighthouse" },
  ],
  /** Tiny label at the bottom of each stat card. */
  cardLabel: "This project",
  changesLabel: "What we changed",
  changes: ["Restructured pages for search", "Built for speed on mobile", "Clear paths to call or book"],
  resultsNote: "Your results will depend on your market, season and competition. We show you your own numbers every month.",
  /** Small text beside the button at the end of the section. */
  ctaNote: "See where your site stands. Free.",
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
  eyebrow: "And when they call",
  headline: "You're on the saw. We're on the phone.",
  caption: "Missed call → automatic text in under 60 seconds → they book an estimate. You call back when you're on the ground.",
  /** Big label beside the phone. */
  bigLabel: ["Under 60 seconds.", "Guaranteed."],
  planNote: "On Get Booked & Dominate.",
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
  /** `tag` marks anything that isn't in every plan. Leave it "" for all plans. */
  items: [
    { icon: "site", text: "A site built to get calls. Live in 7 days.", tag: "" },
    { icon: "map", text: "Your Google profile set up so you show up in Maps.", tag: "" },
    { icon: "search", text: "Local SEO basics built in. Extra service-area pages on Dominate.", tag: "" },
    { icon: "star", text: "Review requests sent after every job, automatically.", tag: "Get Booked & up" },
    { icon: "text", text: "Every missed call texted back in under 60 seconds.", tag: "Get Booked & up" },
    { icon: "ads", text: "Google and Facebook ads, managed for you.", tag: "Dominate" },
    { icon: "wrench", text: "Hosting, updates and fixes. Never your problem.", tag: "" },
    { icon: "report", text: "A one-page report every month: what came in and what's working.", tag: "" },
  ] as { icon: "site" | "map" | "search" | "star" | "text" | "ads" | "wrench" | "report"; text: string; tag: string }[],
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
  sub: "Priced by someone who's paid agency prices, and knows what tree margins can handle.",
  /** The orange "sale" tag. */
  saleTag: "Year-end pricing, locked in for life. Ends Dec 31.",
  /** Phone version: the tag and the countdown share one small block. */
  saleTagShort: "Year-end pricing, locked in for life.",
  endsShort: "Ends Dec 31",
  leftShort: "left",
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
      blurb: "Get found on Google.",
      regular: 249,
      price: 149,
      priceSuffix: "",
      featured: false,
      features: [
        "Modern website",
        "Google Business Profile setup + optimization",
        "Local SEO basics",
        "Hosting and updates",
        "Simple monthly report",
      ],
    },
    {
      name: "Get Booked",
      blurb: "Get found, then book every lead.",
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
      blurb: "Own your service area.",
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
      { id: "zero-down", price: "$0 down", detail: "with a 6-month commitment" },
      { id: "495-setup", price: "$495 one-time setup", detail: "then month-to-month" },
    ],
    or: "or",
  },
};

/**
 * COMPARISON
 * The agency figures are what Ben paid tree-service marketing companies
 * himself. Update `finePrint` if you change them. Never name a competitor here.
 */
export const comparison = {
  headline: "Three ways to get more work. Only one lets you stay on the saw.",
  /** Bold strip above the table. */
  callout: "I paid $4,000+ for a website and $500–$3,450 a month for marketing. Arbor Leads starts at $0 down and $149 a month.",
  columns: { us: "Arbor Leads", agency: "Tree-service marketing agencies", diy: "Doing it yourself" },
  /** `big: true` makes the Arbor Leads cell larger so the price gap stands out. */
  rows: [
    { label: "Website build", us: "$0 down or $495", agency: "$4,000+", diy: "You build it", big: true },
    { label: "Monthly cost", us: "From $149/mo", agency: "$500–$3,450/mo", diy: "Free, but it's your time", big: true },
    { label: "Contract", us: "6 months or month-to-month", agency: "Often 12 months", diy: "None", big: false },
    { label: "Missed-call text-back", us: "In Get Booked and up", agency: "Often extra", diy: "You set it up", big: false },
    { label: "Time to launch", us: "7 days", agency: "Varies", diy: "Whenever you find time", big: false },
    { label: "Built by", us: "A former tree service owner", agency: "Marketers", diy: "You, after work", big: false },
  ],
  finePrint: "Agency figures based on what our founder paid tree-service marketing companies. Prices vary by provider.",
};

/** The ONLY two guarantees. Keep this wording. No results or money-back promises. */
export const guarantee = {
  eyebrow: "The guarantee",
  headline: "Two promises. In writing.",
  items: [
    { text: "Live in 7 days, or your first month is free.", planNote: "" },
    { text: "Every missed call texted back in 60 seconds, or that month is free.", planNote: "On Get Booked & Dominate." },
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
  /** One paragraph per entry. */
  copy: [
    "I owned a tree service. I know how tight the margins are: fuel, insurance, equipment, payroll, and a slow month can wipe out a good one.",
    "I hired multiple tree service marketing companies. Most took my money and produced nothing. The one that finally did? It cost $4,000+ for the website, up to $3,450 a month, and locked me into a 12-month contract.",
    "So I built what I wished I could have bought: a website and Google setup that actually gets found, at a price that makes sense for a tree company, without trapping you in a year-long contract.",
  ],
  signature: "— Ben Muir, Founder",
  /** Big statement under the story. */
  pullQuote: "Nobody produced results. The one that did wanted 12 months of my money up front.",
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
      a: "Two promises. Live in 7 days, or your first month is free. Every missed call texted back in 60 seconds, or that month is free (on Get Booked & Dominate). We won't promise you a magic number of calls.",
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

/**
 * PRIVACY POLICY + TERMS
 * Generic template — have it reviewed before relying on it.
 * Each section is a heading and a list of paragraphs.
 */
export const legal = {
  effectiveLabel: "Effective",
  effective: "November 24, 2026",
  back: "← Back to home",
  privacy: {
    title: "Privacy Policy",
    intro: "This is the plain-English version of how Arbor Leads handles your information.",
    sections: [
      {
        h: "Who we are",
        p: ["Arbor Leads builds and runs websites, Google profiles, ads and lead follow-up for tree service companies. You can reach us at hello@arborleads.co."],
      },
      {
        h: "What we collect",
        p: [
          "What you give us: your business name, website URL, name, email, phone number, and which plan you're interested in.",
          "What the site collects on its own: basic analytics and cookies, like which pages were visited and what kind of device was used.",
        ],
      },
      {
        h: "Why we collect it",
        p: ["To send you the free audit you asked for, to contact you about it, and to provide our services if you become a customer."],
      },
      {
        h: "We don't sell your information",
        p: ["We do not sell your personal information."],
      },
      {
        h: "Service providers",
        p: ["We use other companies for hosting, email, text messaging and analytics. They get only what they need to run the service for us, and they may use it only for that."],
      },
      {
        h: "Text messages (SMS)",
        p: [
          "We will not share your mobile number or SMS opt-in consent with third parties or affiliates for marketing purposes. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help.",
        ],
      },
      {
        h: "How long we keep it",
        p: ["We keep your information for as long as we need it for the reasons above, or as long as the law requires. After that we delete it."],
      },
      {
        h: "Seeing or deleting your information",
        p: ["Email hello@arborleads.co and ask. We'll show you what we have, or delete it."],
      },
      {
        h: "Children",
        p: ["This site is for businesses. It is not directed to children under 13, and we don't knowingly collect their information."],
      },
      {
        h: "Changes",
        p: ["If we change this policy, we'll post the new version here and update the effective date."],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "These terms cover your use of this site and the services you buy from Arbor Leads.",
    sections: [
      {
        h: "What we do",
        p: ["Depending on your plan, we build and host your website, set up and manage your Google Business Profile, handle local SEO, text back missed calls, send review requests, send a monthly report, and manage ads. Your plan lists exactly what's included."],
      },
      {
        h: "Two ways to start",
        p: [
          "$0 down with a 6-month commitment, or a $495 one-time setup and then month-to-month.",
          "Plans are billed monthly, or yearly at the annual price shown on the pricing page.",
        ],
      },
      {
        h: "What you own",
        p: ["Your domain, Google Business Profile and reviews are always yours. Your website is yours after 6 months, or from day one with the $495 setup."],
      },
      {
        h: "Our two guarantees",
        p: [
          "Live in 7 days, or your first month is free. The 7 days start once you've given us the information and access we ask for at signup.",
          "Every missed call texted back in 60 seconds, or that month is free. This applies to the Get Booked and Dominate plans once text-back is switched on for your number. It doesn't cover calls from numbers that can't receive texts, or outages at phone carriers.",
        ],
      },
      {
        h: "What we don't guarantee",
        p: ["We don't guarantee rankings, a number of calls or leads, or revenue. Results depend on your market, season and competition."],
      },
      {
        h: "Ad spend",
        p: ["On the Dominate plan you set the ad budget. Ad spend is paid by you directly to Google and Meta, and is separate from our fee."],
      },
      {
        h: "Cancelling",
        p: [
          "Month-to-month plans can be cancelled at any time, effective at the end of the current billing period.",
          "If you cancel a 6-month commitment early, you can buy out your site for $495, or we take it down. Your domain, Google Business Profile and reviews stay yours either way.",
        ],
      },
      {
        h: "Text messages (SMS)",
        p: ["If you give us your number, we may text you about your audit or your account. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out, HELP for help. See the Privacy Policy for how we handle your number."],
      },
      {
        h: "Limit of liability",
        p: ["Our services are provided as-is. To the extent the law allows, we aren't liable for indirect or lost-profit damages, and our total liability is limited to what you paid us in the 3 months before the claim."],
      },
      {
        h: "Governing law",
        p: ["These terms are governed by the laws of the State of Tennessee. Any dispute will be handled in the courts of Maury County, Tennessee."],
      },
      {
        h: "Contact",
        p: ["Questions about these terms? Email hello@arborleads.co."],
      },
    ],
  },
};
