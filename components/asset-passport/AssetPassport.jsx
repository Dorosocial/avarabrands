"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  Colophon,
  DocumentModal,
  DossierNav,
  ExhibitIndex,
  IntegrityIndex,
  LABEL,
  LINK,
  LockIcon,
  Masthead,
  MetricBand,
  Section,
  Slider,
  StatusMark,
  pct,
  sf,
  tone,
  usd,
  usdSigned,
} from "./shared";

/* ────────────────────────────────────────────────────────────────────────────
   Commercial real estate passport
   Cap-rate underwriting, lease roll and marketed suites, on the shared kit.
   ──────────────────────────────────────────────────────────────────────────── */

const VIEWS = [
  { id: "financial", num: "01", label: "Financial Waterfall" },
  { id: "physical", num: "02", label: "Physical & Component Health" },
  { id: "vault", num: "03", label: "Due-Diligence Vault" },
];

/* The valuation anchor that heads the masthead. */
function ValuationAnchor({ asset }) {
  const p = asset.pricing;
  return (
    <div className="flex flex-col border-t-2 border-ink bg-surface">
      <div className="border-b border-rule px-4 py-3">
        <p className={LABEL}>Valuation anchor</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-ink sm:text-[2.6rem] sm:leading-none">
          {usd(p.valuation)}
        </p>
        <p className="mt-2 font-mono text-[11px] text-muted">
          ${p.pricePerSf.toFixed(2)} / SF · {sf(asset.buildingSf)} SF
        </p>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-rule border-b border-rule">
        <div className="px-4 py-3">
          <dt className={LABEL}>Target cap rate</dt>
          <dd className="mt-1 font-mono text-xl font-bold text-forest">{pct(p.targetCapRate)}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className={LABEL}>Going-in yield</dt>
          <dd className="mt-1 font-mono text-xl font-bold text-ink">{pct(p.goingInYield)}</dd>
        </div>
      </dl>
      <div className="px-4 py-4">
        <a
          href="#data-room"
          className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-forest"
        >
          <LockIcon />
          Access Due-Diligence Vault
        </a>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">{p.basis}</p>
      </div>
    </div>
  );
}

/* ── II. Live underwriting calculator ─────────────────────────────────────── */
function UnderwritingCalculator({ asset, inputs, onChange }) {
  const u = asset.underwriting;
  const { capRate, ltv, rate } = inputs;
  const setCapRate = (v) => onChange((s) => ({ ...s, capRate: v }));
  const setLtv = (v) => onChange((s) => ({ ...s, ltv: v }));
  const setRate = (v) => onChange((s) => ({ ...s, rate: v }));

  const calc = useMemo(() => {
    const price = u.noi / (capRate / 100);
    const loan = price * (ltv / 100);
    const equity = price - loan;
    const i = rate / 100 / 12;
    const n = u.amortYears * 12;
    const monthly = i === 0 ? loan / n : (loan * i) / (1 - Math.pow(1 + i, -n));
    const debtService = monthly * 12;
    const cashFlow = u.noi - debtService;
    return {
      price,
      psf: price / asset.buildingSf,
      loan,
      equity,
      debtService,
      dscr: u.noi / debtService,
      debtYield: (u.noi / loan) * 100,
      cashFlow,
      coc: (cashFlow / equity) * 100,
    };
  }, [capRate, ltv, rate, u, asset.buildingSf]);

  const dscrTone =
    calc.dscr >= 1.35 ? "forest" : calc.dscr >= u.dscrCovenant ? "ochre" : "oxblood";
  const dscrLabel =
    calc.dscr >= 1.35 ? "CLEARS" : calc.dscr >= u.dscrCovenant ? "TIGHT" : "BREACH";

  const reset = () =>
    onChange({ capRate: u.capRate.initial, ltv: u.ltv.initial, rate: u.rate.initial });
  const atDefaults =
    capRate === u.capRate.initial && ltv === u.ltv.initial && rate === u.rate.initial;

  const rows = [
    ["Loan amount", usd(calc.loan), "text-graphite"],
    ["Equity requirement", usd(calc.equity), "text-graphite"],
    ["Annual debt service", usd(calc.debtService), "text-graphite"],
    ["Levered cash flow", usdSigned(calc.cashFlow), calc.cashFlow >= 0 ? "text-forest" : "text-oxblood"],
    ["Debt yield", pct(calc.debtYield), "text-graphite"],
    ["Cash-on-cash", pct(calc.coc, 1), calc.coc >= 0 ? "text-forest" : "text-oxblood"],
  ];

  return (
    <div className="grid grid-cols-1 border border-rule-strong bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      {/* Inputs */}
      <div className="border-b border-rule px-4 py-4 lg:border-b-0 lg:border-r">
        <div className="flex items-baseline justify-between gap-3 border-b border-ink pb-2">
          <p className={LABEL}>Underwriting inputs</p>
          <button
            type="button"
            onClick={reset}
            disabled={atDefaults}
            className={`${LINK} disabled:cursor-default disabled:text-faint disabled:no-underline`}
          >
            Reset to anchor
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          <Slider
            label="Target purchase cap rate"
            value={capRate}
            min={u.capRate.min}
            max={u.capRate.max}
            step={u.capRate.step}
            format={(v) => pct(v)}
            onChange={setCapRate}
          />
          <Slider
            label="Loan to value"
            value={ltv}
            min={u.ltv.min}
            max={u.ltv.max}
            step={u.ltv.step}
            format={(v) => pct(v, 0)}
            onChange={setLtv}
          />
          <Slider
            label="All-in interest rate"
            value={rate}
            min={u.rate.min}
            max={u.rate.max}
            step={u.rate.step}
            format={(v) => pct(v)}
            onChange={setRate}
          />
        </div>

        <dl className="mt-5 border-t border-dotted border-rule-strong pt-2 text-[11px]">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-faint">Net operating income (held constant)</dt>
            <dd className="font-mono font-semibold text-graphite">{usd(u.noi)}</dd>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3">
            <dt className="text-faint">Amortisation</dt>
            <dd className="font-mono font-semibold text-graphite">{u.amortYears}-year</dd>
          </div>
        </dl>
      </div>

      {/* Outputs */}
      <div>
        <div className="border-b border-rule px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={LABEL}>Implied purchase price</p>
              <p className="mt-1 font-mono text-4xl font-bold leading-none tracking-tight text-ink sm:text-5xl">
                {usd(calc.price)}
              </p>
              <p className="mt-2 font-mono text-[11px] text-muted">
                ${calc.psf.toFixed(2)} / SF · at {pct(capRate)} on {usd(u.noi)} NOI
              </p>
            </div>
            <div className="sm:text-right">
              <p className={LABEL}>Debt service coverage</p>
              <p
                className={`mt-1 font-mono text-4xl font-bold leading-none tracking-tight ${tone(dscrTone).text}`}
              >
                {calc.dscr.toFixed(2)}×
              </p>
              <div className="mt-2">
                <StatusMark
                  label={dscrLabel}
                  meta={`COV ${u.dscrCovenant.toFixed(2)}×`}
                  toneKey={dscrTone}
                />
              </div>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {rows.map(([k, v, cls], i) => (
            <div
              key={k}
              className={`flex items-baseline justify-between gap-4 border-rule px-4 py-2.5 ${
                i % 2 === 0 ? "sm:border-r" : ""
              } ${i < rows.length - 1 ? "border-b" : ""} ${i >= rows.length - 2 ? "sm:border-b-0" : ""}`}
            >
              <dt className="text-[11px] text-faint">{k}</dt>
              <dd className={`font-mono text-sm font-semibold ${cls}`}>{v}</dd>
            </div>
          ))}
        </dl>

        <p className="border-t border-rule px-4 py-2 text-[11px] leading-relaxed text-muted">
          <span className={LABEL}>Note </span>
          NOI is held constant while price moves inversely with the cap rate, so compressing the cap
          rate raises basis and erodes coverage. Coverage below {u.dscrCovenant.toFixed(2)}× breaches
          a standard lender covenant and would require a larger equity cheque.
        </p>
      </div>
    </div>
  );
}
/* ── IV. Lease roll & income waterfall ────────────────────────────────────── */

const SCHEDULE_TABS = [
  { id: "roll", label: "Lease Expiration Schedule" },
  { id: "noi", label: "NOI Bridge" },
  { id: "opex", label: "Operating Expenses" },
];

const ROLL_FILTERS = [
  { id: "all", label: "Show All", test: () => true },
  {
    id: "near",
    label: "Near-Term Expirations (2026–2027)",
    test: (r) => r.year === "2026" || r.year === "2027",
  },
  {
    id: "long",
    label: "Anchors & Long-Term (2028+)",
    test: (r) => r.year !== "Vacant" && Number.parseInt(r.year, 10) >= 2028,
  },
];

function FinancialSchedule({ asset }) {
  const [tab, setTab] = useState("roll");
  const [filterId, setFilterId] = useState("all");
  const [activeYear, setActiveYear] = useState(asset.leaseRoll.find((r) => r.cliff)?.year);

  const maxNoi = useMemo(
    () => Math.max(...asset.noiBridge.map((r) => Math.abs(r.amount))),
    [asset.noiBridge],
  );
  const maxOpex = useMemo(() => Math.max(...asset.opex.map((r) => r.psf)), [asset.opex]);

  const filter = ROLL_FILTERS.find((f) => f.id === filterId) ?? ROLL_FILTERS[0];
  const rows = useMemo(() => asset.leaseRoll.filter(filter.test), [asset.leaseRoll, filter]);

  /* Bars scale to the visible set, and totals re-foot to it. */
  const maxPct = useMemo(() => Math.max(...rows.map((r) => r.pct), 0.01), [rows]);
  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({ sf: acc.sf + r.sf, pct: acc.pct + r.pct }),
        { sf: 0, pct: 0 },
      ),
    [rows],
  );

  /* Selection always resolves to a visible row. */
  const sel = rows.find((r) => r.year === activeYear) ?? rows[0] ?? asset.leaseRoll[0];
  const mtmOf = (inPlace) =>
    inPlace == null ? null : ((asset.marketRent - inPlace) / inPlace) * 100;
  const mtm = mtmOf(sel.inPlace);

  return (
    <div className="border border-rule-strong bg-surface">
      <div className="flex overflow-x-auto border-b border-rule-strong" role="tablist">
        {SCHEDULE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-b-2 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition ${
              tab === t.id
                ? "border-forest bg-forest-tint text-forest"
                : "border-transparent text-faint hover:text-graphite"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roll" && (
        <>
          <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-paper px-3 py-2">
            <span className={LABEL}>Filter</span>
            {ROLL_FILTERS.map((f) => {
              const on = f.id === filterId;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilterId(f.id)}
                  className={`border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition ${
                    on
                      ? "border-forest bg-forest text-white"
                      : "border-rule-strong bg-surface text-muted hover:border-graphite hover:text-graphite"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
            <span className="ml-auto font-mono text-[10px] text-muted">
              {rows.length} of {asset.leaseRoll.length} vintages · {sf(totals.sf)} SF ·{" "}
              <span className="font-semibold text-ink">{totals.pct.toFixed(2)}% of GLA</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    <th className="px-3 py-2 font-semibold">Expiry</th>
                    <th className="px-3 py-2 text-right font-semibold">Rentable SF</th>
                    <th className="px-3 py-2 text-right font-semibold">% NRA</th>
                    <th className="w-[26%] px-3 py-2 font-semibold">Share</th>
                    <th className="px-3 py-2 text-right font-semibold">In-place</th>
                    <th className="px-3 py-2 text-right font-semibold">Δ to mkt</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const on = r.year === sel.year;
                    const d = mtmOf(r.inPlace);
                    const barTone = r.cliff
                      ? "bg-ochre"
                      : r.inPlace == null
                        ? "bg-rule-strong"
                        : "bg-forest";
                    return (
                      <tr
                        key={r.year}
                        onClick={() => setActiveYear(r.year)}
                        className={`cursor-pointer border-b border-rule text-xs transition ${
                          on ? "bg-forest-tint" : "hover:bg-paper"
                        }`}
                      >
                        <th scope="row" className="px-3 py-2 text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveYear(r.year);
                            }}
                            className="font-mono text-xs font-bold text-ink"
                          >
                            {r.year}
                          </button>
                          {r.cliff ? (
                            <span className="ml-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ochre">
                              cliff
                            </span>
                          ) : null}
                        </th>
                        <td className="px-3 py-2 text-right font-mono text-graphite">{sf(r.sf)}</td>
                        <td className="px-3 py-2 text-right font-mono text-graphite">
                          {r.pct.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-2 w-full bg-paper ring-1 ring-inset ring-rule">
                            <div
                              className={`h-full ${barTone} transition-[width] duration-300`}
                              style={{ width: `${(r.pct / maxPct) * 100}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-graphite">
                          {r.inPlace != null ? `$${r.inPlace.toFixed(2)}` : "—"}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-mono font-semibold ${
                            d == null ? "text-faint" : d >= 0 ? "text-forest" : "text-oxblood"
                          }`}
                        >
                          {d == null ? "n/a" : `${d >= 0 ? "+" : ""}${d.toFixed(1)}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-b border-rule-strong bg-paper font-mono text-[11px] font-bold text-ink">
                    <th scope="row" className="px-3 py-2 text-left uppercase tracking-[0.1em]">
                      {filterId === "all" ? "Total" : "Subtotal"}
                    </th>
                    <td className="px-3 py-2 text-right">{sf(totals.sf)}</td>
                    <td className="px-3 py-2 text-right">{totals.pct.toFixed(2)}</td>
                    <td colSpan={3} className="px-3 py-2 text-right font-medium text-muted">
                      Market rent ${asset.marketRent.toFixed(2)} /SF
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="border-t border-rule-strong bg-paper px-4 py-4 lg:border-l lg:border-t-0">
              <p className={LABEL}>
                {sel.year === "Vacant" ? "Current vacancy" : `${sel.year} expirations`}
              </p>
              <p className="mt-2 font-mono text-3xl font-bold leading-none tracking-tight text-ink">
                {sf(sel.sf)}
              </p>
              <p className="mt-1 font-mono text-[11px] text-muted">
                rentable SF · {sel.pct.toFixed(2)}% of NRA
              </p>

              <dl className="mt-4 border-t border-ink pt-2 text-[11px]">
                {[
                  [
                    "In-place rent",
                    sel.inPlace != null ? `$${sel.inPlace.toFixed(2)} /SF` : "—",
                    "text-graphite",
                  ],
                  ["Market rent", `$${asset.marketRent.toFixed(2)} /SF`, "text-graphite"],
                  [
                    "Mark-to-market",
                    mtm == null ? "n/a" : `${mtm >= 0 ? "+" : ""}${mtm.toFixed(1)}%`,
                    mtm == null ? "text-faint" : mtm >= 0 ? "text-forest" : "text-oxblood",
                  ],
                  ["Annualised at market", usd(sel.sf * asset.marketRent), "text-graphite"],
                ].map(([k, v, cls]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule-strong py-1.5"
                  >
                    <dt className="text-faint">{k}</dt>
                    <dd className={`text-right font-mono font-semibold ${cls}`}>{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                {sel.cliff ? (
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ochre">
                    Expiration cliff
                  </span>
                ) : null}
                {sel.note}
              </p>
            </div>
          </div>
        </>
      )}

      {tab === "noi" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <th className="px-3 py-2 font-semibold">Line item</th>
                <th className="w-[30%] px-3 py-2 font-semibold">Share</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {asset.noiBridge.map((r) => {
                const isTotal = r.kind === "total";
                const isSub = r.kind === "subtotal";
                const isLess = r.kind === "less";
                return (
                  <tr
                    key={r.label}
                    className={`border-b text-xs ${
                      isTotal
                        ? "border-t-2 border-ink bg-forest-tint"
                        : isSub
                          ? "border-rule-strong bg-paper"
                          : "border-rule"
                    }`}
                  >
                    <th
                      scope="row"
                      className={`px-3 py-2 text-left ${
                        isTotal || isSub ? "font-semibold text-ink" : "font-normal text-muted"
                      }`}
                    >
                      {r.label}
                    </th>
                    <td className="px-3 py-2">
                      <div className="h-2 w-full bg-white ring-1 ring-inset ring-rule">
                        <div
                          className={`h-full ${isTotal ? "bg-forest" : isLess ? "bg-oxblood" : isSub ? "bg-graphite" : "bg-rule-strong"}`}
                          style={{ width: `${(Math.abs(r.amount) / maxNoi) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-mono font-semibold ${
                        isTotal ? "text-forest" : isLess ? "text-oxblood" : "text-ink"
                      }`}
                    >
                      {usdSigned(r.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "opex" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <th className="px-3 py-2 font-semibold">Expense category</th>
                <th className="w-[34%] px-3 py-2 font-semibold">Share</th>
                <th className="px-3 py-2 text-right font-semibold">$ / SF</th>
                <th className="px-3 py-2 text-right font-semibold">Annual</th>
              </tr>
            </thead>
            <tbody>
              {asset.opex.map((r) => (
                <tr key={r.label} className="border-b border-rule text-xs">
                  <th scope="row" className="px-3 py-2 text-left font-normal text-muted">
                    {r.label}
                  </th>
                  <td className="px-3 py-2">
                    <div className="h-2 w-full bg-paper ring-1 ring-inset ring-rule">
                      <div
                        className="h-full bg-graphite"
                        style={{ width: `${(r.psf / maxOpex) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-graphite">{r.psf.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-graphite">
                    {usd(r.psf * asset.buildingSf)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink bg-paper text-xs font-bold text-ink">
                <th scope="row" className="px-3 py-2 text-left uppercase tracking-[0.08em]">
                  Total operating expenses
                </th>
                <td />
                <td className="px-3 py-2 text-right font-mono">{asset.opexTotalPsf.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-mono">
                  {usd(asset.opexTotalPsf * asset.buildingSf)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
/* ── V. Marketed suites ───────────────────────────────────────────────────── */

function SuiteSchedule({ asset }) {
  return (
    <div className="border border-rule-strong bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              <th className="px-3 py-2 font-semibold">Suite</th>
              <th className="px-3 py-2 font-semibold">Use</th>
              <th className="px-3 py-2 text-right font-semibold">Rentable SF</th>
              <th className="px-3 py-2 text-right font-semibold">Asking $/SF</th>
              <th className="px-3 py-2 font-semibold">Term</th>
              <th className="px-3 py-2 font-semibold">Condition</th>
              <th className="px-3 py-2 text-right font-semibold">Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {asset.availabilities.map((r) => (
              <tr key={r.suite} className="border-b border-rule transition hover:bg-paper">
                <th scope="row" className="px-3 py-2 text-left font-medium text-ink">
                  {r.suite}
                </th>
                <td className="px-3 py-2 text-muted">{r.use}</td>
                <td className="px-3 py-2 text-right font-mono text-graphite">{r.sf}</td>
                <td className="px-3 py-2 text-right font-mono font-semibold text-ink">
                  {r.rate.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-muted">{r.term}</td>
                <td className="px-3 py-2 text-muted">{r.buildOut}</td>
                <td className="px-3 py-2 text-right">
                  <StatusMark
                    label={r.ready === "Now" ? "Vacant" : "Notice"}
                    meta={r.ready === "Now" ? "IMMEDIATE" : r.ready.toUpperCase()}
                    toneKey={r.ready === "Now" ? "forest" : "ochre"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-rule px-3 py-2 text-[11px] text-muted">
        <span className={LABEL}>Note </span>
        {asset.availabilityNote}
      </p>
    </div>
  );
}
/* ── VII. Asset profile ───────────────────────────────────────────────────── */

function AssetProfile({ asset }) {
  return (
    <div className="grid grid-cols-1 border border-rule-strong bg-surface lg:grid-cols-3">
      <div className="border-b border-rule px-4 py-4 lg:border-b-0 lg:border-r">
        <p className={LABEL}>Select tenancy</p>
        <dl className="mt-3">
          {asset.tenants.map((t, i) => (
            <div
              key={t.name}
              className={`py-2 ${i < asset.tenants.length - 1 ? "border-b border-dotted border-rule-strong" : ""}`}
            >
              <dt className="text-xs font-semibold text-ink">{t.name}</dt>
              <dd className="mt-0.5 text-[11px] leading-relaxed text-muted">{t.desc}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-b border-rule px-4 py-4 lg:border-b-0 lg:border-r">
        <p className={LABEL}>Amenity stack</p>
        <ul className="mt-3 flex flex-wrap gap-1">
          {asset.amenities.map((a) => (
            <li
              key={a}
              className="border border-rule bg-paper px-2 py-1 font-mono text-[10px] text-graphite"
            >
              {a}
            </li>
          ))}
        </ul>
        <p className={`${LABEL} mt-4 border-t border-rule pt-3`}>Parking income</p>
        <dl className="mt-2 text-[11px]">
          {asset.parking.map((p) => (
            <div
              key={p.label}
              className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule-strong py-1.5"
            >
              <dt className="text-faint">{p.label}</dt>
              <dd className="text-right font-mono text-graphite">
                <span className="font-bold text-ink">{p.value}</span>
                <span className="ml-2">{p.rate}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="px-4 py-4">
        <p className={LABEL}>Location scoring</p>
        <dl className="mt-3">
          {asset.walkScores.map((s) => (
            <div key={s.label} className="py-2">
              <div className="flex items-baseline justify-between text-[11px]">
                <dt className="text-muted">{s.label}</dt>
                <dd className="font-mono font-bold text-ink">{s.value}/100</dd>
              </div>
              <div className="mt-1.5 h-1.5 w-full bg-paper ring-1 ring-inset ring-rule">
                <div className="h-full bg-forest" style={{ width: `${s.value}%` }} />
              </div>
            </div>
          ))}
        </dl>
        <p className="mt-3 border-t border-rule pt-2 text-[10px] text-muted">
          Source: Local Logic® via listing.
        </p>
      </div>
    </div>
  );
}
/* ── Root ─────────────────────────────────────────────────────────────────── */

export default function AssetPassport({ asset }) {
  const [view, setView] = useState("financial");
  const [docId, setDocId] = useState(null);
  const [uwInputs, setUwInputs] = useState({
    capRate: asset.underwriting.capRate.initial,
    ltv: asset.underwriting.ltv.initial,
    rate: asset.underwriting.rate.initial,
  });

  /*
   * Focus returns to whatever opened the modal. A table row is not focusable,
   * so clicking one leaves activeElement on <body>; fall back to that row's
   * own Preview control rather than dropping focus to the top of the document.
   */
  const lastFocusRef = useRef(null);
  const lastExhibitRef = useRef(null);
  const openDoc = useCallback((exhibit) => {
    const active = document.activeElement;
    lastFocusRef.current = active && active !== document.body ? active : null;
    lastExhibitRef.current = exhibit;
    setDocId(exhibit);
  }, []);
  const closeDoc = useCallback(() => {
    setDocId(null);
    const prior = lastFocusRef.current;
    const exhibit = lastExhibitRef.current;
    lastFocusRef.current = null;
    requestAnimationFrame(() => {
      const target =
        prior && document.contains(prior)
          ? prior
          : document.querySelector(`[data-preview="${exhibit}"]`);
      target?.focus();
    });
  }, []);

  /* Opening an exhibit from an inspection tray routes through the vault view. */
  const openDocFromTray = useCallback((exhibit) => {
    /* The tray unmounts with the view; focus lands on the exhibit's own row. */
    lastFocusRef.current = null;
    lastExhibitRef.current = exhibit;
    setView("vault");
    setDocId(exhibit);
  }, []);

  /*
   * Each view keeps its own scroll position, so switching context and coming
   * back returns the reader to where they were rather than jumping.
   */
  const scrollMemo = useRef({});
  const changeView = useCallback(
    (next) => {
      scrollMemo.current[view] = window.scrollY;
      setView(next);
    },
    [view],
  );
  useLayoutEffect(() => {
    window.scrollTo(0, scrollMemo.current[view] ?? 0);
  }, [view]);

  const doc = useMemo(
    () => asset.documents.find((d) => d.exhibit === docId) ?? null,
    [asset.documents, docId],
  );

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Masthead
        asset={asset}
        eyebrow="Digital Asset Passport"
        subtitle={`${asset.address} · ${asset.cityStateZip}`}
        anchor={<ValuationAnchor asset={asset} />}
      />
      <DossierNav views={VIEWS} view={view} onChange={changeView} />

      {view === "financial" && (
        <div id="view-financial" role="tabpanel">
          <Section id="kpis" numeral="I" title="Investor Summary" note="Stabilised Year 1 underwriting">
            <MetricBand kpis={asset.kpis} />
          </Section>
          <Section
            id="calculator"
            numeral="II"
            title="Underwriting Calculator"
            note="Drag any input to reprice the asset"
          >
            <UnderwritingCalculator asset={asset} inputs={uwInputs} onChange={setUwInputs} />
          </Section>
          <Section
            id="financials"
            numeral="III"
            title="Lease Roll & Income Waterfall"
            note="Filter the schedule, select a row for mark-to-market"
          >
            <FinancialSchedule asset={asset} />
          </Section>
          <Section
            id="availabilities"
            numeral="IV"
            title="Marketed Suites"
            note="Current availabilities"
          >
            <SuiteSchedule asset={asset} />
          </Section>
        </div>
      )}

      {view === "physical" && (
        <div id="view-physical" role="tabpanel">
          <Section
            id="integrity"
            numeral="V"
            title="Component Integrity"
            note="Select a system to open its inspection record"
          >
            <IntegrityIndex items={asset.integrity} onOpenDoc={openDocFromTray} />
          </Section>
          <Section
            id="profile"
            numeral="VI"
            title="Asset Profile"
            note="Tenancy, amenities & location"
          >
            <AssetProfile asset={asset} />
          </Section>
        </div>
      )}

      {view === "vault" && (
        <div id="view-vault" role="tabpanel">
          <Section id="data-room" numeral="VII" title="Due-Diligence Vault" note="Index of exhibits">
            <ExhibitIndex
              documents={asset.documents}
              onOpenDoc={openDoc}
              note="Select any row to open the document preview. Exhibits marked NDA release on execution of the confidentiality agreement; audit dates reflect the last third-party verification of record."
            />
          </Section>
        </div>
      )}

      <Colophon
        orgLabel="Listing brokerage"
        org={asset.brokerage}
        blurb="Full-service landlord representation. Budgeting, marketing plan and execution handled in-house."
        contacts={asset.brokers}
        notes={
          <>
            Figures marked <span className="font-mono font-semibold text-graphite">MODELED</span> are
            Avarabrands underwriting derived from published listing inputs and are not
            broker-warranted. The lease expiration schedule is an illustrative reconciliation to
            rentable area, not a certified rent roll. Calculator outputs are indicative and assume a
            constant NOI. Verify all figures against Exhibits A-1 and A-2 before committing capital.
          </>
        }
      />
      <DocumentModal doc={doc} asset={asset} onClose={closeDoc} />
    </main>
  );
}