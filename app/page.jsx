import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Avarabrands Asset Infrastructure
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Digital Asset Passports
      </h1>
      <p className="text-sm leading-relaxed text-slate-400">
        Underwriting-grade transaction dashboards for commercial real estate and heavy industrial
        equipment.
      </p>
      <Link
        href="/assets/lyric-tower"
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        View sample passport — Lyric Tower, Houston
      </Link>
    </main>
  );
}
