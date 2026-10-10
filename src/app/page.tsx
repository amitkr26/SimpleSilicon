import Link from "next/link";
import { CircuitBoard, Compass, Library, Briefcase, ArrowRight, GraduationCap } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SimpleSilicon — independent, free VLSI learning                    */
/*  Deliberately claim-free: counts are not advertised while           */
/*  curriculum sections are being independently redeveloped.           */
/* ------------------------------------------------------------------ */

const SURFACES = [
  {
    title: "VLSI Academy",
    description:
      "Self-paced tracks with embedded university lecture videos and progress tracking. Start with digital logic or Verilog and work up to physical design.",
    href: "/academy",
    cta: "Explore the Academy",
    icon: Compass,
  },
  {
    title: "Free Video Course Library",
    description:
      "Curated NPTEL university courses and full YouTube playlists — every one free and public. Filter by topic or search by title.",
    href: "/learn/video-courses",
    cta: "Browse 70+ Courses",
    icon: Library,
  },
  {
    title: "Career Resources",
    description:
      "Semiconductor engineering role profiles, EDA toolchains, and what each discipline actually does on a day-to-day tapeout team.",
    href: "/resources",
    cta: "View Resources",
    icon: Briefcase,
  },
  {
    title: "About SimpleSilicon",
    description:
      "Why this project exists: structured, hands-on semiconductor education without paywalls, premium tiers, or login requirements.",
    href: "/about",
    cta: "Read the Mission",
    icon: GraduationCap,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-blue-400">
              <CircuitBoard className="w-4 h-4" /> Independent · Free · Open
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Simple<span className="text-blue-400">Silicon</span> — free VLSI
              learning from RTL to GDSII
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              A free, independent learning project for semiconductor engineering:
              academy-style tracks, university-grade video lectures, and career
              resources. No paywalls, no premium tiers, no login required.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Start Learning Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/learn/video-courses"
                className="inline-flex items-center gap-2 border border-slate-600 hover:border-slate-400 text-slate-200 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Library className="w-4 h-4" /> Video Course Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SURFACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SURFACES.map((surface) => {
            const Icon = surface.icon;
            return (
              <Link
                key={surface.href}
                href={surface.href}
                className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {surface.title}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{surface.description}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                  {surface.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FORTHCOMING NOTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-2">
          <h3 className="font-display text-sm font-bold text-slate-900">What&apos;s being reworked</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Structured learning-path and interview-bank sections are being independently
            redeveloped and are temporarily not being served. The Academy, video course
            library, and career resources above remain fully live.
          </p>
        </div>
      </section>
    </div>
  );
}