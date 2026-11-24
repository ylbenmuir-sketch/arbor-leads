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
  tagline: "More tree jobs. Zero extra work.",
  seo: {
    title: "Arbor Leads | Websites, SEO & Lead Systems for Tree Service Companies",
    description:
      "We rebuild your tree service website, get you found on Google, and answer every lead in seconds. Built by a former tree service owner. $0 down. You own your site.",
  },
  /** The one call to action, repeated everywhere. */
  cta: "Get My Free Analysis",
};

export const marquee = [
  "Built for tree pros",
  "Never miss a call",
  "More 5-star reviews",
  "Live in 7 days",
  "You own your site",
];

export const hero = {
  headline: "More tree jobs. Zero extra work.",
  subhead:
    "We rebuild your website, get you found on Google, and answer every lead in seconds — while you're up the tree.",
  trustLine: "Built by a former tree service owner. $0 down. You own your site.",
};

export const analyzer = {
  inputLabel: "Enter your website",
  button: "See What It's Costing You →",
  scanSteps: [
    "Checking speed…",
    "Checking Google profile…",
    "Checking reviews…",
    "Checking mobile…",
  ],
  scoreLabel: "Your lead score",
  scoreVerdict: "You're losing jobs to the other guys.",
  redFlagsTitle: "3 red flags found",
  /** Shown blurred. Real findings come from the backend later. */
  redFlags: ["Red flag #1", "Red flag #2", "Red flag #3"],
  leadPrompt: "Get your full report free — where should we send it?",
  fields: {
    business: "Business name",
    email: "Email",
    phone: "Phone",
  },
  leadButton: "Send My Free Report",
  success: "Your report is on the way — check your inbox in a few minutes.",
  startOver: "Check another site",
};

export const problem = {
  eyebrow: "The problem",
  headline: "Good tree guys lose jobs every day. Not on the work. On the phone.",
  cards: [
    {
      title: "Missed calls are lost jobs.",
      body: "You're in the bucket. They call the next guy.",
      stat: { value: 62, suffix: "%", label: "of calls go unanswered", placeholder: true },
    },
    {
      title: "Slow replies lose the lead.",
      body: "Whoever answers first usually gets the job.",
      stat: { value: 78, suffix: "%", label: "hire the first to reply", placeholder: true },
    },
    {
      title: "An outdated site loses trust before you ever talk.",
      body: "They judge you in seconds. Then they hit back.",
      stat: { value: 3, suffix: " sec", label: "to make a first impression", placeholder: true },
    },
  ],
  placeholderNote: "Placeholder stat — swap in a sourced number",
};

export const beforeAfter = {
  eyebrow: "Before / After",
  headline: "Same company. Which one would you call?",
  sub: "Drag the handle.",
  before: "Before",
  after: "After",
  caption: "Ridgeline Tree Service is a made-up company. The difference is real.",
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
  caption: "That job used to go to whoever called back first. Now it's you.",
  replay: "Replay",
  contactName: "Homeowner",
  missedCall: { title: "Missed call", detail: "(615) 555-0188 · just now" },
  messages: [
    { from: "business", text: "Sorry we missed you! We're on a job. What can we help with?", tag: "Auto-text · sent in 4 sec" },
    { from: "customer", text: "Hi, I've got a big dead oak leaning toward my house. Can someone come take a look?" },
    { from: "business", text: "We can help with that. Pick a time for a free estimate:", link: "ridgelinetree.com/book", tag: "Auto-reply" },
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
};

export const howItWorks = {
  eyebrow: "How it works",
  headline: "Three steps. Then back to work.",
  steps: [
    { title: "Free analysis", body: "We show you what your site and Google profile are costing you. No pitch. Just the numbers." },
    { title: "We rebuild & launch in 7 days", body: "New site. Google profile fixed. Text-back switched on. You approve it, we launch it." },
    { title: "Leads roll in. We handle the rest.", body: "Updates, SEO, reviews, replies. You answer the leads and do the work." },
  ],
};

export const pricing = {
  eyebrow: "Pricing",
  headline: "Simple pricing. No surprises.",
  banner: {
    title: "Year-End Pricing",
    text: "locked in for life if you join by Dec 31",
    /** Countdown target. Local time of the visitor. */
    deadline: "2026-12-31T23:59:59",
    ended: "Year-end pricing has ended.",
  },
  toggle: { monthly: "Monthly", annual: "Annual", annualNote: "2 months free" },
  /** Annual = pay for (12 − monthsFree) months. */
  annualMonthsFree: 2,
  build: {
    title: "Website build",
    primary: { price: "$0 down", detail: "with a 6-month plan" },
    or: "or",
    secondary: { price: "$495 one-time", detail: "month-to-month" },
    note: "Most choose $0 down",
  },
  regularLabel: "Regular price",
  yearEndLabel: "Year-end price",
  perMonth: "/mo",
  perYear: "/yr",
  saveLabel: "You save",
  plans: [
    {
      name: "Get Found",
      blurb: "Show up when they search.",
      regular: 249,
      price: 149,
      priceSuffix: "",
      featured: false,
      features: [
        "Website hosting & updates",
        "Local SEO",
        "Google Business Profile management",
        "Automatic review requests",
        "2 change requests/month",
      ],
    },
    {
      name: "Get Booked",
      blurb: "Never lose a lead to a missed call.",
      regular: 499,
      price: 349,
      priceSuffix: "",
      featured: true,
      features: [
        "Everything in Get Found",
        "Missed-call text-back",
        "Instant replies to every lead",
        "Simple lead inbox",
        "90-day results report",
      ],
    },
    {
      name: "Dominate",
      blurb: "Own your town.",
      regular: 999,
      price: 749,
      priceSuffix: "+ ad spend",
      featured: false,
      features: [
        "Everything in Get Booked",
        "Google Local Services Ads & Meta ads managed",
        "Monthly results report",
      ],
    },
  ],
  featuredBadge: "Most Popular",
  trust: ["$0 down option", "You own your site", "Cancel after term", "Price locked for life"],
};

export const comparison = {
  headline: "Why tree companies are switching.",
  columns: { label: "", them: "Typical tree marketing agency", us: "Arbor Leads" },
  rows: [
    { label: "Monthly cost", them: "$1,299–$3,450/mo", us: "From $149/mo" },
    { label: "Setup fee", them: "$500–$5,000", us: "$0 down" },
    { label: "Contract", them: "12 months", us: "6 months or none" },
    { label: "Who owns the site", them: "Them", us: "You" },
    { label: "Missed-call text-back", them: "Extra", us: "Included" },
    { label: "Built by", them: "Marketers", us: "A former tree service owner" },
  ],
};

export const guarantee = {
  eyebrow: "The guarantee",
  headline: "More calls in 90 days, or we work free until you get them.",
  body: "Day one, we measure where you stand: your Google ranking, reviews, site speed, and every call and lead. At 90 days, you get the same report side by side. If your calls and leads aren't up, you don't pay another dime until they are.",
  smallPrint:
    "You just answer or call back leads within one business day and send review requests after jobs. We handle everything else.",
  exampleLabel: "Example report — not real client results",
  reports: [
    {
      title: "Day 1",
      metrics: [
        { label: "Google ranking", prefix: "#", value: 14, suffix: "" },
        { label: "Reviews", prefix: "", value: 23, suffix: "" },
        { label: "Site speed", prefix: "", value: 38, suffix: "/100" },
        { label: "Calls & leads / mo", prefix: "", value: 19, suffix: "" },
      ],
    },
    {
      title: "Day 90",
      metrics: [
        { label: "Google ranking", prefix: "#", value: 3, suffix: "" },
        { label: "Reviews", prefix: "", value: 61, suffix: "" },
        { label: "Site speed", prefix: "", value: 94, suffix: "/100" },
        { label: "Calls & leads / mo", prefix: "", value: 47, suffix: "" },
      ],
    },
  ],
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

export const faq = {
  headline: "Straight answers.",
  items: [
    {
      q: "Do I need to change my phone?",
      a: "No. You keep your number and your phone. We set up text-back to work with what you already have.",
    },
    {
      q: "How fast do you launch?",
      a: "7 days from the day you give us the green light. You look it over, we launch it.",
    },
    {
      q: "Do I own my site?",
      a: "Yes. Your domain, your content, your site. If you leave after your term, it goes with you.",
    },
    {
      q: "What's the commitment?",
      a: "Two ways to start. $0 down with a 6-month plan, or $495 one-time and go month-to-month. After your term, cancel anytime.",
    },
    {
      q: "What if I already have a website?",
      a: "Start with the free analysis. We'll show you what it's costing you. If it's good, we keep what works. If it's not, the rebuild is included.",
    },
    {
      q: "How is this hands-off?",
      a: "We build it, run it, and update it. You answer or call back your leads within one business day and send review requests after jobs. That's it.",
    },
    {
      q: "How does the guarantee work?",
      a: "Day one, we measure your Google ranking, reviews, site speed, and every call and lead. At 90 days you get the same report side by side. If calls and leads aren't up, you don't pay another dime until they are.",
    },
  ],
};

export const finalCta = {
  headline: "More tree jobs. Zero extra work.",
  sub: "See what your site is costing you. Free. Takes 30 seconds.",
};

export const footer = {
  copyright: "Arbor Leads. All rights reserved.",
  links: [
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
