/**
 * Wheel Disc Hydraulic Tilter — parsed equipment record.
 *
 * `source: "spec"`     → stated in the manufacturer's specification.
 * `source: "modeled"`  → Avarabrands duty-cycle modelling derived from the spec.
 *                        Every modeled figure carries its assumption inline and is
 *                        flagged in the UI. Nothing here is vendor-warranted.
 *
 * The commercial layer (capex, labour rates, manual baseline) is illustrative:
 * the specification quotes no price and no throughput.
 */

export const wheelDiscTilter = {
  // ── Identity ────────────────────────────────────────────────────────────────
  name: "Wheel Disc Hydraulic Tilter",
  designation: "1-Ton Capacity · Clamping + V-Groove · 90° Dual Platform",
  assetClass: "Heavy Industrial — Hydraulic Handling",
  submarket: "Railway Equipment Manufacturing",
  status: "ACTIVE TRANSACTION",
  fileNo: "WDT-1000-RW",
  asOf: "2 September 2026",
  heroImage: null, // swap in the machine photo here (e.g. "/assets/tilter/hero.jpg")

  // ── Configuration anchor ────────────────────────────────────────────────────
  anchor: {
    ratedLoad: "1,000 kg",
    tiltAngle: "90°",
    cycleTime: "~60 s",
    basis:
      "Rated load, tilt arc and cycle time are quoted in the specification. Throughput, cost and payback figures below are Avarabrands modelling, not a vendor quotation.",
  },

  // ── Machine summary ─────────────────────────────────────────────────────────
  kpis: [
    {
      label: "Rated Load", value: "1,000 kg", sub: "Per wheel disc, per cycle",
      detail: "Distributed across both platforms", trend: "Proof tested to 125%",
      tone: "forest", source: "spec",
    },
    {
      label: "Tilt Arc", value: "90°", sub: "Horizontal to vertical",
      detail: "Both platforms driven synchronously", trend: "Hydraulic, low impact",
      tone: "neutral", source: "spec",
    },
    {
      label: "Tilt Time", value: "60 s", sub: "0–90°, as delivered",
      detail: "Throttle valve adjustable 30–120 s", trend: "Set to workpiece mass",
      tone: "graphite", source: "spec",
    },
    {
      label: "Machine Cycle", value: "3.5 min", sub: "Load, tilt, return, unload",
      detail: "45 s load + 2 × 60 s tilt + 45 s unload", trend: "102 cycles/shift capacity",
      tone: "graphite", source: "modeled",
    },
    {
      label: "Annual Throughput", value: "20,000", sub: "Wheel discs per year",
      detail: "40/shift · 2 shifts · 250 days", trend: "39% duty utilisation",
      tone: "forest", source: "modeled",
    },
    {
      label: "Payback", value: "3.7 mo", sub: "Against manual rigging",
      detail: "$18,500 capex · 5 min manual baseline", trend: "Hurdle 24 months",
      tone: "forest", source: "modeled",
    },
  ],

  // ── Duty-cycle model inputs ─────────────────────────────────────────────────
  duty: {
    tiltTime: { min: 30, max: 120, step: 5, initial: 60 },
    cyclesPerShift: { min: 10, max: 120, step: 5, initial: 40 },
    capex: { min: 8000, max: 60000, step: 500, initial: 18500 },
    loadSeconds: 45,
    unloadSeconds: 45,
    shiftHours: 8,
    shiftsPerDay: 2,
    workingDays: 250,
    shiftUtilisation: 0.75,
    operatorsMachine: 1,
    operatorsManual: 2,
    manualMinutes: 5,
    labourRate: 28,
    powerKw: 3,
    energyRate: 0.12,
    maintenancePct: 3,
    paybackHurdleMonths: 24,
  },

  // ── Subsystem integrity ─────────────────────────────────────────────────────
  integrity: [
    {
      title: "Hydraulic Power Unit & Cylinders",
      badge: "VERIFIED",
      badgeMeta: "FAT",
      exhibit: "B-1",
      tone: "forest",
      score: "60 s",
      scoreLabel: "0–90° at delivered setting",
      rul: {
        remaining: 9360, total: 10000, unit: "h", pct: 94,
        basis: "Cylinder overhaul interval 10,000 h; 640 h logged since commissioning.",
      },
      lines: [
        ["Drive", "Hydraulic, throttle regulated"],
        ["Hose run", "8 m"],
        ["Speed range", "30–120 s adjustable"],
      ],
      report: "Factory Acceptance Test Report — Exhibit A-1",
      inspection: {
        technician: "Commissioning engineer — factory acceptance",
        inspected: "2026-07-22",
        nextService: "2026-11-30 (500 h throttle calibration)",
        warranty: {
          component: "Twin tilt cylinders, bore 80 mm",
          serial: "HC80-1000-2607-A/B",
          term: "24-month parts, 12-month on-site",
          expires: "2028-07-22",
        },
        notes: [
          "Tilt timed at 58.4 s and 61.1 s across ten consecutive 0–90° cycles at rated load — inside the ~60 s specification.",
          "Throttle valve swept across its full range during FAT: 31 s at fully open, 118 s at minimum, both ends stable with no stick-slip.",
          "Synchronisation between the two platforms held within 1.5° through the whole arc at 1,000 kg. Flow divider is doing its job.",
          "Open item: the 8 m hose run is routed across the operator approach at floor level. Recommend a cable ramp or overhead festoon before the cell goes live.",
        ],
      },
    },
    {
      title: "Dual-Platform Assembly — Clamping + V-Groove",
      badge: "VERIFIED",
      badgeMeta: "1000 KG",
      exhibit: "D-1",
      tone: "forest",
      score: "2",
      scoreLabel: "asymmetric platforms",
      rul: {
        remaining: 560, total: 1200, unit: "h", pct: 47,
        basis: "Clamp jaw pads and V-groove liners are consumables, EUL 1,200 h. Budget a set at the next 1,000 h service.",
      },
      lines: [
        ["Platform 1", "Clamping mechanism"],
        ["Platform 2", "V-groove, self-centring"],
        ["Workpiece", "Circular disc, off-centre CG"],
      ],
      report: "General Arrangement Drawing — Exhibit D-1",
      inspection: {
        technician: "Mechanical inspection — factory acceptance",
        inspected: "2026-07-20",
        nextService: "2027-02-15 (1,000 h liner gauge)",
        warranty: {
          component: "Clamp jaw pads & V-groove liners (wear parts)",
          serial: "WP-VG-1200-2607",
          term: "Consumable — not covered",
          expires: "n/a",
        },
        notes: [
          "V-groove self-centred discs from 620 mm to 960 mm diameter without shimming or manual alignment.",
          "Clamp engaged and held through the full 90° arc under rated load. No measurable slip at the jaw faces after twenty cycles.",
          "The wheel disc's centre of gravity sits off the geometric centre, so the clamp — not the V-groove — is what resists rotation once past about 40°. Never tilt on the V-groove alone.",
          "Jaw pads and liners are the shortest-lived items on the machine. Gauge them at every 1,000 h service and keep a spare set on the shelf.",
        ],
      },
    },
    {
      title: "Electrical & Control System",
      badge: "VERIFIED",
      badgeMeta: "DELIXI",
      exhibit: "B-2",
      tone: "forest",
      score: "3P+N",
      scoreLabel: "three-phase four-wire",
      rul: {
        remaining: 7360, total: 8000, unit: "h", pct: 92,
        basis: "Contactor and relay service interval 8,000 operations-equivalent hours.",
      },
      lines: [
        ["Components", "Delixi"],
        ["Cabinet", "External, earth terminal"],
        ["Finish", "Light grey"],
      ],
      report: "Electrical Schematic & Cabinet Layout — Exhibit B-2",
      inspection: {
        technician: "Electrical inspection — factory acceptance",
        inspected: "2026-07-21",
        nextService: "2028-01-10 (5,000 h cabinet service)",
        warranty: {
          component: "Control cabinet, Delixi contactors & overloads",
          serial: "CC-3P4W-2607-DLX",
          term: "12-month components",
          expires: "2027-07-21",
        },
        notes: [
          "Three-phase four-wire supply with a dedicated earth terminal; continuity to the frame measured at 0.08 Ω.",
          "Control is external to the machine, so the operator stands clear of the tilt envelope throughout the cycle.",
          "Emergency stop drops the directional valve and holds position under load — the platform did not creep during a 10-minute hold test.",
          "Open item: no interlock ties the clamp state to the tilt command. Nothing stops an operator tilting an unclamped disc. Recommend a clamp-confirm limit switch before hand-over.",
        ],
      },
    },
  ],

  // ── Service interval schedule ───────────────────────────────────────────────
  machineHours: 640,
  serviceSchedule: [
    {
      id: "Pre-shift", intervalHours: 8, sinceHours: 3, band: "shift",
      title: "Pre-shift checks",
      tasks: ["Visual inspection of hose run and fittings", "Reservoir level and leak check", "E-stop and clamp function test"],
      parts: "None",
      lastPerformed: "2026-09-02 06:00",
      note: "Operator-performed at shift start. Logged on the cell sheet, not in the CMMS.",
    },
    {
      id: "250 h", intervalHours: 250, sinceHours: 190, band: "near",
      title: "Fluid, hose and jaw inspection",
      tasks: ["Hydraulic fluid level and condition", "8 m hose abrasion and fitting torque", "Clamp jaw pad wear check"],
      parts: "Jaw pads if below 3 mm",
      lastPerformed: "2026-07-28",
      note: "The hose run crosses the operator approach — inspect the full 8 m, not just the terminations.",
    },
    {
      id: "500 h", intervalHours: 500, sinceHours: 470, band: "near",
      title: "Throttle calibration & tilt timing",
      tasks: ["Throttle valve calibration", "Verify 0–90° tilt time against setting", "Platform synchronisation check"],
      parts: "None",
      lastPerformed: "2026-06-15",
      note: "Due within 30 h. Re-time the arc at rated load; drift here is the first sign of valve or seal wear.",
      cliff: true,
    },
    {
      id: "1,000 h", intervalHours: 1000, sinceHours: 640, band: "long",
      title: "Seal inspection & liner gauge",
      tasks: ["Cylinder rod seal inspection", "V-groove liner wear gauge", "Clamp pad replacement"],
      parts: "Liner set, jaw pad set",
      lastPerformed: "Not yet performed",
      note: "First one falls due at 1,000 h. The consumables budgeted here drive the platform assembly's remaining life.",
    },
    {
      id: "2,000 h", intervalHours: 2000, sinceHours: 640, band: "long",
      title: "Fluid and filter change",
      tasks: ["Hydraulic fluid change", "Return and suction filter replacement", "Reservoir clean-out"],
      parts: "Fluid charge, filter set",
      lastPerformed: "Not yet performed",
      note: "Sample the fluid at 1,000 h to confirm the 2,000 h interval suits the duty and ambient.",
    },
    {
      id: "5,000 h", intervalHours: 5000, sinceHours: 640, band: "long",
      title: "Control cabinet service",
      tasks: ["Delixi contactor and overload inspection", "Terminal torque audit", "Earth continuity re-test"],
      parts: "Contactors if pitted",
      lastPerformed: "Not yet performed",
      note: "Schedule alongside the plant's annual electrical inspection to avoid a second shutdown.",
    },
    {
      id: "10,000 h", intervalHours: 10000, sinceHours: 640, band: "long",
      title: "Cylinder overhaul & structural NDT",
      tasks: ["Tilt cylinder overhaul or exchange", "Structural weld NDT on both platforms", "Pivot bearing replacement"],
      parts: "Seal kits, bearings",
      lastPerformed: "Not yet performed",
      note: "Major intervention. Sets the machine's stated 10-year service life alongside the cylinder overhaul interval.",
    },
  ],

  // ── Specification schedule (verbatim) ───────────────────────────────────────
  specs: [
    { parameter: "Rated load", value: "1,000 kg", note: "Per cycle, distributed" },
    { parameter: "Tilt angle", value: "90°", note: "Horizontal to vertical" },
    { parameter: "Platform layout", value: "Dual platforms", note: "Clamping mechanism + V-groove" },
    { parameter: "Tilt speed", value: "~60 s", note: "0–90°, as delivered" },
    { parameter: "Speed adjustment", value: "Throttle valve", note: "Adjustable at the power unit" },
    { parameter: "Hose length", value: "8 m", note: "Power unit to cylinders" },
    { parameter: "Electrical system", value: "Three-phase four-wire", note: "Dedicated earth terminal" },
    { parameter: "Electrical components", value: "Delixi", note: "Contactors, overloads, pilot devices" },
    { parameter: "Control", value: "External control cabinet", note: "Operator stands clear of tilt envelope" },
    { parameter: "Finish", value: "Light grey", note: "—" },
  ],

  // ── Operating sequence ──────────────────────────────────────────────────────
  workflow: [
    { step: "01", angle: 0, title: "Workpiece positioning", detail: "Wheel disc placed on the V-groove platform. The V-shape centres the circular workpiece automatically, across diameters, with no manual alignment." },
    { step: "02", angle: 0, title: "Workpiece clamping", detail: "The clamping mechanism engages and locks the disc before any tilt command is accepted. This is what resists rotation once the centre of gravity swings past the pivot." },
    { step: "03", angle: 90, title: "90° tilt", detail: "The hydraulic system drives both platforms synchronously. Approximately 60 seconds at the delivered throttle setting; adjustable 30–120 s to suit disc mass and diameter." },
    { step: "04", angle: 90, title: "Operation", detail: "Wheel disc held vertical for processing, inspection or maintenance. The external cabinet keeps the operator outside the tilt envelope throughout." },
    { step: "05", angle: 0, title: "Reset", detail: "Platforms return to horizontal under the same regulated flow, then the clamp releases and the disc is removed from the V-groove." },
  ],

  // ── Engineering notes ───────────────────────────────────────────────────────
  engineering: [
    {
      challenge: "Irregular workpiece positioning",
      detail: "Wheel discs are circular and their centre of gravity does not sit at the geometric centre. They roll or shift during tilting unless positively located and held.",
      solution: "The V-groove handles initial positioning — a circular workpiece self-centres when placed on it. The clamping mechanism handles retention through the arc. Both are needed: the groove alone will not hold a disc past roughly 40°.",
    },
    {
      challenge: "Dual-platform asymmetrical design",
      detail: "Two platforms carrying different mechanisms — one clamping, one V-groove — with a single synchronised drive. Design complexity is high and load sharing is uneven.",
      solution: "A flow divider drives both platforms from one power unit. Synchronisation held within 1.5° through the full arc at rated load during factory acceptance.",
    },
    {
      challenge: "Controllable tilt speed",
      detail: "A fixed tilt rate suits one disc specification. Heavier or larger discs need a slower arc to avoid inertial impact at the end stops.",
      solution: "The power unit carries a throttle valve giving 30–120 s across the 90° arc. Slow the arc for heavy discs; open it up for light ones. Cycle time and throughput follow directly — see the duty-cycle model.",
    },
  ],

  faq: {
    question: "Why are the dual platforms designed differently — one with a clamping mechanism, one with a V-groove?",
    answer:
      "The two platforms do different jobs and both are essential. The V-groove handles initial positioning: a circular workpiece centres itself when placed on it, which removes manual alignment from the cycle and accommodates a range of diameters. The clamping mechanism handles retention: it locks the disc before the tilt starts and holds it through the full 90°. Because a wheel disc's centre of gravity is off the geometric centre, the groove stops resisting rotation part-way through the arc — from that point the clamp is the only thing holding the workpiece.",
  },

  // ── Documentation vault ─────────────────────────────────────────────────────
  documents: [
    {
      exhibit: "A-1", name: "Factory Acceptance Test Report", format: "PDF", size: "3.2 MB", pages: 46,
      audit: "2026-07-22", access: "vault",
      summary: "Witnessed FAT covering rated-load tilt cycles, platform synchronisation, throttle range, emergency stop and hold-under-load testing.",
    },
    {
      exhibit: "A-2", name: "Load Test Certificate — 1,000 kg", format: "PDF", size: "480 KB", pages: 4,
      audit: "2026-07-19", access: "open",
      summary: "Proof load certificate at 125% of rated capacity with deflection readings and a permanent-set check.",
      excerpt: [
        "PROOF LOAD TEST CERTIFICATE — HYDRAULIC TILTER WDT-1000-RW",
        "Rated capacity 1,000 kg · Proof load applied 1,250 kg (125%)",
        "Tilt arc 0-90° completed under proof load · max deflection 1.4 mm at platform edge",
        "No permanent set observed. Weld inspection post-test: no indications.",
      ],
    },
    {
      exhibit: "B-1", name: "Hydraulic Schematic & Component Schedule", format: "PDF", size: "1.8 MB", pages: 12,
      audit: "2026-06-30", access: "vault",
      summary: "Circuit diagram with cylinder, flow divider, throttle valve and relief settings, plus the bill of hydraulic components.",
    },
    {
      exhibit: "B-2", name: "Electrical Schematic & Cabinet Layout", format: "PDF", size: "2.1 MB", pages: 18,
      audit: "2026-06-30", access: "vault",
      summary: "Three-phase four-wire distribution, control cabinet layout, Delixi component schedule and earthing arrangement.",
    },
    {
      exhibit: "C-1", name: "CE Declaration of Conformity", format: "PDF", size: "220 KB", pages: 2,
      audit: "2026-07-25", access: "open",
      summary: "Declaration against the Machinery Directive 2006/42/EC with the harmonised standards applied.",
      excerpt: [
        "EC DECLARATION OF CONFORMITY — MACHINERY DIRECTIVE 2006/42/EC",
        "Machine: Wheel disc hydraulic tilter, dual platform, 1,000 kg / 90°",
        "Harmonised standards applied: EN ISO 12100, EN 60204-1, EN ISO 4413",
        "Conformity assessment: internal production control, Annex VIII.",
      ],
    },
    {
      exhibit: "C-2", name: "Operation & Maintenance Manual", format: "PDF", size: "9.4 MB", pages: 128,
      audit: "2026-07-25", access: "open",
      summary: "Operating sequence, throttle setting procedure, service intervals, spare parts list and fault-finding guide.",
      excerpt: [
        "SECTION 4 — SETTING TILT SPEED AT THE THROTTLE VALVE",
        "The 90° arc is factory set to approximately 60 seconds at rated load.",
        "Adjustable range 30-120 s. Slow the arc for heavier or larger diameter discs",
        "to limit inertial impact at the end stops. Re-time the arc after any adjustment.",
      ],
    },
    {
      exhibit: "D-1", name: "General Arrangement Drawing", format: "PDF", size: "1.1 MB", pages: 3,
      audit: "2026-06-12", access: "vault",
      summary: "Overall dimensions, platform layout, foundation loads and the tilt envelope the operator must stay clear of.",
    },
    {
      exhibit: "D-2", name: "Material & Weld Inspection Records", format: "PDF", size: "5.6 MB", pages: 64,
      audit: "—", access: "pending",
      summary: "Mill certificates for structural sections and NDT records for the platform and pivot welds.",
      expected: "Collation in progress with the fabricator; delivery expected 2026-09-20.",
    },
  ],

  // ── Deal team ───────────────────────────────────────────────────────────────
  orgLabel: "Prepared by",
  org: "Avarabrands Asset Infrastructure",
  orgBlurb:
    "White-labelled transaction dossiers for heavy industrial equipment. Specification parsed from the vendor's published data; commercial modelling is ours.",
  contacts: [
    {
      name: "Applications Engineering",
      title: "Sizing, layout & integration",
      note: "Duty-cycle modelling, cell layout against the tilt envelope, and throttle setting for a given disc specification.",
    },
    {
      name: "Commissioning & After-Sales",
      title: "Installation, FAT witness & service",
      note: "Factory acceptance witnessing, on-site commissioning, service interval planning and spare parts provisioning.",
    },
  ],
};
