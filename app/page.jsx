import Link from "next/link";

const PASSPORTS = [
  {
    href: "/assets/lyric-tower",
    kind: "Commercial real estate",
    name: "Lyric Tower",
    detail: "440 Louisiana St, Houston · Class A office · 385,000 SF",
  },
  {
    href: "/assets/wheel-disc-tilter",
    kind: "Heavy industrial equipment",
    name: "Wheel Disc Hydraulic Tilter",
    detail: "1-tonne dual platform · clamping + V-groove · 90° tilt",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-20">
      <div>
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-faint">
          Avarabrands Asset Infrastructure
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink">
          Digital Asset Passports
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Underwriting-grade transaction dossiers for commercial real estate and heavy industrial
          equipment. One shared kit, one record per asset.
        </p>
      </div>

      <ul className="border border-rule-strong bg-surface">
        {PASSPORTS.map((p, i) => (
          <li key={p.href} className={i < PASSPORTS.length - 1 ? "border-b border-rule" : ""}>
            <Link href={p.href} className="block px-5 py-4 transition hover:bg-paper">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-forest">
                {p.kind}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">{p.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted">{p.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
