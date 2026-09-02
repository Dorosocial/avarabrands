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
} from "./shared";

/* ────────────────────────────────────────────────────────────────────────────
   Heavy industrial equipment passport
   Duty-cycle economics, service intervals and subsystem health, on the shared
   kit. The CRE passport's cap-rate engine has no meaning for a machine; the
   analogue here is throughput and payback against the manual method it replaces.
   ──────────────────────────────────────────────────────────────────────────── */

const VIEWS = [
  { id: "duty", num: "01", label: "Duty Cycle & Commercials" },
  { id: "mechanical", num: "02", label: "Mechanical & Component Health" },
  { id: "vault", num: "03", label: "Documentation Vault" },
];

const secs = (n) => `${Math.round(n)} s`;
const mins = (n) => `${(n / 60).toFixed(2)} min`;

/* ── Configuration anchor ─────────────────────────────────────────────────── */

function ConfigurationAnchor({ asset }) {
  const a = asset.anchor;
  return (
    <div className="flex flex-col border-t-2 border-ink bg-surface">
      <div className="border-b border-rule px-4 py-3">
        <p className={LABEL}>Rated capacity</p>
        <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-ink sm:text-[2.6rem] sm:leading-none">
          {a.ratedLoad}
        </p>
        <p className="mt-2 font-mono text-[11px] text-muted">
          Dual platform · clamping mechanism + V-groove
        </p>
      </div>
      <dl className="grid grid-cols-2 divide-x divide-rule border-b border-rule">
        <div className="px-4 py-3">
          <dt className={LABEL}>Tilt arc</dt>
          <dd className="mt-1 font-mono text-xl font-bold text-forest">{a.tiltAngle}</dd>
        </div>
        <div className="px-4 py-3">
          <dt className={LABEL}>Cycle time</dt>
          <dd className="mt-1 font-mono text-xl font-bold text-ink">{a.cycleTime}</dd>
        </div>
      </dl>
      <div className="px-4 py-4">
        <a
          href="#vault"
          className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-forest"
        >
          <LockIcon />
          Access Documentation Vault
        </a>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">{a.basis}</p>
      </div>
    </div>
  );
}

/* ── The duty-cycle model ─────────────────────────────────────────────────── */

function modelDuty(d, { tiltTime, cyclesPerShift, capex }) {
  /* The machine's own cycle: load, tilt up, tilt down, unload. Processing
     happens while the disc is held vertical and is not the tilter's constraint. */
  const cycleSec = d.loadSeconds + 2 * tiltTime + d.unloadSeconds;
  const productiveSec = d.shiftHours * 3600 * d.shiftUtilisation;
  const capacityPerShift = Math.floor(productiveSec / cycleSec);
  const utilisation = (cyclesPerShift / capacityPerShift) * 100;
  const annualCycles = cyclesPerShift * d.shiftsPerDay * d.workingDays;

  const machineLabour = (cycleSec / 3600) * d.operatorsMachine * d.labourRate;
  const energy = d.powerKw * ((2 * tiltTime) / 3600) * d.energyRate;
  const maintenance = (capex * d.maintenancePct) / 100;
  const maintenancePerCycle = annualCycles > 0 ? maintenance / annualCycles : 0;
  const costPerCycle = machineLabour + energy + maintenancePerCycle;

  const manualPerCycle = (d.manualMinutes / 60) * d.operatorsManual * d.labourRate;
  const savingPerCycle = manualPerCycle - machineLabour - energy;
  const netAnnualSaving = savingPerCycle * annualCycles - maintenance;
  const paybackMonths = netAnnualSaving > 0 ? capex / (netAnnualSaving / 12) : Infinity;

  return {
    cycleSec, capacityPerShift, utilisation, annualCycles,
    machineLabour, energy, maintenance, maintenancePerCycle, costPerCycle,
    manualPerCycle, savingPerCycle, netAnnualSaving, paybackMonths,
  };
}

/* ── II. Duty-cycle calculator ────────────────────────────────────────────── */

function DutyCalculator({ asset, inputs, onChange }) {
  const d = asset.duty;
  const { tiltTime, cyclesPerShift, capex } = inputs;
  const set = (key) => (v) => onChange((s) => ({ ...s, [key]: v }));
  const calc = useMemo(() => modelDuty(d, inputs), [d, inputs]);

  /* Utilisation is the operational constraint; payback is the commercial one. */
  const utilTone =
    calc.utilisation > 100 ? "oxblood" : calc.utilisation > 85 ? "ochre" : "forest";
  const payTone =
    calc.paybackMonths <= 12 ? "forest" : calc.paybackMonths <= d.paybackHurdleMonths ? "ochre" : "oxblood";
  const payLabel =
    calc.paybackMonths <= 12 ? "STRONG" : calc.paybackMonths <= d.paybackHurdleMonths ? "ACCEPTABLE" : "FAILS HURDLE";

  const reset = () =>
    onChange({
      tiltTime: d.tiltTime.initial,
      cyclesPerShift: d.cyclesPerShift.initial,
      capex: d.capex.initial,
    });
  const atDefaults =
    tiltTime === d.tiltTime.initial &&
    cyclesPerShift === d.cyclesPerShift.initial &&
    capex === d.capex.initial;

  const rows = [
    ["Machine cycle time", `${secs(calc.cycleSec)} · ${mins(calc.cycleSec)}`, "text-graphite"],
    ["Capacity per shift", `${calc.capacityPerShift} cycles`, "text-graphite"],
    [
      "Duty utilisation",
      calc.utilisation > 100 ? `${pct(calc.utilisation, 0)} — over capacity` : pct(calc.utilisation, 0),
      tone(utilTone).text,
    ],
    ["Cost per cycle", `$${calc.costPerCycle.toFixed(2)}`, "text-graphite"],
    ["Saving vs manual, per cycle", `$${calc.savingPerCycle.toFixed(2)}`, calc.savingPerCycle >= 0 ? "text-forest" : "text-oxblood"],
    ["Net annual saving", usd(calc.netAnnualSaving), calc.netAnnualSaving >= 0 ? "text-forest" : "text-oxblood"],
  ];

  return (
    <div className="grid grid-cols-1 border border-rule-strong bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="border-b border-rule px-4 py-4 lg:border-b-0 lg:border-r">
        <div className="flex items-baseline justify-between gap-3 border-b border-ink pb-2">
          <p className={LABEL}>Duty inputs</p>
          <button
            type="button"
            onClick={reset}
            disabled={atDefaults}
            className={`${LINK} disabled:cursor-default disabled:text-faint disabled:no-underline`}
          >
            Reset to specification
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          <Slider
            label="Tilt time — throttle valve"
            value={tiltTime}
            min={d.tiltTime.min}
            max={d.tiltTime.max}
            step={d.tiltTime.step}
            format={(v) => `${v} s`}
            onChange={set("tiltTime")}
          />
          <Slider
            label="Cycles per shift"
            value={cyclesPerShift}
            min={d.cyclesPerShift.min}
            max={d.cyclesPerShift.max}
            step={d.cyclesPerShift.step}
            format={(v) => `${v}`}
            onChange={set("cyclesPerShift")}
          />
          <Slider
            label="Indicative capex"
            value={capex}
            min={d.capex.min}
            max={d.capex.max}
            step={d.capex.step}
            format={(v) => usd(v)}
            onChange={set("capex")}
          />
        </div>

        <dl className="mt-5 border-t border-dotted border-rule-strong pt-2 text-[11px]">
          {[
            ["Manual baseline (held constant)", `${d.manualMinutes} min · ${d.operatorsManual} operators`],
            ["Labour rate", `${usd(d.labourRate)}/hr fully loaded`],
            ["Operating pattern", `${d.shiftsPerDay} shifts · ${d.workingDays} days/yr`],
            ["Shift allowance", `${Math.round((1 - d.shiftUtilisation) * 100)}% non-productive`],
          ].map(([k, v]) => (
            <div key={k} className="mt-1 flex items-baseline justify-between gap-3">
              <dt className="text-faint">{k}</dt>
              <dd className="text-right font-mono font-semibold text-graphite">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <div className="border-b border-rule px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={LABEL}>Annual throughput</p>
              <p className="mt-1 font-mono text-4xl font-bold leading-none tracking-tight text-ink sm:text-5xl">
                {sf(calc.annualCycles)}
              </p>
              <p className="mt-2 font-mono text-[11px] text-muted">
                wheel discs/yr · {cyclesPerShift} per shift of {calc.capacityPerShift} capacity
              </p>
            </div>
            <div className="sm:text-right">
              <p className={LABEL}>Payback</p>
              <p
                className={`mt-1 font-mono text-4xl font-bold leading-none tracking-tight ${tone(payTone).text}`}
              >
                {Number.isFinite(calc.paybackMonths) ? `${calc.paybackMonths.toFixed(1)} mo` : "—"}
              </p>
              <div className="mt-2">
                <StatusMark
                  label={payLabel}
                  meta={`HURDLE ${d.paybackHurdleMonths} MO`}
                  toneKey={payTone}
                />
              </div>
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {rows.map(([k, v, cls], i) => (
            <div
              key={k}
              className={[
                "flex items-baseline justify-between gap-4 border-rule px-4 py-2.5",
                i % 2 === 0 ? "sm:border-r" : "",
                i < rows.length - 1 ? "border-b" : "",
                i >= rows.length - 2 ? "sm:border-b-0" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <dt className="text-[11px] text-faint">{k}</dt>
              <dd className={`font-mono text-sm font-semibold ${cls}`}>{v}</dd>
            </div>
          ))}
        </dl>

        <p className="border-t border-rule px-4 py-2 text-[11px] leading-relaxed text-muted">
          <span className={LABEL}>Note </span>
          Slowing the throttle protects heavy discs from inertial impact but lengthens the cycle, so
          capacity falls and utilisation climbs — past {pct(100, 0)} the cell cannot meet the demand
          set above. Payback is dominated by the manual baseline: at {d.manualMinutes} minutes and{" "}
          {d.operatorsManual} operators it is the largest single assumption in the model.
        </p>
      </div>
    </div>
  );
}

/* ── III. Service, cost and cycle schedule ────────────────────────────────── */

const SCHEDULE_TABS = [
  { id: "service", label: "Service Interval Schedule" },
  { id: "cycle", label: "Cycle Time Build" },
  { id: "cost", label: "Cost Stack per Cycle" },
];

const SERVICE_FILTERS = [
  { id: "all", label: "Show All", test: () => true },
  { id: "near", label: "Due Now & Near-Term (≤500 h)", test: (r) => r.intervalHours <= 500 },
  { id: "long", label: "Long-Interval (1,000 h+)", test: (r) => r.intervalHours >= 1000 },
];

/** Consumed share of an interval bands the same way everywhere. */
const dueTone = (p) => (p >= 90 ? "oxblood" : p >= 70 ? "ochre" : "forest");
const dueLabel = (p) => (p >= 90 ? "DUE" : p >= 70 ? "SOON" : "OK");

function ServiceSchedule({ asset, inputs }) {
  const [tab, setTab] = useState("service");
  const [filterId, setFilterId] = useState("all");
  const [activeId, setActiveId] = useState(asset.serviceSchedule.find((r) => r.cliff)?.id);

  const d = asset.duty;
  const calc = useMemo(() => modelDuty(d, inputs), [d, inputs]);

  const filter = SERVICE_FILTERS.find((f) => f.id === filterId) ?? SERVICE_FILTERS[0];
  const rows = useMemo(
    () =>
      asset.serviceSchedule
        .filter(filter.test)
        .map((r) => ({ ...r, pct: (r.sinceHours / r.intervalHours) * 100, toGo: r.intervalHours - r.sinceHours })),
    [asset.serviceSchedule, filter],
  );

  /* Selection always resolves to a visible row. */
  const sel = rows.find((r) => r.id === activeId) ?? rows[0] ?? null;
  const nearest = rows.length ? Math.min(...rows.map((r) => r.toGo)) : 0;

  const cycleBuild = [
    { label: "Load and position on V-groove", sec: d.loadSeconds, kind: "add" },
    { label: "Tilt 0–90° at throttle setting", sec: inputs.tiltTime, kind: "add" },
    { label: "Return 90–0° at throttle setting", sec: inputs.tiltTime, kind: "add" },
    { label: "Release clamp and unload", sec: d.unloadSeconds, kind: "add" },
    { label: "Machine cycle", sec: calc.cycleSec, kind: "total" },
  ];
  const maxSec = Math.max(...cycleBuild.map((r) => r.sec));

  const costStack = [
    { label: `Operator labour — ${mins(calc.cycleSec)} × ${d.operatorsMachine}`, amt: calc.machineLabour, kind: "add" },
    { label: `Energy — ${d.powerKw} kW during tilt only`, amt: calc.energy, kind: "add" },
    { label: `Maintenance provision — ${d.maintenancePct}% of capex`, amt: calc.maintenancePerCycle, kind: "add" },
    { label: "Cost per cycle", amt: calc.costPerCycle, kind: "total" },
    { label: `Manual method — ${d.manualMinutes} min × ${d.operatorsManual}`, amt: calc.manualPerCycle, kind: "sub" },
    { label: "Saving per cycle", amt: calc.savingPerCycle, kind: "saving" },
  ];
  const maxAmt = Math.max(...costStack.map((r) => Math.abs(r.amt)));

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

      {tab === "service" && (
        <>
          <div className="flex flex-wrap items-center gap-2 border-b border-rule bg-paper px-3 py-2">
            <span className={LABEL}>Filter</span>
            {SERVICE_FILTERS.map((f) => {
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
              {rows.length} of {asset.serviceSchedule.length} intervals · nearest due in{" "}
              <span className="font-semibold text-ink">{sf(nearest)} h</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    <th className="px-3 py-2 font-semibold">Interval</th>
                    <th className="px-3 py-2 font-semibold">Task</th>
                    <th className="px-3 py-2 text-right font-semibold">Hours run</th>
                    <th className="w-[22%] px-3 py-2 font-semibold">Consumed</th>
                    <th className="px-3 py-2 text-right font-semibold">To go</th>
                    <th className="px-3 py-2 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const on = sel && r.id === sel.id;
                    const t = dueTone(r.pct);
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setActiveId(r.id)}
                        className={`cursor-pointer border-b border-rule text-xs transition ${
                          on ? "bg-forest-tint" : "hover:bg-paper"
                        }`}
                      >
                        <th scope="row" className="px-3 py-2 text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveId(r.id);
                            }}
                            className="font-mono text-xs font-bold text-ink"
                          >
                            {r.id}
                          </button>
                        </th>
                        <td className="px-3 py-2 text-muted">{r.title}</td>
                        <td className="px-3 py-2 text-right font-mono text-graphite">
                          {sf(r.sinceHours)}
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-2 w-full bg-paper ring-1 ring-inset ring-rule">
                            <div
                              className={`h-full ${tone(t).bar}`}
                              style={{ width: `${Math.min(r.pct, 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-graphite">
                          {sf(r.toGo)} h
                        </td>
                        <td className="px-3 py-2 text-right">
                          <StatusMark label={dueLabel(r.pct)} meta={`${Math.round(r.pct)}%`} toneKey={t} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-b border-rule-strong bg-paper font-mono text-[11px] font-bold text-ink">
                    <th scope="row" className="px-3 py-2 text-left uppercase tracking-[0.1em]">
                      {filterId === "all" ? "All intervals" : "Filtered"}
                    </th>
                    <td className="px-3 py-2 text-muted">{rows.length} scheduled</td>
                    <td className="px-3 py-2 text-right">{sf(asset.machineHours)}</td>
                    <td colSpan={3} className="px-3 py-2 text-right font-medium text-muted">
                      Machine hours since commissioning
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="border-t border-rule-strong bg-paper px-4 py-4 lg:border-l lg:border-t-0">
              {sel ? (
                <>
                  <p className={LABEL}>{sel.id} service</p>
                  <p className="mt-2 font-mono text-3xl font-bold leading-none tracking-tight text-ink">
                    {sf(sel.toGo)} h
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    to next · {Math.round(sel.pct)}% of interval consumed
                  </p>

                  <dl className="mt-4 border-t border-ink pt-2 text-[11px]">
                    {[
                      ["Interval", `${sf(sel.intervalHours)} h`],
                      ["Hours run", `${sf(sel.sinceHours)} h`],
                      ["Last performed", sel.lastPerformed],
                      ["Parts", sel.parts],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-baseline justify-between gap-4 border-b border-dotted border-rule-strong py-1.5"
                      >
                        <dt className="text-faint">{k}</dt>
                        <dd className="text-right font-mono font-semibold text-graphite">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className={`${LABEL} mt-4`}>Scope</p>
                  <ul className="mt-1.5">
                    {sel.tasks.map((t) => (
                      <li
                        key={t}
                        className="border-b border-dotted border-rule-strong py-1.5 text-[11px] text-graphite last:border-b-0"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 text-[11px] leading-relaxed text-muted">
                    {sel.cliff ? (
                      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ochre">
                        Due within 30 hours
                      </span>
                    ) : null}
                    {sel.note}
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-muted">No intervals in this filter.</p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "cycle" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <th className="px-3 py-2 font-semibold">Cycle element</th>
                <th className="w-[34%] px-3 py-2 font-semibold">Share</th>
                <th className="px-3 py-2 text-right font-semibold">Seconds</th>
                <th className="px-3 py-2 text-right font-semibold">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {cycleBuild.map((r) => {
                const isTotal = r.kind === "total";
                return (
                  <tr
                    key={r.label}
                    className={`border-b text-xs ${
                      isTotal ? "border-t-2 border-ink bg-forest-tint" : "border-rule"
                    }`}
                  >
                    <th
                      scope="row"
                      className={`px-3 py-2 text-left ${
                        isTotal ? "font-semibold text-ink" : "font-normal text-muted"
                      }`}
                    >
                      {r.label}
                    </th>
                    <td className="px-3 py-2">
                      <div className="h-2 w-full bg-white ring-1 ring-inset ring-rule">
                        <div
                          className={`h-full transition-[width] duration-200 ${isTotal ? "bg-forest" : "bg-rule-strong"}`}
                          style={{ width: `${(r.sec / maxSec) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-mono font-semibold ${isTotal ? "text-forest" : "text-ink"}`}
                    >
                      {secs(r.sec)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-graphite">{mins(r.sec)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-rule px-3 py-2 text-[11px] text-muted">
            <span className={LABEL}>Note </span>
            Tilt up and tilt down both track the throttle valve, so the setting counts twice against
            every cycle. Processing time while the disc is held vertical is not the tilter's
            constraint and is excluded.
          </p>
        </div>
      )}

      {tab === "cost" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <th className="px-3 py-2 font-semibold">Line item</th>
                <th className="w-[30%] px-3 py-2 font-semibold">Share</th>
                <th className="px-3 py-2 text-right font-semibold">Per cycle</th>
                <th className="px-3 py-2 text-right font-semibold">Per year</th>
              </tr>
            </thead>
            <tbody>
              {costStack.map((r) => {
                const isTotal = r.kind === "total";
                const isSaving = r.kind === "saving";
                const isSub = r.kind === "sub";
                return (
                  <tr
                    key={r.label}
                    className={`border-b text-xs ${
                      isSaving
                        ? "border-t-2 border-ink bg-forest-tint"
                        : isTotal
                          ? "border-rule-strong bg-paper"
                          : "border-rule"
                    }`}
                  >
                    <th
                      scope="row"
                      className={`px-3 py-2 text-left ${
                        isTotal || isSaving ? "font-semibold text-ink" : "font-normal text-muted"
                      }`}
                    >
                      {r.label}
                    </th>
                    <td className="px-3 py-2">
                      <div className="h-2 w-full bg-white ring-1 ring-inset ring-rule">
                        <div
                          className={`h-full transition-[width] duration-200 ${
                            isSaving ? "bg-forest" : isSub ? "bg-oxblood" : isTotal ? "bg-graphite" : "bg-rule-strong"
                          }`}
                          style={{ width: `${(Math.abs(r.amt) / maxAmt) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td
                      className={`px-3 py-2 text-right font-mono font-semibold ${
                        isSaving ? "text-forest" : isSub ? "text-oxblood" : "text-ink"
                      }`}
                    >
                      ${r.amt.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-graphite">
                      {usd(r.amt * calc.annualCycles)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="border-t border-rule px-3 py-2 text-[11px] text-muted">
            <span className={LABEL}>Note </span>
            The manual line is the method the tilter replaces — crane, slings and two operators — not
            a cost the machine incurs. The saving is the difference, before the{" "}
            {usd(calc.maintenance)} annual maintenance provision already carried above.
          </p>
        </div>
      )}
    </div>
  );
}

/* ── IV. Specification schedule ───────────────────────────────────────────── */

function SpecSchedule({ asset }) {
  return (
    <div className="border border-rule-strong bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-xs">
          <thead>
            <tr className="border-b border-rule-strong bg-paper font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
              <th className="px-3 py-2 font-semibold">Parameter</th>
              <th className="px-3 py-2 font-semibold">Value</th>
              <th className="px-3 py-2 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody>
            {asset.specs.map((r) => (
              <tr key={r.parameter} className="border-b border-rule transition hover:bg-paper">
                <th scope="row" className="px-3 py-2 text-left font-medium text-ink">
                  {r.parameter}
                </th>
                <td className="px-3 py-2 font-mono font-semibold text-graphite">{r.value}</td>
                <td className="px-3 py-2 text-muted">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-rule px-3 py-2 text-[11px] text-muted">
        <span className={LABEL}>Note </span>
        Reproduced from the manufacturer's specification. Dimensions, foundation loads and the tilt
        envelope are in the General Arrangement Drawing, Exhibit D-1.
      </p>
    </div>
  );
}

/* ── VI. Engineering notes & operating sequence ───────────────────────────── */

/** The machine at rest and at full tilt — the one thing a photo would show. */
function TiltDiagram({ angle }) {
  const pivotX = 120;
  const pivotY = 96;
  const armLen = 74;
  const rad = (-angle * Math.PI) / 180;
  const tipX = pivotX + armLen * Math.cos(rad);
  const tipY = pivotY + armLen * Math.sin(rad);
  /* Disc sits at the far end of the platform, perpendicular to it. */
  const nx = Math.sin(rad);
  const ny = -Math.cos(rad);
  const discR = 22;

  return (
    <svg viewBox="0 0 240 130" className="h-auto w-full" role="img" aria-label={`Platform at ${angle} degrees`}>
      <line x1="16" y1="118" x2="224" y2="118" stroke="#cbd5e1" strokeWidth="2" />
      <rect x={pivotX - 34} y={pivotY + 6} width="68" height="16" fill="#e2e8f0" stroke="#cbd5e1" />
      <path
        d={`M ${pivotX + armLen} ${pivotY} A ${armLen} ${armLen} 0 0 0 ${pivotX} ${pivotY - armLen}`}
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <line
        x1={pivotX}
        y1={pivotY}
        x2={tipX}
        y2={tipY}
        stroke="#0a192f"
        strokeWidth="7"
        strokeLinecap="round"
        style={{ transition: "all 400ms ease-out" }}
      />
      <circle
        cx={tipX + nx * discR}
        cy={tipY + ny * discR}
        r={discR}
        fill="#eaf2ed"
        stroke="#105b38"
        strokeWidth="2.5"
        style={{ transition: "all 400ms ease-out" }}
      />
      <circle cx={pivotX} cy={pivotY} r="4.5" fill="#105b38" />
      <text x={pivotX + 44} y={pivotY + 34} className="font-mono" fontSize="11" fill="#5a6472">
        {angle}°
      </text>
    </svg>
  );
}

function EngineeringNotes({ asset }) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="border border-rule-strong bg-surface">
        <p className={`${LABEL} border-b border-rule px-4 py-2`}>Challenges & resolution</p>
        <dl>
          {asset.engineering.map((e, i) => (
            <div
              key={e.challenge}
              className={`px-4 py-3 ${i < asset.engineering.length - 1 ? "border-b border-rule" : ""}`}
            >
              <dt className="flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-semibold text-ink">{e.challenge}</span>
              </dt>
              <dd className="mt-1.5 pl-6">
                <p className="text-[11px] leading-relaxed text-muted">{e.detail}</p>
                <p className="mt-2 border-l-2 border-forest pl-3 text-[11px] leading-relaxed text-graphite">
                  {e.solution}
                </p>
              </dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-rule bg-paper px-4 py-3">
          <p className={LABEL}>Frequently asked</p>
          <p className="mt-1.5 font-display text-sm font-semibold text-ink">{asset.faq.question}</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{asset.faq.answer}</p>
        </div>
      </div>

      <div className="border border-rule-strong bg-surface">
        <p className={`${LABEL} border-b border-rule px-4 py-2`}>Operating sequence</p>
        <div className="grid grid-cols-2 divide-x divide-rule border-b border-rule bg-paper">
          <figure className="px-2 py-3">
            <TiltDiagram angle={0} />
            <figcaption className={`${LABEL} mt-1 text-center`}>Load / reset</figcaption>
          </figure>
          <figure className="px-2 py-3">
            <TiltDiagram angle={90} />
            <figcaption className={`${LABEL} mt-1 text-center`}>Operating</figcaption>
          </figure>
        </div>
        <ol>
          {asset.workflow.map((w, i) => (
            <li
              key={w.step}
              className={`flex gap-3 px-4 py-2.5 ${i < asset.workflow.length - 1 ? "border-b border-dotted border-rule-strong" : ""}`}
            >
              <span className="shrink-0 font-mono text-[10px] font-bold text-forest">{w.step}</span>
              <span>
                <span className="block text-xs font-semibold text-ink">{w.title}</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{w.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────────────────── */

export default function EquipmentPassport({ asset }) {
  const [view, setView] = useState("duty");
  const [docId, setDocId] = useState(null);
  const [dutyInputs, setDutyInputs] = useState({
    tiltTime: asset.duty.tiltTime.initial,
    cyclesPerShift: asset.duty.cyclesPerShift.initial,
    capex: asset.duty.capex.initial,
  });

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
  const openDocFromTray = useCallback((exhibit) => {
    lastFocusRef.current = null;
    lastExhibitRef.current = exhibit;
    setView("vault");
    setDocId(exhibit);
  }, []);

  /* Each view keeps its own scroll position. */
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
        subtitle={asset.designation}
        anchor={<ConfigurationAnchor asset={asset} />}
      />
      <DossierNav views={VIEWS} view={view} onChange={changeView} />

      {view === "duty" && (
        <div id="view-duty" role="tabpanel">
          <Section id="summary" numeral="I" title="Machine Summary" note="Specification & modelled duty">
            <MetricBand kpis={asset.kpis} />
          </Section>
          <Section
            id="calculator"
            numeral="II"
            title="Duty Cycle Calculator"
            note="Drag any input to remodel throughput and payback"
          >
            <DutyCalculator asset={asset} inputs={dutyInputs} onChange={setDutyInputs} />
          </Section>
          <Section
            id="schedule"
            numeral="III"
            title="Service & Duty Schedule"
            note="Filter the intervals, select a row for scope"
          >
            <ServiceSchedule asset={asset} inputs={dutyInputs} />
          </Section>
          <Section
            id="specs"
            numeral="IV"
            title="Specification Schedule"
            note="As published by the manufacturer"
          >
            <SpecSchedule asset={asset} />
          </Section>
        </div>
      )}

      {view === "mechanical" && (
        <div id="view-mechanical" role="tabpanel">
          <Section
            id="integrity"
            numeral="V"
            title="Subsystem Integrity"
            note="Select a subsystem to open its inspection record"
          >
            <IntegrityIndex items={asset.integrity} onOpenDoc={openDocFromTray} />
          </Section>
          <Section
            id="engineering"
            numeral="VI"
            title="Engineering Notes"
            note="Design challenges & operating sequence"
          >
            <EngineeringNotes asset={asset} />
          </Section>
        </div>
      )}

      {view === "vault" && (
        <div id="view-vault" role="tabpanel">
          <Section id="vault" numeral="VII" title="Documentation Vault" note="Index of exhibits">
            <ExhibitIndex
              documents={asset.documents}
              onOpenDoc={openDoc}
              note="Select any row to open the document preview. Exhibits marked NDA release on execution of the confidentiality agreement; audit dates reflect the last verification of record."
            />
          </Section>
        </div>
      )}

      <Colophon
        orgLabel={asset.orgLabel}
        org={asset.org}
        blurb={asset.orgBlurb}
        contacts={asset.contacts}
        notesLabel="Notes to the specification & model"
        notes={
          <>
            Figures marked <span className="font-mono font-semibold text-graphite">AS SPECIFIED</span>{" "}
            are quoted in the manufacturer's specification. Figures marked{" "}
            <span className="font-mono font-semibold text-graphite">MODELED</span> are Avarabrands
            duty-cycle modelling and are not vendor-warranted — the specification quotes no price and
            no throughput, so capex, labour rates and the manual baseline are illustrative inputs the
            reader should replace with their own. Verify all figures against Exhibits A-1 and A-2
            before committing capital.
          </>
        }
      />
      <DocumentModal doc={doc} asset={asset} onClose={closeDoc} />
    </main>
  );
}
