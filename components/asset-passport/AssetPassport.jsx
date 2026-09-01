"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Digital Asset Passport
   Institutional transaction terminal — bone paper, navy ink, forest accent.
   Set as an offering memorandum: masthead, numbered sections, real financial
   tables with tabular figures, and live underwriting the reader can drive.
   ──────────────────────────────────────────────────────────────────────────── */

const usd = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdSigned = (n) => (n < 0 ? `(${usd(Math.abs(n))})` : usd(n));
const sf = (n) => n.toLocaleString("en-US");
const pct = (n, d = 2) => `${n.toFixed(d)}%`;

/* Semantic tone — status meaning, never decoration. */
const TONES = {
  forest: { text: "text-forest", chip: "border-forest bg-forest-tint text-forest", bar: "bg-forest" },
  graphite: { text: "text-graphite", chip: "border-graphite bg-white text-graphite", bar: "bg-graphite" },
  ochre: { text: "text-ochre", chip: "border-ochre bg-ochre-tint text-ochre", bar: "bg-ochre" },
  oxblood: { text: "text-oxblood", chip: "border-oxblood bg-oxblood-tint text-oxblood", bar: "bg-oxblood" },
  neutral: { text: "text-ink", chip: "border-rule-strong bg-white text-muted", bar: "bg-rule-strong" },
};
const tone = (k) => TONES[k] ?? TONES.neutral;

/** Remaining-useful-life banding: healthy, watch, replace. */
const rulTone = (p) => (p >= 60 ? "forest" : p >= 35 ? "ochre" : "oxblood");

const LABEL = "font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint";
const LINK =
  "font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-graphite underline decoration-rule-strong underline-offset-2 transition hover:text-forest hover:decoration-forest";

/* ── Primitives ───────────────────────────────────────────────────────────── */

/** Bracketed status indicator — [ VERIFIED · 2025 ] */
function StatusMark({ label, meta, toneKey }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 border px-2 py-[3px] font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${tone(toneKey).chip}`}
    >
      <span className="opacity-40">[</span>
      {label}
      {meta ? (
        <>
          <span className="opacity-40">·</span>
          {meta}
        </>
      ) : null}
      <span className="opacity-40">]</span>
    </span>
  );
}

/** Provenance of a figure. As listed = broker-stated, Modeled = our underwriting. */
function SourceMark({ source }) {
  const listed = source === "listing";
  return (
    <span
      className={`shrink-0 border px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-[0.1em] ${
        listed ? "border-rule-strong text-muted" : "border-graphite text-graphite"
      }`}
    >
      {listed ? "As listed" : "Modeled"}
    </span>
  );
}

function Section({ id, numeral, title, note, children }) {
  return (
    <section id={id} className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-1 border-b-2 border-ink pb-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
          <h2 className="flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold tracking-[0.1em] text-forest">{numeral}</span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {title}
            </span>
          </h2>
          {note ? <p className={`${LABEL} sm:text-right`}>{note}</p> : null}
        </div>
        <div className="pt-5">{children}</div>
      </div>
    </section>
  );
}

/* ── Masthead ─────────────────────────────────────────────────────────────── */

function Masthead({ asset }) {
  const { pricing } = asset;
  const bar = <span className="text-rule-strong">|</span>;

  return (
    <header className="border-b-4 border-double border-ink bg-surface">
      <div className="border-b border-rule px-4 py-2 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="font-bold text-forest">● {asset.status}</span>
          {bar}
          <span>{asset.assetClass}</span>
          {bar}
          <span>{asset.submarket}</span>
          {bar}
          <span>File {asset.fileNo}</span>
          <span className="ml-auto hidden sm:inline">As of {asset.asOf}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-10">
          <div className="flex flex-col">
            <p className={LABEL}>Digital Asset Passport</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {asset.name}
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
              {asset.address} · {asset.cityStateZip}
            </p>

            <div className="mt-5 border border-rule-strong bg-paper">
              {asset.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.heroImage}
                  alt={`${asset.name}, ${asset.address}`}
                  className="h-40 w-full object-cover sm:h-52"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center px-6 text-center sm:h-52">
                  <p className={LABEL}>
                    Asset imagery — set <span className="text-muted">heroImage</span> on the record
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col border-t-2 border-ink bg-surface">
            <div className="border-b border-rule px-4 py-3">
              <p className={LABEL}>Valuation anchor</p>
              <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-ink sm:text-[2.6rem] sm:leading-none">
                {usd(pricing.valuation)}
              </p>
              <p className="mt-2 font-mono text-[11px] text-muted">
                ${pricing.pricePerSf.toFixed(2)} / SF · {sf(asset.buildingSf)} SF
              </p>
            </div>

            <dl className="grid grid-cols-2 divide-x divide-rule border-b border-rule">
              <div className="px-4 py-3">
                <dt className={LABEL}>Target cap rate</dt>
                <dd className="mt-1 font-mono text-xl font-bold text-forest">
                  {pct(pricing.targetCapRate)}
                </dd>
              </div>
              <div className="px-4 py-3">
                <dt className={LABEL}>Going-in yield</dt>
                <dd className="mt-1 font-mono text-xl font-bold text-ink">
                  {pct(pricing.goingInYield)}
                </dd>
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
              <p className="mt-3 text-[11px] leading-relaxed text-muted">{pricing.basis}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Dossier navigation ───────────────────────────────────────────────────── */

const VIEWS = [
  { id: "financial", num: "01", label: "Financial Waterfall" },
  { id: "physical", num: "02", label: "Physical & Component Health" },
  { id: "vault", num: "03", label: "Due-Diligence Vault" },
];

function DossierNav({ view, onChange }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-rule-strong bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] gap-0 overflow-x-auto px-4 sm:px-6 lg:px-10" role="tablist">
        {VIEWS.map((v) => {
          const on = view === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`view-${v.id}`}
              onClick={() => onChange(v.id)}
              className={`shrink-0 border-b-2 px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition sm:px-5 sm:text-[11px] ${
                on ? "border-forest text-forest" : "border-transparent text-faint hover:text-graphite"
              }`}
            >
              <span className="opacity-40">[</span> {v.num}
              <span className="opacity-40">:</span> {v.label} <span className="opacity-40">]</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ── I. Investor metrics ──────────────────────────────────────────────────── */

function MetricBand({ kpis }) {
  return (
    <div className="grid grid-cols-1 border border-rule-strong bg-surface sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi, i) => {
        const t = tone(kpi.tone);
        return (
          <article
            key={kpi.label}
            className={[
              "border-rule px-4 py-4",
              /* internal hairlines only — the container draws the outer edge */
              i % 2 === 0 ? "sm:border-r" : "sm:border-r-0",
              i % 3 === 2 ? "lg:border-r-0" : "lg:border-r",
              i < kpis.length - 1 ? "border-b" : "",
              i >= kpis.length - 3 ? "lg:border-b-0" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <p className={LABEL}>{kpi.label}</p>
              <SourceMark source={kpi.source} />
            </div>
            <p className={`mt-2 font-mono text-[2rem] font-bold leading-none tracking-tight ${t.text}`}>
              {kpi.value}
            </p>
            <p className="mt-1.5 text-xs text-muted">{kpi.sub}</p>
            <dl className="mt-3 border-t border-dotted border-rule-strong pt-2 text-[11px]">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-faint">Basis</dt>
                <dd className="text-right font-mono text-muted">{kpi.detail}</dd>
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <dt className="text-faint">Note</dt>
                <dd className={`text-right font-mono font-medium ${t.text}`}>{kpi.trend}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}

/* ── II. Live underwriting calculator ─────────────────────────────────────── */

function Slider({ label, value, min, max, step, format, onChange }) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm font-bold text-ink">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-forest"
      />
      <div className="mt-0.5 flex justify-between font-mono text-[9px] text-faint">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/**
 * Inputs live in the root so switching dossier views never resets a model the
 * reader has already dialled in.
 */
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

/* ── III. Component integrity — expandable inspection trays ───────────────── */

function IntegrityRow({ item, open, onToggle, onOpenDoc }) {
  const t = tone(item.tone);
  const insp = item.inspection;
  const panelId = `tray-${item.exhibit}`;

  return (
    <article className="border-b border-rule-strong last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={`flex w-full items-center gap-4 px-4 py-3 text-left transition ${
            open ? "bg-forest-tint/40" : "hover:bg-paper"
          }`}
        >
          <span
            className={`font-mono text-xs font-bold text-forest transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
            aria-hidden="true"
          >
            ▸
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-base font-semibold text-ink">{item.title}</span>
            <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
              Exhibit {item.exhibit} · inspected {insp.inspected}
            </span>
          </span>
          <span className="hidden items-baseline gap-2 sm:flex">
            <span className={`font-mono text-2xl font-bold leading-none ${t.text}`}>{item.score}</span>
            <span className={LABEL}>{item.scoreLabel}</span>
          </span>
          {item.rul ? (
            <span className="hidden lg:block">
              <StatusMark label={`${item.rul.pct}% LIFE`} toneKey={rulTone(item.rul.pct)} />
            </span>
          ) : null}
          <StatusMark label={item.badge} meta={item.badgeMeta} toneKey={item.tone} />
        </button>
      </h3>

      {/* Tray — animates via grid-template-rows so height is never hard-coded. */}
      <div
        id={panelId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-rule bg-paper px-4 py-4">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <div>
                <p className={LABEL}>Technician notes</p>
                <ul className="mt-2">
                  {insp.notes.map((n, i) => (
                    <li
                      key={n}
                      className={`flex gap-3 py-2 text-[11px] leading-relaxed text-graphite ${
                        i < insp.notes.length - 1 ? "border-b border-dotted border-rule-strong" : ""
                      }`}
                    >
                      <span className="shrink-0 font-mono text-[10px] font-bold text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-rule-strong bg-surface">
                <p className={`${LABEL} border-b border-rule px-3 py-2`}>Service record</p>

                {/* Remaining useful life against expected service life. */}
                <div className="border-b border-rule px-3 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={LABEL}>Remaining useful life</p>
                    <p
                      className={`font-mono text-sm font-bold ${
                        item.rul ? tone(rulTone(item.rul.pct)).text : "text-faint"
                      }`}
                    >
                      {item.rul ? `${item.rul.pct}%` : "n/a"}
                    </p>
                  </div>
                  {item.rul ? (
                    <>
                      <div className="mt-2 h-2 w-full bg-paper ring-1 ring-inset ring-rule">
                        <div
                          className={`h-full ${tone(rulTone(item.rul.pct)).bar}`}
                          style={{ width: `${item.rul.pct}%` }}
                        />
                      </div>
                      <p className="mt-1.5 font-mono text-[10px] text-muted">
                        {item.rul.remaining} of {item.rul.total} {item.rul.unit} remaining
                      </p>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted">{item.rul.basis}</p>
                    </>
                  ) : (
                    <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                      Not applicable — environmental assessment carries no service life.
                    </p>
                  )}
                </div>

                <dl className="px-3 py-1 text-[11px]">
                  {[
                    ["Inspected by", insp.technician],
                    ["Last inspection", insp.inspected],
                    ["Next service", insp.nextService],
                    ["Covered component", insp.warranty.component],
                    ["Warranty serial", insp.warranty.serial],
                    ["Warranty term", insp.warranty.term],
                    ["Expires", insp.warranty.expires],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule-strong py-1.5 last:border-b-0"
                    >
                      <dt className="shrink-0 text-faint">{k}</dt>
                      <dd className="text-right font-mono text-graphite">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-rule px-3 py-3">
                  <button
                    type="button"
                    onClick={() => onOpenDoc(item.exhibit)}
                    className="flex w-full items-center justify-center gap-2 border border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-ink hover:text-white"
                  >
                    <DocIcon />
                    View report PDF — Exhibit {item.exhibit}
                  </button>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted">{item.report}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function IntegrityIndex({ items, onOpenDoc }) {
  const [openId, setOpenId] = useState(items[0]?.exhibit ?? null);
  return (
    <div className="border border-rule-strong bg-surface">
      {items.map((item) => (
        <IntegrityRow
          key={item.exhibit}
          item={item}
          open={openId === item.exhibit}
          onToggle={() => setOpenId((c) => (c === item.exhibit ? null : item.exhibit))}
          onOpenDoc={onOpenDoc}
        />
      ))}
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
              {rows.length} of {asset.leaseRoll.length} vintages · {sf(totals.sf)} SF
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

/* ── VI. Due-diligence exhibit index ──────────────────────────────────────── */

const ACCESS = {
  open: { label: "Open", tone: "forest" },
  vault: { label: "NDA", tone: "graphite" },
  pending: { label: "Pending", tone: "ochre" },
};

function ExhibitIndex({ documents, onOpenDoc }) {
  return (
    <div className="border border-rule-strong bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-xs">
          <thead>
            <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              <th className="px-3 py-2 font-semibold">Exhibit</th>
              <th className="px-3 py-2 font-semibold">Document</th>
              <th className="px-3 py-2 font-semibold">Format</th>
              <th className="px-3 py-2 text-right font-semibold">Pages</th>
              <th className="px-3 py-2 text-right font-semibold">Size</th>
              <th className="px-3 py-2 text-right font-semibold">Last audit</th>
              <th className="px-3 py-2 font-semibold">Access</th>
              <th className="px-3 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => {
              const a = ACCESS[d.access] ?? ACCESS.open;
              return (
                <tr
                  key={d.exhibit}
                  onClick={() => onOpenDoc(d.exhibit)}
                  className="cursor-pointer border-b border-rule transition hover:bg-paper"
                >
                  <th
                    scope="row"
                    className="whitespace-nowrap px-3 py-2 text-left font-mono font-bold text-forest"
                  >
                    {d.exhibit}
                  </th>
                  <td className="px-3 py-2 font-medium text-ink">{d.name}</td>
                  <td className="px-3 py-2 font-mono text-muted">{d.format}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted">{d.pages ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted">{d.size}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted">{d.audit}</td>
                  <td className="px-3 py-2">
                    <StatusMark label={a.label} toneKey={a.tone} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDoc(d.exhibit);
                      }}
                      className={LINK}
                    >
                      Preview
                    </button>
                    <span className="mx-2 text-rule-strong">·</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDoc(d.exhibit);
                      }}
                      className={LINK}
                    >
                      View audit log
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-rule px-3 py-2 text-[11px] text-muted">
        <span className={LABEL}>Note </span>
        Select any row to open the document preview. Exhibits marked NDA release on execution of the
        confidentiality agreement; audit dates reflect the last third-party verification of record.
      </p>
    </div>
  );
}

/* ── Document preview modal ───────────────────────────────────────────────── */

function DocumentModal({ doc, asset, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!doc) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [doc, onClose]);

  if (!doc) return null;
  const a = ACCESS[doc.access] ?? ACCESS.open;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-3 sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-title"
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-3xl border border-ink bg-surface shadow-none"
      >
        {/* Viewer chrome */}
        <div className="flex items-center gap-3 border-b border-ink bg-ink px-3 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            Exhibit {doc.exhibit}
          </span>
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-white/60">
            {doc.format} · {doc.size}
            {doc.pages ? ` · ${doc.pages} pp` : ""}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="ml-auto border border-white/30 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-ink"
          >
            Close ✕
          </button>
        </div>

        {/* Facsimile page */}
        <div className="max-h-[70vh] overflow-y-auto bg-paper p-3 sm:p-6">
          <article className="mx-auto max-w-[42rem] border border-rule-strong bg-white px-5 py-6 sm:px-8 sm:py-9">
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink pb-2">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-ink">
                {asset.name} · File {asset.fileNo}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                Exhibit {doc.exhibit}
              </p>
            </div>

            <h3 id="doc-title" className="mt-5 font-display text-2xl font-bold leading-tight text-ink">
              {doc.name}
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-graphite">{doc.summary}</p>

            <dl className="mt-5 border-t border-rule pt-3 text-[11px]">
              {[
                ["Format", doc.format],
                ["Pages", doc.pages ?? "—"],
                ["File size", doc.size],
                ["Last audit", doc.audit],
                ["Access", a.label],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule-strong py-1.5"
                >
                  <dt className="text-faint">{k}</dt>
                  <dd className="text-right font-mono text-graphite">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Page 1 body — released, redacted, or not yet delivered. */}
            <div className="mt-6 border-t border-ink pt-4">
              <p className={LABEL}>Page 1 of {doc.pages ?? "—"}</p>

              {doc.access === "open" && doc.excerpt ? (
                <div className="mt-3">
                  {doc.excerpt.map((line, i) => (
                    <p
                      key={line}
                      className={`py-1 font-mono text-[11px] leading-relaxed ${
                        i === 0 ? "font-bold text-ink" : "text-graphite"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : doc.access === "pending" ? (
                <div className="mt-3 border border-dashed border-ochre bg-ochre-tint px-4 py-5 text-center">
                  <StatusMark label="Not yet delivered" toneKey="ochre" />
                  <p className="mt-2 text-[11px] leading-relaxed text-graphite">{doc.expected}</p>
                </div>
              ) : (
                <div className="relative mt-3">
                  {/* Redaction bars stand in for the withheld page body. */}
                  <div aria-hidden="true" className="flex flex-col gap-2">
                    {[100, 92, 97, 74, 100, 88, 95, 61].map((w, i) => (
                      <span
                        key={`${w}-${i}`}
                        className="block h-3 bg-ink/85"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-4 border border-ink bg-white px-4 py-4 text-center">
                    <StatusMark label="Redacted" meta="NDA REQUIRED" toneKey="graphite" />
                    <p className="mt-2 text-[11px] leading-relaxed text-graphite">
                      The page body is withheld until the confidentiality agreement is executed.
                      Request access through the leasing team to release Exhibit {doc.exhibit}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t border-rule-strong bg-surface px-3 py-3">
          <button
            type="button"
            className="border border-ink bg-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-forest hover:border-forest"
          >
            Download confidential summary
          </button>
          <button
            type="button"
            className="border border-rule-strong px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-graphite transition hover:border-graphite"
          >
            View audit log
          </button>
          <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            Press Esc to close
          </p>
        </div>
      </div>
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

/* ── Colophon ─────────────────────────────────────────────────────────────── */

function Colophon({ asset }) {
  return (
    <footer className="border-t-4 border-double border-ink bg-surface px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-10">
          <div>
            <p className={LABEL}>Listing brokerage</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{asset.brokerage}</p>
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-muted">
              Full-service landlord representation. Budgeting, marketing plan and execution handled
              in-house.
            </p>
          </div>

          <div className="grid border border-rule-strong sm:grid-cols-2">
            {asset.brokers.map((b, i) => (
              <div
                key={b.name}
                className={`px-4 py-3 ${i === 0 ? "border-b border-rule sm:border-b-0 sm:border-r" : ""}`}
              >
                <p className="font-display text-base font-semibold text-ink">{b.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-forest">
                  {b.title}
                </p>
                <a
                  href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}
                  className="mt-2 inline-flex items-center gap-2 font-mono text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 transition hover:text-forest hover:decoration-forest"
                >
                  <PhoneIcon />
                  {b.phone}
                </a>
                <p className="mt-2 border-t border-dotted border-rule-strong pt-2 text-[10px] leading-relaxed text-muted">
                  {b.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-ink pt-3">
          <p className={LABEL}>Notes to the financial summary</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-3xl text-[11px] leading-relaxed text-muted">
              Figures marked <span className="font-mono font-semibold text-graphite">MODELED</span>{" "}
              are Avarabrands underwriting derived from published listing inputs and are not
              broker-warranted. The lease expiration schedule is an illustrative reconciliation to
              rentable area, not a certified rent roll. Calculator outputs are indicative and assume
              a constant NOI. Verify all figures against Exhibits A-1 and A-2 before committing
              capital.
            </p>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              Powered by Avarabrands Asset Infrastructure
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────────── */

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 1a4 4 0 0 0-4 4v2H5.5A1.5 1.5 0 0 0 4 8.5v8A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 7H14V5a4 4 0 0 0-4-4Zm2.5 6V5a2.5 2.5 0 0 0-5 0v2h5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.9a1.5 1.5 0 0 1 1.44 1.09l.6 2.1a1.5 1.5 0 0 1-.53 1.6l-1.1.83a11.5 11.5 0 0 0 4.57 4.57l.83-1.1a1.5 1.5 0 0 1 1.6-.53l2.1.6A1.5 1.5 0 0 1 18 12.6v1.9a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 2 3.5Z" />
    </svg>
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

  const openDoc = useCallback((exhibit) => setDocId(exhibit), []);
  const closeDoc = useCallback(() => setDocId(null), []);

  /* Opening an exhibit from an inspection tray routes through the vault view. */
  const openDocFromTray = useCallback((exhibit) => {
    setView("vault");
    setDocId(exhibit);
  }, []);

  const doc = useMemo(
    () => asset.documents.find((d) => d.exhibit === docId) ?? null,
    [asset.documents, docId],
  );

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Masthead asset={asset} />
      <DossierNav view={view} onChange={setView} />

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
            <ExhibitIndex documents={asset.documents} onOpenDoc={openDoc} />
          </Section>
        </div>
      )}

      <Colophon asset={asset} />
      <DocumentModal doc={doc} asset={asset} onClose={closeDoc} />
    </main>
  );
}
