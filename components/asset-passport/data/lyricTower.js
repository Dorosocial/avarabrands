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
  fileNo: "LT-440-HOU",
  asOf: "1 September 2026",
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

  // ── Live underwriting inputs (calculator defaults) ─────────────────────────
  underwriting: {
    noi: 5_489_581,
    capRate: { min: 4.5, max: 10, step: 0.05, initial: 9.35 },
    ltv: { min: 40, max: 75, step: 1, initial: 60 },
    rate: { min: 4.5, max: 9.5, step: 0.05, initial: 7.0 },
    amortYears: 30,
    dscrCovenant: 1.25,
  },

  // ── Investor KPIs ───────────────────────────────────────────────────────────
  kpis: [
    {
      label: "Net Operating Income",
      value: "$5.49M",
      sub: "Stabilised, Year 1",
      detail: "EGI $10.78M less $5.29M opex",
      trend: "+4.1% vs T-12",
      tone: "forest",
      source: "modeled",
    },
    {
      label: "Target Cap Rate",
      value: "9.35%",
      sub: "Going-in, unlevered",
      detail: "$58.75M basis · $152.60/SF",
      trend: "Houston CBD Class A",
      tone: "forest",
      source: "modeled",
    },
    {
      label: "Cash-on-Cash",
      value: "12.9%",
      sub: "Year 1, levered",
      detail: "60% LTV · 7.00% I/O · $23.5M equity",
      trend: "$3.02M cash flow",
      tone: "graphite",
      source: "modeled",
    },
    {
      label: "Building Size",
      value: "385,000",
      sub: "Rentable SF · 26 stories",
      detail: "Typical floor plate 15,750 SF",
      trend: "Built 1983 · Renovated 2016",
      tone: "neutral",
      source: "listing",
    },
    {
      label: "Occupancy",
      value: "91.6%",
      sub: "32,512 SF disclosed vacant",
      detail: "6 of 9 marketed suites quantified",
      trend: "3 suites undisclosed",
      tone: "ochre",
      source: "modeled",
    },
    {
      label: "WALT",
      value: "4.2 yrs",
      sub: "Weighted avg lease term",
      detail: "Marketed terms run 3–5 years",
      trend: "2027 roll is the cliff",
      tone: "graphite",
      source: "modeled",
    },
  ],

  // ── Component integrity / asset health ──────────────────────────────────────
  integrity: [
    {
      title: "Energy & MEP Systems",
      badge: "VERIFIED",
      rul: {
        remaining: 15, total: 25, unit: "yrs", pct: 60,
        basis: "Centrifugal chiller EUL 25 years (ASHRAE), installed 2016.",
      },
      exhibit: "C-2",
      inspection: {
        technician: "R. Alvarez, PE — Aegis Building Sciences",
        inspected: "2025-11-09",
        nextService: "2026-11-30",
        warranty: {
          component: "Trane CVHF centrifugal chiller (2 of 2)",
          serial: "CVHF-1250-0416-TX",
          term: "10-year parts & labour",
          expires: "2028-03-31",
        },
        notes: [
          "Both chillers benchmarked at 0.58 kW/ton against a 0.62 design point; no approach-temperature drift since the 2024 reading.",
          "Cooling tower fill replaced Q2 2025. Basin sweeper piping re-pitched to clear standing water.",
          "BAS migrated to Tracer SC+ in the 2016 program; trend logs retained back to 2019 and available in the vault.",
          "Open item: VAV boxes on floors 14-17 still pneumatic. Budgeted $340K to convert; not reflected in Year 1 opex.",
        ],
      },
      badgeMeta: "2025",
      tone: "forest",
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
      rul: {
        remaining: 10, total: 20, unit: "yrs", pct: 50,
        basis: "60-mil TPO membrane EUL 20 years, installed 2016. Curtain wall gaskets are the shorter-dated item.",
      },
      exhibit: "B-2",
      inspection: {
        technician: "M. Okonkwo, RRC — Sightline Roofing Consultants",
        inspected: "2026-06-02",
        nextService: "2027-06-01",
        warranty: {
          component: "Carlisle Sure-Weld TPO, 60-mil mechanically attached",
          serial: "SW60-2016-HOU-1140",
          term: "20-year NDL, transferable once",
          expires: "2036-08-12",
        },
        notes: [
          "Infrared scan across 15,750 SF of roof area found no subsurface moisture. Seams probed at 40 locations, all sound.",
          "Curtain wall gaskets original to 1983 on the north elevation; sealant replacement recommended within 36 months, est. $1.2M.",
          "Six traction elevators modernised 2016 (controllers and fixtures). Machine-room-less conversion not performed.",
          "Garage delivered 2019. Post-tension cable survey clean; no spalling observed at the ramps.",
        ],
      },
      badgeMeta: "2026",
      tone: "graphite",
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
      rul: null,
      exhibit: "B-1",
      inspection: {
        technician: "Assignment pending — Terracon Consultants, Inc.",
        inspected: "Not yet performed",
        nextService: "Site reconnaissance scheduled 2026-09-18",
        warranty: {
          component: "Not applicable — environmental assessment",
          serial: "—",
          term: "—",
          expires: "—",
        },
        notes: [
          "Prior Phase I dated 2016 is outside the ASTM E1527-21 viability window and cannot be relied upon at closing.",
          "1983 construction places the asset in the presumptive ACM and lead-paint window; an O&M plan is expected as a condition of the report.",
          "Historical Sanborn review flags a dry-cleaning tenancy two parcels north, 1961-1978. Vapour-encroachment screening requested.",
          "No recognised environmental conditions reported to date. Seller has funded the assessment; delivery expected inside the diligence window.",
        ],
      },
      badgeMeta: "PENDING",
      tone: "ochre",
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
    {
      exhibit: "A-1", name: "Certified Rent Roll", format: "PDF", size: "1.4 MB", pages: 34,
      audit: "2026-08-14", access: "vault",
      summary: "Tenant-by-tenant schedule of leased premises, commencement and expiration dates, base rent, escalations, recovery structure and security deposits, certified by the property manager.",
    },
    {
      exhibit: "A-2", name: "T-12 Operating Statement", format: "XLSX", size: "890 KB", pages: null,
      audit: "2026-08-14", access: "vault",
      summary: "Trailing twelve months of actual income and expense by GL account, with month-by-month detail and a reconciliation to the certified rent roll.",
    },
    {
      exhibit: "B-1", name: "Phase I Environmental Site Assessment", format: "PDF", size: "8.2 MB", pages: 212,
      audit: "—", access: "pending",
      summary: "ASTM E1527-21 assessment covering records review, site reconnaissance, interviews and a findings opinion on recognised environmental conditions.",
      expected: "Delivery expected 2026-10-02, inside the diligence window.",
    },
    {
      exhibit: "B-2", name: "Property Condition Assessment", format: "PDF", size: "6.1 MB", pages: 148,
      audit: "2026-06-02", access: "vault",
      summary: "ASTM E2018-15 baseline covering structure, envelope, roofing, vertical transportation and MEP, with a twelve-year capital reserve table.",
    },
    {
      exhibit: "C-1", name: "Harris County Tax Assessment", format: "PDF", size: "340 KB", pages: 6,
      audit: "2026-01-31", access: "open",
      summary: "2026 certified appraised value and levy detail from the Harris County Appraisal District.",
      excerpt: [
        "HARRIS COUNTY APPRAISAL DISTRICT — 2026 NOTICE OF APPRAISED VALUE",
        "Account 0231-0004-0011 · 440 LOUISIANA ST · HOUSTON TX 77002",
        "Land 4,918,400 · Improvement 47,206,300 · Total appraised 52,124,700",
        "Levy at 2.1842 per $100 assessed — 1,138,507.30 due 2027-01-31.",
      ],
    },
    {
      exhibit: "C-2", name: "ENERGY STAR Certificate — Score 80", format: "PDF", size: "210 KB", pages: 2,
      audit: "2025-11-09", access: "open",
      summary: "EPA Portfolio Manager statement of energy performance, professionally verified for the twelve months ended 30 September 2025.",
      excerpt: [
        "STATEMENT OF ENERGY PERFORMANCE — ENERGY STAR CERTIFIED",
        "Lyric Tower · 440 Louisiana St, Houston TX · 385,000 SF office",
        "ENERGY STAR score 80 (national median 50) · Period ending 2025-09-30",
        "Site EUI 61.4 kBtu/ft² · Source EUI 148.2 kBtu/ft² · Verified by R. Alvarez, PE.",
      ],
    },
    {
      exhibit: "D-1", name: "Title Commitment & ALTA Survey", format: "PDF", size: "4.4 MB", pages: 88,
      audit: "2026-05-20", access: "vault",
      summary: "T-7 commitment with Schedule B exceptions and a corresponding ALTA/NSPS land title survey showing easements and encroachments.",
    },
    {
      exhibit: "D-2", name: "Marketing Brochure & Stacking Plan", format: "PDF", size: "12.7 MB", pages: 24,
      audit: "2026-07-01", access: "open",
      summary: "Leasing brochure with floor-by-floor stacking plan, amenity summary and test-fit plans for the marketed suites.",
      excerpt: [
        "LYRIC TOWER — 440 LOUISIANA STREET, HOUSTON, TEXAS",
        "26 stories · 385,000 rentable SF · Class A · Built 1983, renovated 2016",
        "Stacking plan: 9 marketed suites, 1,574-15,231 SF, $20.00-$26.00 per SF.",
        "Amenities: Lyric Market Food Hall, fitness centre, conferencing, 894 parking stalls.",
      ],
    },
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
