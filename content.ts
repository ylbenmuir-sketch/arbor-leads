/**
 * ─────────────────────────────────────────────────────────────
 *  ARBOR LEADS — ALL SITE COPY, PRICES AND STATS LIVE HERE.
 *  Edit this file and the whole site updates.
 *
 *  CLAIMS RULES
 *  - The only real stats are the Recent Website Case numbers, plus what
 *    Ben paid agencies himself (in `about`). Don't add others.
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
  /**
   * Plan buttons and the link under the audit form. They open NEXT_PUBLIC_BOOKING_URL,
   * or scroll to the audit form when it isn't set.
   */
  bookCall: "Book a 15-min call",
  ratherTalk: "Rather talk?",
};

/** Thin orange bar above the header. Days left are counted from `pricing.deadline`. */
export const announcement = {
  text: "Year-end pricing ends Dec 31",
  /** Phone version: "Year-end pricing · 37 days left". */
  textShort: "Year-end pricing",
  lock: "Locked in for life",
  daysLeft: "days left",
  dayLeft: "day left",
  lastDay: "Last day",
  href: "#pricing",
};

export const hero = {
  headline: "When your town searches “tree service near me,” it should be you.",
  /** These closing words go on their own line with the orange underline. Must match the headline exactly. */
  highlight: "it should be you.",
  subhead:
    "We build your website, work your Google profile every month so you show up on the map, and run ads when you want more work, so homeowners find you, trust you, and call. Live in 7 days or your first month is free.",
  /** Phones get a shorter subhead, small line, proof text and chips. Desktop uses the full ones. */
  subheadShort: "Websites, Google Maps and ads for tree companies. Live in 7 days or your first month is free.",
  micro: "Free Google audit · 60 seconds · No call required",
  microShort: "Free audit · 60 seconds",
  /** Quiet line with Ben's photo, under the small line above. */
  builtBy: "Built by a former tree service owner",
  /** The phone proof card: small label, then the number with this line. */
  proofEyebrow: "Recent project",
  proofTextShort: "Google clicks in 30 days",
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
  /** Phone version of the line above. */
  subShort: "Free. 60 seconds. We'll email your report.",
  fields: {
    name: "Your name",
    business: "Business name",
    city: "City you serve",
    website: "Website URL",
    email: "Email",
    phone: "Phone",
  },
  optional: "(optional)",
  websitePlaceholder: "No website? That's what we fix.",
  /** Shown above the form when someone clicks a "Start with…" pricing button. */
  planLabel: "Plan you picked:",
  /** Shown when someone clicks one of the "Two ways to start" buttons. */
  setupLabel: "Setup you picked:",
  planClear: "Clear",
  button: "Show Me Who's Beating Me",
  /** Button text while the form is sending. */
  sending: "Sending…",
  /** Shown above the button if the form couldn't be sent. */
  error: "That didn't go through. Please try again, or email us at",
  /** Small print under the button. The link goes to /privacy. */
  consent: {
    text: "By submitting, you agree to be contacted by Arbor Leads by email, phone or text about your audit. Msg & data rates may apply. Reply STOP to opt out. See our",
    link: "Privacy Policy",
  },
  /** `{email}` is replaced with the address they entered. The report is built and emailed in the background (lib/server/report). */
  success: "Your report is on its way to {email}.",
  successSub: "Usually within 10 minutes.",
  /** On the success screen, next to the booking button (only shown when NEXT_PUBLIC_BOOKING_URL is set). */
  bookAfter: "Want to go over it together?",
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

export const beforeAfter = {
  eyebrow: "Before / After",
  headline: "Your truck looks like a pro. Does your website?",
  sub: "Same company. Left is what most tree sites look like. Right is what we build. Drag it.",
  /** Phone version of the line above. */
  subShort: "Same company. Left is what most tree sites look like. Right is what we build.",
  /** "What you get": three short lines under the slider, with the plan note under them. */
  lines: [
    "A website built to get the call. Live in 7 days.",
    "Google and Maps set up so your town can find you.",
    "You stay on the saw. We handle the rest.",
  ],
  planNote: "On Get Booked and up, every missed call is texted back in 60 seconds.",
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
  /** PHONES ONLY: the case section is cut down to one idea and one number. */
  phone: {
    eyebrow: "Recent project · 30 days",
    headline: "One recent project. Here's what changed in 30 days.",
    line: "more Google clicks",
    note: "Past results from this project, not a promise.",
    how: "We rebuilt the structure, pages, speed and Google setup, not just the look.",
  },
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
  /** Payoff line under the headline (the calculator was cut, so it lives here). */
  payoff: "If this books you one extra job a month, it's paid for.",
  swipeHint: "Swipe to compare plans",
  /** Phones show the first 3 features of each plan, then this toggle. */
  seeAll: "See everything included",
  seeLess: "Show less",
  featuresShown: 3,
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

/** The ONLY two guarantees. Keep this wording. No results or money-back promises. */
export const guarantee = {
  items: [
    { text: "Live in 7 days, or your first month is free.", planNote: "" },
    { text: "Every missed call texted back in 60 seconds, or that month is free.", planNote: "On Get Booked & Dominate." },
  ],
  note: "We won't promise you a magic number of calls. Anyone who does is guessing. We promise the work gets done, fast, and you see the numbers every month.",
  /** The ownership promise as short lines under the plans. */
  ownershipShort: [
    "You're never trapped.",
    "Your domain, Google profile and reviews are always yours.",
    "Your site is yours after 6 months, or day one with the $495 setup.",
  ],
};

export const about = {
  eyebrow: "Built by a former tree service owner",
  title: "I built and sold a tree company. Now I help yours grow.",
  /** One paragraph per entry. Same story on phones and desktop. */
  copy: [
    "I ran a tree service for years. One slow month eats into the good ones, and at the end of the year you're left wondering where all the money went.",
    "I hired several marketing companies. Most produced nothing. The one that finally worked charged $4,000+ for a website, up to $3,450 a month, and a 12-month contract.",
    "After I sold my company, I built what I wish I'd had: a website and Google setup that actually gets found, priced for a tree company, with no year-long contract.",
  ],
  signature: "— Ben Muir, Founder",
  /** Big statement under the story. */
  pullQuote: "Nobody produced results. The one that did wanted me locked into a 12-month contract.",
  headshot: { src: "/ben-muir.png", alt: "Ben Muir, founder of Arbor Leads", caption: "Ben Muir · Founder, Arbor Leads" },
  /**
   * Nothing below shows on the site until it's real:
   * - stats: set a real `value` and `placeholder: false`.
   * - testimonials: fill in a real `quote` and `name`. Real quotes only.
   */
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
