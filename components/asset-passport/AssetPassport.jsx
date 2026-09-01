"use client";

import { useMemo, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Digital Asset Passport
   Mobile-first transaction dashboard for CRE and heavy industrial equipment.
   Fully data-driven — pass any parsed listing record as `asset`.
   ──────────────────────────────────────────────────────────────────────────── */

const usd = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const usdSigned = (n) => (n < 0 ? `(${usd(Math.abs(n))})` : usd(n));

const sf = (n) => n.toLocaleString("en-US");

const TONES = {
  emerald: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30",
    bar: "bg-emerald-400",
    glow: "from-emerald-500/12",
  },
  sky: {
    dot: "bg-sky-400",
    text: "text-sky-300",
    badge: "bg-sky-500/10 text-sky-300 ring-sky-500/30",
    bar: "bg-sky-400",
    glow: "from-sky-500/12",
  },
  amber: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
    bar: "bg-amber-400",
    glow: "from-amber-500/12",
  },
  slate: {
    dot: "bg-slate-400",
    text: "text-slate-300",
    badge: "bg-slate-500/10 text-slate-300 ring-slate-500/30",
    bar: "bg-slate-400",
    glow: "from-slate-500/10",
  },
};

const tone = (key) => TONES[key] ?? TONES.slate;

/* ── Primitives ───────────────────────────────────────────────────────────── */

function Eyebrow({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{children}</p>
  );
}

function SourceTag({ source }) {
  if (source === "listing") {
    return (
      <span className="rounded-sm bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        Listing
      </span>
    );
  }
  return (
    <span className="rounded-sm bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-indigo-300 ring-1 ring-inset ring-indigo-500/25">
      Modeled
    </span>
  );
}

function Section({ id, label, title, action, children }) {
  return (
    <section id={id} className="border-t border-slate-800/80 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>{label}</Eyebrow>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {title}
            </h2>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Header ───────────────────────────────────────────────────────────────── */

function Header({ asset }) {
  const { pricing } = asset;

  return (
    <header className="relative overflow-hidden border-b border-slate-800/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_-10%,rgba(16,185,129,0.16),transparent_60%),radial-gradient(90%_80%_at_95%_0%,rgba(56,189,248,0.12),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 lg:px-10 lg:pb-14 lg:pt-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {asset.status}
          </span>
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300 ring-1 ring-inset ring-slate-700">
            {asset.assetClass}
          </span>
          <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300 ring-1 ring-inset ring-slate-700">
            {asset.submarket}
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {asset.name}
            </h1>
            <p className="mt-3 text-sm text-slate-400 sm:text-base">
              {asset.address} · {asset.cityStateZip}
            </p>

            {/* Hero image slot — drop the tower photo in when ready. */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
              {asset.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.heroImage}
                  alt={`${asset.name}, ${asset.address}`}
                  className="h-44 w-full object-cover sm:h-56 lg:h-64"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-[linear-gradient(135deg,rgba(30,41,59,0.9),rgba(15,23,42,0.9))] sm:h-56 lg:h-64">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                      Asset imagery
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Set <code className="text-slate-400">heroImage</code> on the asset record
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur sm:p-6">
            <Eyebrow>Valuation anchor</Eyebrow>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {usd(pricing.valuation)}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              ${pricing.pricePerSf.toFixed(2)} / SF · {sf(asset.buildingSf)} SF
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Target cap rate
                </dt>
                <dd className="mt-1 text-xl font-semibold text-emerald-300">
                  {pricing.targetCapRate.toFixed(2)}%
                </dd>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Going-in yield
                </dt>
                <dd className="mt-1 text-xl font-semibold text-white">
                  {pricing.goingInYield.toFixed(2)}%
                </dd>
              </div>
            </dl>

            <a
              href="#data-room"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <LockIcon />
              Access Due-Diligence Vault
            </a>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{pricing.basis}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── KPI grid ─────────────────────────────────────────────────────────────── */

function KpiGrid({ kpis }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => {
        const t = tone(kpi.tone);
        return (
          <article
            key={kpi.label}
            className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700`}
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b ${t.glow} to-transparent opacity-0 transition group-hover:opacity-100`}
            />
            <div className="relative flex items-start justify-between gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {kpi.label}
              </p>
              <SourceTag source={kpi.source} />
            </div>
            <p className="relative mt-3 text-3xl font-semibold tracking-tight text-white">
              {kpi.value}
            </p>
            <p className="relative mt-1 text-xs text-slate-400">{kpi.sub}</p>
            <div className="relative mt-4 border-t border-slate-800 pt-3">
              <p className="text-[11px] text-slate-500">{kpi.detail}</p>
              <p className={`mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium ${t.text}`}>
                <span className={`h-1 w-1 rounded-full ${t.dot}`} />
                {kpi.trend}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ── Integrity badges ─────────────────────────────────────────────────────── */

function IntegrityCards({ items }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      {items.map((item) => {
        const t = tone(item.tone);
        return (
          <article
            key={item.title}
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ring-1 ring-inset ${t.badge}`}
              >
                {item.badge}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className={`text-3xl font-semibold tracking-tight ${t.text}`}>{item.score}</span>
              <span className="text-[11px] text-slate-500">{item.scoreLabel}</span>
            </div>

            <dl className="mt-4 space-y-2 border-t border-slate-800 pt-4">
              {item.lines.map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 text-xs">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="text-right font-medium text-slate-300">{v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 flex items-start gap-2 border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-500">
              <DocIcon className="mt-0.5 h-3 w-3 shrink-0 text-slate-600" />
              <span>{item.report}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}

/* ── Financial & lease roll waterfall ─────────────────────────────────────── */

const TABS = [
  { id: "roll", label: "Lease Roll" },
  { id: "noi", label: "NOI Bridge" },
  { id: "opex", label: "Operating Expenses" },
];

function FinancialWaterfall({ asset }) {
  const [tab, setTab] = useState("roll");
  const [activeYear, setActiveYear] = useState(
    asset.leaseRoll.find((r) => r.cliff)?.year ?? asset.leaseRoll[0].year,
  );

  const maxPct = useMemo(
    () => Math.max(...asset.leaseRoll.map((r) => r.pct)),
    [asset.leaseRoll],
  );
  const maxNoi = useMemo(
    () => Math.max(...asset.noiBridge.map((r) => Math.abs(r.amount))),
    [asset.noiBridge],
  );
  const maxOpex = useMemo(() => Math.max(...asset.opex.map((r) => r.psf)), [asset.opex]);

  const selected = asset.leaseRoll.find((r) => r.year === activeYear) ?? asset.leaseRoll[0];
  const mtm =
    selected.inPlace != null
      ? ((asset.marketRent - selected.inPlace) / selected.inPlace) * 100
      : null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`shrink-0 border-b-2 px-4 py-3.5 text-xs font-semibold tracking-wide transition sm:px-6 ${
              tab === t.id
                ? "border-emerald-400 text-white"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "roll" && (
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              <span>Expiration schedule · % of 385,000 SF</span>
              <span className="hidden sm:inline">Market rent ${asset.marketRent.toFixed(2)}</span>
            </div>

            <ul className="space-y-2">
              {asset.leaseRoll.map((row) => {
                const isActive = row.year === activeYear;
                const barTone = row.cliff ? "bg-amber-400" : row.inPlace == null ? "bg-slate-500" : "bg-emerald-400";
                return (
                  <li key={row.year}>
                    <button
                      type="button"
                      onClick={() => setActiveYear(row.year)}
                      aria-pressed={isActive}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                        isActive
                          ? "border-slate-600 bg-slate-800/70"
                          : "border-transparent hover:border-slate-800 hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="w-14 shrink-0 font-semibold text-slate-200">{row.year}</span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${barTone} transition-all duration-500`}
                            style={{ width: `${(row.pct / maxPct) * 100}%` }}
                          />
                        </div>
                        <span className="w-12 shrink-0 text-right font-mono text-[11px] text-slate-400">
                          {row.pct.toFixed(1)}%
                        </span>
                        <span className="hidden w-20 shrink-0 text-right font-mono text-[11px] text-slate-500 sm:inline">
                          {sf(row.sf)} SF
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail panel */}
          <div className="border-t border-slate-800 bg-slate-950/50 p-4 sm:p-6 lg:border-l lg:border-t-0">
            <Eyebrow>{selected.year === "Vacant" ? "Current vacancy" : `${selected.year} expirations`}</Eyebrow>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{sf(selected.sf)}</p>
            <p className="text-xs text-slate-500">rentable SF · {selected.pct.toFixed(2)}% of NRA</p>

            <dl className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-xs">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">In-place rent</dt>
                <dd className="font-mono font-medium text-slate-200">
                  {selected.inPlace != null ? `$${selected.inPlace.toFixed(2)} /SF` : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Market rent</dt>
                <dd className="font-mono font-medium text-slate-200">
                  ${asset.marketRent.toFixed(2)} /SF
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Mark-to-market</dt>
                <dd
                  className={`font-mono font-semibold ${
                    mtm == null ? "text-slate-400" : mtm >= 0 ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {mtm == null ? "n/a" : `${mtm >= 0 ? "+" : ""}${mtm.toFixed(1)}%`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Annualised at market</dt>
                <dd className="font-mono font-medium text-slate-200">
                  {usd(selected.sf * asset.marketRent)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] leading-relaxed text-slate-400">
              {selected.cliff ? (
                <span className="mb-1 block font-semibold uppercase tracking-[0.12em] text-amber-300">
                  Expiration cliff
                </span>
              ) : null}
              {selected.note}
            </p>
          </div>
        </div>
      )}

      {tab === "noi" && (
        <div className="p-4 sm:p-6">
          <ul className="space-y-1.5">
            {asset.noiBridge.map((row) => {
              const isTotal = row.kind === "total";
              const isSubtotal = row.kind === "subtotal";
              const isLess = row.kind === "less";
              return (
                <li
                  key={row.label}
                  className={`rounded-lg px-3 py-2.5 ${
                    isTotal
                      ? "bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/25"
                      : isSubtotal
                        ? "bg-slate-800/50"
                        : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`text-xs ${
                        isTotal || isSubtotal ? "font-semibold text-white" : "text-slate-400"
                      }`}
                    >
                      {row.label}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-xs font-semibold ${
                        isTotal ? "text-emerald-300" : isLess ? "text-rose-300" : "text-slate-200"
                      }`}
                    >
                      {usdSigned(row.amount)}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTotal ? "bg-emerald-400" : isLess ? "bg-rose-400" : isSubtotal ? "bg-sky-400" : "bg-slate-500"
                      }`}
                      style={{ width: `${(Math.abs(row.amount) / maxNoi) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "opex" && (
        <div className="p-4 sm:p-6">
          <ul className="space-y-2">
            {asset.opex.map((row) => (
              <li key={row.label} className="rounded-lg px-3 py-2">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="shrink-0 font-mono font-semibold text-slate-200">
                    ${row.psf.toFixed(2)} /SF
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-sky-400 transition-all duration-500"
                    style={{ width: `${(row.psf / maxOpex) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg bg-slate-800/50 px-3 py-3">
            <span className="text-xs font-semibold text-white">Total operating expenses</span>
            <span className="font-mono text-xs font-semibold text-white">
              ${asset.opexTotalPsf.toFixed(2)} /SF
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Availabilities ───────────────────────────────────────────────────────── */

function Availabilities({ asset }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <th className="px-4 py-3 font-semibold">Suite</th>
              <th className="px-4 py-3 font-semibold">Size (SF)</th>
              <th className="px-4 py-3 font-semibold">Rate</th>
              <th className="px-4 py-3 font-semibold">Term</th>
              <th className="px-4 py-3 font-semibold">Build-out</th>
              <th className="px-4 py-3 text-right font-semibold">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {asset.availabilities.map((row) => (
              <tr key={row.suite} className="transition hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium text-slate-200">
                  {row.suite}
                  <span className="mt-0.5 block text-[10px] text-slate-500">{row.use}</span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-300">{row.sf}</td>
                <td className="px-4 py-3 font-mono text-emerald-300">${row.rate.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-400">{row.term}</td>
                <td className="px-4 py-3 text-slate-400">{row.buildOut}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1 ring-inset ${
                      row.ready === "Now"
                        ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25"
                        : "bg-amber-500/10 text-amber-300 ring-amber-500/25"
                    }`}
                  >
                    {row.ready}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-500">
        {asset.availabilityNote}
      </p>
    </div>
  );
}

/* ── Data room ────────────────────────────────────────────────────────────── */

const ACCESS = {
  open: { label: "Open", cls: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25" },
  vault: { label: "Vault — NDA", cls: "bg-sky-500/10 text-sky-300 ring-sky-500/25" },
  pending: { label: "Pending", cls: "bg-amber-500/10 text-amber-300 ring-amber-500/25" },
};

function DataRoom({ documents }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
      <ul className="divide-y divide-slate-800/70">
        {documents.map((doc) => {
          const access = ACCESS[doc.access] ?? ACCESS.open;
          return (
            <li key={doc.name}>
              <a
                href="#data-room"
                className="flex items-center gap-3 px-4 py-4 transition hover:bg-slate-800/40 sm:gap-4 sm:px-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <DocIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {doc.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-slate-500">{doc.meta}</span>
                </span>
                <span
                  className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1 ring-inset sm:inline-block ${access.cls}`}
                >
                  {access.label}
                </span>
                <DownloadIcon className="h-4 w-4 shrink-0 text-slate-600" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Tenancy, amenities, parking ──────────────────────────────────────────── */

function AssetProfile({ asset }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <Eyebrow>Select tenancy</Eyebrow>
        <ul className="mt-4 space-y-3">
          {asset.tenants.map((t) => (
            <li key={t.name} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <p className="text-sm font-medium text-slate-100">{t.name}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{t.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <Eyebrow>Amenity stack</Eyebrow>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {asset.amenities.map((a) => (
            <li
              key={a}
              className="rounded-md bg-slate-800/70 px-2.5 py-1.5 text-[11px] text-slate-300"
            >
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-slate-800 pt-4">
          <Eyebrow>Parking income</Eyebrow>
          <dl className="mt-3 space-y-2">
            {asset.parking.map((p) => (
              <div key={p.label} className="flex items-center justify-between gap-4 text-xs">
                <dt className="text-slate-500">{p.label}</dt>
                <dd className="text-right text-slate-300">
                  <span className="font-mono font-semibold text-slate-100">{p.value}</span>
                  <span className="ml-2 text-slate-500">{p.rate}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <Eyebrow>Location scoring</Eyebrow>
        <ul className="mt-4 space-y-4">
          {asset.walkScores.map((s) => (
            <li key={s.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{s.label}</span>
                <span className="font-mono font-semibold text-slate-100">{s.value}/100</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
          Source: Local Logic® via listing.
        </p>
      </div>
    </div>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────────── */

function Footer({ asset }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-900/40 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <div>
            <Eyebrow>Listing brokerage</Eyebrow>
            <p className="mt-3 text-lg font-semibold text-white">{asset.brokerage}</p>
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-500">
              Full-service landlord representation. Budgeting, marketing plan and execution handled
              in-house.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {asset.brokers.map((b) => (
              <div key={b.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-white">{b.name}</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-emerald-300">
                  {b.title}
                </p>
                <a
                  href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-200 transition hover:text-emerald-300"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  {b.phone}
                </a>
                <p className="mt-3 border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-500">
                  {b.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-600">
            Figures marked <span className="text-indigo-300">Modeled</span> are Avarabrands
            underwriting derived from published listing inputs — not broker-warranted. Verify against
            vault documents before committing capital.
          </p>
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Powered by Avarabrands Asset Infrastructure
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────────── */

function LockIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 1a4 4 0 0 0-4 4v2H5.5A1.5 1.5 0 0 0 4 8.5v8A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 7H14V5a4 4 0 0 0-4-4Zm2.5 6V5a2.5 2.5 0 0 0-5 0v2h5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DocIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
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

function DownloadIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 12 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.9a1.5 1.5 0 0 1 1.44 1.09l.6 2.1a1.5 1.5 0 0 1-.53 1.6l-1.1.83a11.5 11.5 0 0 0 4.57 4.57l.83-1.1a1.5 1.5 0 0 1 1.6-.53l2.1.6A1.5 1.5 0 0 1 18 12.6v1.9a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 2 3.5Z" />
    </svg>
  );
}

/* ── Root ─────────────────────────────────────────────────────────────────── */

export default function AssetPassport({ asset }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Header asset={asset} />

      <Section id="kpis" label="Investor summary" title="Hero underwriting metrics">
        <KpiGrid kpis={asset.kpis} />
      </Section>

      <Section id="integrity" label="Component integrity" title="Asset health & systems">
        <IntegrityCards items={asset.integrity} />
      </Section>

      <Section
        id="financials"
        label="Financial detail"
        title="Lease roll & income waterfall"
        action={
          <p className="text-[11px] text-slate-500">
            Select a bar to inspect mark-to-market on that vintage.
          </p>
        }
      >
        <FinancialWaterfall asset={asset} />
      </Section>

      <Section id="availabilities" label="Current availabilities" title="Marketed suites">
        <Availabilities asset={asset} />
      </Section>

      <Section id="data-room" label="Due-diligence vault" title="Digital data room">
        <DataRoom documents={asset.documents} />
      </Section>

      <Section id="profile" label="Asset profile" title="Tenancy, amenities & location">
        <AssetProfile asset={asset} />
      </Section>

      <Footer asset={asset} />
    </main>
  );
}
