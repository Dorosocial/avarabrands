"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Shared passport kit
   Primitives and sections common to every asset class. Anything that names a
   specific asset type — cap rates, lease rolls, duty cycles — lives in the
   passport that owns it, not here.
   ──────────────────────────────────────────────────────────────────────────── */

export const usd = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const usdSigned = (n) => (n < 0 ? `(${usd(Math.abs(n))})` : usd(n));
export const sf = (n) => n.toLocaleString("en-US");
export const pct = (n, d = 2) => `${n.toFixed(d)}%`;

/* Semantic tone — status meaning, never decoration. */
export const TONES = {
  forest: { text: "text-forest", chip: "border-forest bg-forest-tint text-forest", bar: "bg-forest" },
  graphite: { text: "text-graphite", chip: "border-graphite bg-white text-graphite", bar: "bg-graphite" },
  ochre: { text: "text-ochre", chip: "border-ochre bg-ochre-tint text-ochre", bar: "bg-ochre" },
  oxblood: { text: "text-oxblood", chip: "border-oxblood bg-oxblood-tint text-oxblood", bar: "bg-oxblood" },
  neutral: { text: "text-ink", chip: "border-rule-strong bg-white text-muted", bar: "bg-rule-strong" },
};
export const tone = (k) => TONES[k] ?? TONES.neutral;

/** Remaining-useful-life banding: healthy, watch, replace. */
export const rulTone = (p) => (p >= 60 ? "forest" : p >= 35 ? "ochre" : "oxblood");

export const LABEL = "font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint";
const LINK =
  "font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-graphite underline decoration-rule-strong underline-offset-2 transition hover:text-forest hover:decoration-forest";
/* ── Primitives ───────────────────────────────────────────────────────────── */

/** Bracketed status indicator — [ VERIFIED · 2025 ] */
export function StatusMark({ label, meta, toneKey }) {
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
export function SourceMark({ source }) {
  const stated = source === "listing" || source === "spec";
  const label = source === "spec" ? "As specified" : source === "listing" ? "As listed" : "Modeled";
  return (
    <span
      className={`shrink-0 border px-1.5 py-px font-mono text-[9px] font-semibold uppercase tracking-[0.1em] ${
        stated ? "border-rule-strong text-muted" : "border-graphite text-graphite"
      }`}
    >
      {label}
    </span>
  );
}

export function Section({ id, numeral, title, note, children }) {
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

export function Masthead({ asset, eyebrow, subtitle, anchor }) {
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
            <p className={LABEL}>{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              {asset.name}
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">{subtitle}</p>

            <div className="mt-5 border border-rule-strong bg-paper">
              {asset.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.heroImage}
                  alt={asset.name}
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

          {anchor}
        </div>
      </div>
    </header>
  );
}

/* ── Dossier navigation ───────────────────────────────────────────────────── */

export function DossierNav({ views, view, onChange }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-rule-strong bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] gap-0 overflow-x-auto px-4 sm:px-6 lg:px-10" role="tablist">
        {views.map((v) => {
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
/* ── Metric band ──────────────────────────────────────────────────────────── */

export function MetricBand({ kpis }) {
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
/* ── Range control ────────────────────────────────────────────────────────── */

export function Slider({ label, value, min, max, step, format, onChange }) {
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
/* ── Component integrity — expandable inspection trays ───────────────────── */

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

export function IntegrityIndex({ items, onOpenDoc }) {
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
/* ── Exhibit index ────────────────────────────────────────────────────────── */

export const ACCESS = {
  open: { label: "Open", tone: "forest" },
  vault: { label: "NDA", tone: "graphite" },
  pending: { label: "Pending", tone: "ochre" },
};

export function ExhibitIndex({ documents, onOpenDoc, note }) {
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
                      data-preview={d.exhibit}
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
        {note}
      </p>
    </div>
  );
}
/* ── Document preview modal ───────────────────────────────────────────────── */

export function DocumentModal({ doc, asset, onClose }) {
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
          {/* Stubs: wire to the real file URL when the vault is connected. */}
          <button
            type="button"
            onClick={onClose}
            className="border border-ink bg-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white transition hover:border-forest hover:bg-forest"
          >
            Download confidential summary
          </button>
          <button
            type="button"
            onClick={onClose}
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
/* ── Colophon ─────────────────────────────────────────────────────────────── */

export function Colophon({ orgLabel, org, blurb, contacts, notes, notesLabel = "Notes to the financial summary" }) {
  return (
    <footer className="border-t-4 border-double border-ink bg-surface px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-10">
          <div>
            <p className={LABEL}>{orgLabel}</p>
            <p className="mt-2 font-display text-lg font-semibold text-ink">{org}</p>
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-muted">{blurb}</p>
          </div>

          <div className="grid border border-rule-strong sm:grid-cols-2">
            {contacts.map((b, i) => (
              <div
                key={b.name}
                className={`px-4 py-3 ${i === 0 ? "border-b border-rule sm:border-b-0 sm:border-r" : ""}`}
              >
                <p className="font-display text-base font-semibold text-ink">{b.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-forest">
                  {b.title}
                </p>
                {b.phone ? (
                  <a
                    href={`tel:${b.phone.replace(/[^+\d]/g, "")}`}
                    className="mt-2 inline-flex items-center gap-2 font-mono text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 transition hover:text-forest hover:decoration-forest"
                  >
                    <PhoneIcon />
                    {b.phone}
                  </a>
                ) : (
                  <p className="mt-2 font-mono text-[11px] text-muted">Contact via vault request</p>
                )}
                <p className="mt-2 border-t border-dotted border-rule-strong pt-2 text-[10px] leading-relaxed text-muted">
                  {b.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-ink pt-3">
          <p className={LABEL}>{notesLabel}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-3xl text-[11px] leading-relaxed text-muted">{notes}</p>
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

export function LockIcon() {
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

export function DocIcon() {
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

export function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.9a1.5 1.5 0 0 1 1.44 1.09l.6 2.1a1.5 1.5 0 0 1-.53 1.6l-1.1.83a11.5 11.5 0 0 0 4.57 4.57l.83-1.1a1.5 1.5 0 0 1 1.6-.53l2.1.6A1.5 1.5 0 0 1 18 12.6v1.9a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 2 3.5Z" />
    </svg>
  );
}
