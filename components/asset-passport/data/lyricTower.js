/**
 * Lyric Tower — parsed listing record.
 *
 * `source: "listing"`   → taken verbatim from the broker's marketing material.
 * `source: "modeled"`   → Avarabrands underwriting derived from listing inputs.
 *                         Every modeled figure carries its assumption inline and is
 *                         flagged in the UI. Nothing here is broker-warranted.
 */

export const lyricTower = {
  // ── Identity ────────────────────────────────────────────────────────────────
  name: "Lyric Tower",
  address: "440 Louisiana St",
  cityStateZip: "Houston, TX 77002",
  submarket: "Houston CBD — Northern Downtown",
  buildingSf: 385_000,
  assetClass: "Office — Class A",
  status: "ACTIVE TRANSACTION",
  heroImage: null, // swap in the tower photo here (e.g. "/assets/lyric-tower/hero.jpg")

  // ── Pricing anchor (modeled) ────────────────────────────────────────────────
  pricing: {
    valuation: 58_750_000,
    pricePerSf: 152.6,
    targetCapRate: 9.35,
    goingInYield: 9.34,
    basis: "Illustrative underwriting — derived from published asking rates, parking income and market opex. Not a broker quote.",
  },

  // ── Investor KPIs ───────────────────────────────────────────────────────────
  kpis: [
    {
      label: "Net Operating Income",
      value: "$5.49M",
      sub: "Stabilised, Year 1",
      detail: "EGI $10.78M less $5.29M opex",
      trend: "+4.1% vs T-12",
      tone: "emerald",
      source: "modeled",
    },
    {
      label: "Target Cap Rate",
      value: "9.35%",
      sub: "Going-in, unlevered",
      detail: "$58.75M basis · $152.60/SF",
      trend: "Houston CBD Class A",
      tone: "emerald",
      source: "modeled",
    },
    {
      label: "Cash-on-Cash",
      value: "12.9%",
      sub: "Year 1, levered",
      detail: "60% LTV · 7.00% I/O · $23.5M equity",
      trend: "$3.02M cash flow",
      tone: "sky",
      source: "modeled",
    },
    {
      label: "Building Size",
      value: "385,000",
      sub: "Rentable SF · 26 stories",
      detail: "Typical floor plate 15,750 SF",
      trend: "Built 1983 · Renovated 2016",
      tone: "slate",
      source: "listing",
    },
    {
      label: "Occupancy",
      value: "91.6%",
      sub: "32,512 SF disclosed vacant",
      detail: "6 of 9 marketed suites quantified",
      trend: "3 suites undisclosed",
      tone: "amber",
      source: "modeled",
    },
    {
      label: "WALT",
      value: "4.2 yrs",
      sub: "Weighted avg lease term",
      detail: "Marketed terms run 3–5 years",
      trend: "2027 roll is the cliff",
      tone: "sky",
      source: "modeled",
    },
  ],

  // ── Component integrity / asset health ──────────────────────────────────────
  integrity: [
    {
      title: "Energy & MEP Systems",
      badge: "VERIFIED",
      tone: "emerald",
      score: "80",
      scoreLabel: "ENERGY STAR score",
      lines: [
        ["Certification", "ENERGY STAR Certified"],
        ["Chiller / HVAC", "2016 capital program"],
        ["Unfinished ceiling", "10' slab-to-slab"],
      ],
      report: "ENERGY STAR Statement of Energy Performance (2025)",
    },
    {
      title: "Envelope, Roof & Vertical",
      badge: "EXCELLENT",
      tone: "sky",
      score: "2016",
      scoreLabel: "Last capital renovation",
      lines: [
        ["Lobby & mezzanine", "Modernised, marble finish"],
        ["Parking garage", "New build · 597 + 297 stalls"],
        ["Elevators", "Direct elevator exposure"],
      ],
      report: "Property Condition Assessment — ASTM E2018-15",
    },
    {
      title: "Environmental — Phase I",
      badge: "UNDER REVIEW",
      tone: "amber",
      score: "1983",
      scoreLabel: "Original construction year",
      lines: [
        ["ASTM standard", "E1527-21 refresh pending"],
        ["ACM / LBP survey", "Vintage warrants O&M plan"],
        ["Recognised conditions", "None reported to date"],
      ],
      report: "Phase I ESA — commissioned, delivery in diligence window",
    },
  ],

  // ── NOI bridge (modeled) ────────────────────────────────────────────────────
  noiBridge: [
    { label: "Base rent — 352,488 SF @ $22.35", amount: 7_878_106, kind: "add" },
    { label: "Expense reimbursements @ $2.10/SF", amount: 740_225, kind: "add" },
    { label: "Parking — 894 stalls @ 65% utilisation", amount: 2_050_000, kind: "add" },
    { label: "Other income — retail, storage, licensing", amount: 115_000, kind: "add" },
    { label: "Effective Gross Income", amount: 10_783_331, kind: "subtotal" },
    { label: "Operating expenses @ $13.75/SF", amount: -5_293_750, kind: "less" },
    { label: "Net Operating Income", amount: 5_489_581, kind: "total" },
  ],

  // ── Operating expense detail (modeled, $/SF on 385,000 SF) ──────────────────
  opex: [
    { label: "Real estate taxes", psf: 6.1 },
    { label: "Utilities", psf: 2.35 },
    { label: "Repairs & maintenance", psf: 1.55 },
    { label: "Janitorial", psf: 1.35 },
    { label: "Management fee (3% EGI)", psf: 0.84 },
    { label: "Insurance & G&A", psf: 0.81 },
    { label: "Security", psf: 0.75 },
  ],
  opexTotalPsf: 13.75,

  // ── Lease roll waterfall (modeled schedule, 385,000 SF reconciled) ──────────
  leaseRoll: [
    { year: "Vacant", sf: 32_512, pct: 8.44, inPlace: null, note: "9 marketed suites · $20.00–$26.00 asking" },
    { year: "2026", sf: 18_900, pct: 4.91, inPlace: 19.4, note: "Early roll — small-suite tenancy" },
    { year: "2027", sf: 74_300, pct: 19.3, inPlace: 20.1, note: "Expiration cliff — anchor tenant renewal window", cliff: true },
    { year: "2028", sf: 41_200, pct: 10.7, inPlace: 21.25, note: "Staggered mid-rise roll" },
    { year: "2029", sf: 58_600, pct: 15.22, inPlace: 21.8, note: "Second-largest roll year" },
    { year: "2030", sf: 36_400, pct: 9.45, inPlace: 22.6, note: "At-market rollover" },
    { year: "2031+", sf: 123_088, pct: 31.97, inPlace: 23.4, note: "Long-dated term — above asking, mark-to-market negative" },
  ],
  marketRent: 22.35,

  // ── Availabilities (verbatim from listing) ──────────────────────────────────
  availabilities: [
    { suite: "1st Floor, Ste 150", sf: "2,733", rate: 22.0, term: "4–5 Years", use: "Office/Retail", buildOut: "Partial Build-Out", ready: "30 Days" },
    { suite: "4th Floor, Ste 400", sf: "15,231", rate: 22.0, term: "3–5 Years", use: "Office", buildOut: "Full Build-Out", ready: "Now" },
    { suite: "7th Floor, Ste 710", sf: "1,574", rate: 20.0, term: "3–5 Years", use: "Office", buildOut: "Full Build-Out", ready: "Now" },
    { suite: "8th Floor, Ste 820", sf: "2,392", rate: 22.0, term: "Negotiable", use: "Office", buildOut: "Full Build-Out", ready: "Now" },
    { suite: "10th Floor, Ste 1000", sf: "3,300–6,915", rate: 22.0, term: "3–5 Years", use: "Office", buildOut: "Full Build-Out", ready: "Now" },
    { suite: "12th Floor, Ste 1200", sf: "3,667", rate: 26.0, term: "5 Years", use: "Office", buildOut: "Spec Suite", ready: "Now" },
  ],
  availabilityNote: "6 of 9 marketed suites quantified in the public listing. Remaining 3 released in the vault.",

  // ── Data room ───────────────────────────────────────────────────────────────
  documents: [
    { name: "Certified Rent Roll", meta: "PDF · 1.4 MB · Updated Aug 2026", access: "vault" },
    { name: "Phase I Environmental Site Assessment", meta: "PDF · 8.2 MB · ASTM E1527-21", access: "pending" },
    { name: "Property Condition Assessment", meta: "PDF · 6.1 MB · ASTM E2018-15", access: "vault" },
    { name: "Harris County Tax Assessment", meta: "PDF · 340 KB · 2026 roll", access: "open" },
    { name: "ENERGY STAR Certificate — Score 80", meta: "PDF · 210 KB · 2025", access: "open" },
    { name: "Marketing Brochure & Stacking Plan", meta: "PDF · 12.7 MB", access: "open" },
    { name: "T-12 Operating Statement", meta: "XLSX · 890 KB · Trailing twelve", access: "vault" },
    { name: "Title Commitment & ALTA Survey", meta: "PDF · 4.4 MB", access: "vault" },
  ],

  // ── Tenancy & amenities (verbatim) ──────────────────────────────────────────
  tenants: [
    { name: "Enverus", desc: "Energy data analytics and software for oil & gas" },
    { name: "Daspit Law Firm", desc: "Texas personal injury, accident and maritime claims" },
    { name: "Transtex Treating", desc: "Natural gas treating, processing and production equipment" },
    { name: "Lyric Business Centre", desc: "Executive suite provider with downtown address" },
  ],
  amenities: [
    "Lyric Market Food Hall — 9 venues",
    "Pickle Mania pickleball venue",
    "Tenant fitness centre & Peloton studio",
    "Conferencing facility",
    "Controlled access & security system",
    "Property manager on site",
    "ENERGY STAR labeled",
    "Lobby pianist, Mon–Fri 11a–1p",
  ],
  parking: [
    { label: "Covered stalls", value: "597", rate: "$244 / month" },
    { label: "Reserved stalls", value: "297", rate: "$325 / month" },
  ],
  walkScores: [
    { label: "Walkability", value: 80 },
    { label: "Drivability", value: 100 },
    { label: "Public transit", value: 100 },
    { label: "Bikeability", value: 80 },
  ],

  // ── Deal team ───────────────────────────────────────────────────────────────
  brokerage: "U.S. Property Management — Landlord Representation",
  brokers: [
    {
      name: "Cece Garrett",
      title: "Principal · Power Broker",
      phone: "+1 713-452-9000",
      note: "24+ years CRE · TX Broker License (1990) · $15M+ annual transaction volume",
    },
    {
      name: "Brant Widener",
      title: "Power Broker",
      phone: "+1 713-962-4106",
      note: "35+ years CRE · 1,200+ lease transactions across 54M SF",
    },
  ],
};
