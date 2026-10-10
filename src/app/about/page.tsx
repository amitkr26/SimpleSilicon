import React from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "About SimpleSilicon — Free VLSI Engineering Education",
  description:
    "Learn about SimpleSilicon: our mission to provide structured, free, and un-gated semiconductor engineering education from RTL to GDSII.",
};

const PILLARS = [
  {
    icon: <BookOpen className="w-5 h-5 text-blue-600" />,
    title: "VLSI Academy",
    desc: "Self-paced learning tracks with embedded university video lectures and progress tracking — from digital logic and Verilog to physical design.",
    href: "/academy",
    cta: "Explore the Academy",
  },
  {
    icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
    title: "Free Video Course Library",
    desc: "Curated NPTEL university courses and full YouTube playlists covering digital design, verification, DFT, low power, and fabrication.",
    href: "/learn/video-courses",
    cta: "Browse Video Courses",
  },
  {
    icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
    title: "Career Resources",
    desc: "Semiconductor engineering role profiles and EDA toolchains explained — what each discipline actually does on a tapeout team.",
    href: "/resources",
    cta: "View Resources",
  },
];

const VALUES = [
  {
    title: "100% Free & Open Access",
    desc: "Semiconductor education should not be locked behind $3,000 corporate bootcamps or artificial paywalls. Everything on SimpleSilicon is completely free and accessible without mandatory login.",
  },
  {
    title: "Rooted in Silicon Reality",
    desc: "We prioritize actual EDA tool commands (TCL, SDC), signoff tolerances, and real manufacturing physics over generic textbook trivia. Everything is designed to reflect what physical design and verification engineers do on the job.",
  },
  {
    title: "Honest & Zero-Fluff",
    desc: "No fake user metrics, no fabricated testimonials, no marketing hype. We let the clarity of our curriculum and the rigor of our engineering explanations speak for itself.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium">About</span>
        </nav>

        {/* HERO */}
        <header className="border-b border-slate-200 pb-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone="accent">About SimpleSilicon</Badge>
            <Badge tone="neutral">Built by Engineers</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Free VLSI Learning for Semiconductor Engineers
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            A structured, open-access semiconductor curriculum designed to take engineers from digital logic fundamentals to production-grade physical design and timing signoff.
          </p>
        </header>

        {/* CORE PILLARS */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">What SimpleSilicon Provides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PILLARS.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {item.cta} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION & ORIGIN */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" /> The Motivation
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Entering the semiconductor industry has historically presented a steep barrier to entry. Commercial EDA tool suites cost tens of thousands of dollars per license, university VLSI curricula often rely on outdated slides, and private commercial training institutes charge exorbitant fees for basic labs.
            </p>
            <p>
              With the advent of open-source silicon initiatives — like the <strong>SkyWater 130nm PDK</strong>, <strong>OpenROAD</strong>, <strong>Yosys</strong>, and <strong>Magic</strong> — anyone with a computer can now learn how chips are synthesized, placed, routed, and physically verified.
            </p>
            <p>
              SimpleSilicon was created to bridge the gap between academic theory and day-to-day tapeout reality: providing structured curriculums, real EDA log analysis, and rigorous interview questions completely free.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Our Commitments</h2>
          <div className="space-y-3">
            {VALUES.map((val) => (
              <div key={val.title} className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{val.title}</span>
                </div>
                <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT & GET IN TOUCH */}
        <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Open Community & Feedback</span>
              <h3 className="text-xl font-bold text-white">Questions, Suggestions, or Contributions?</h3>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                SimpleSilicon is continuously updated with structured VLSI learning
                content. We welcome technical feedback from semiconductor engineers worldwide.
              </p>
              <div className="pt-2">
                <a
                  href="https://github.com/amitkr26/SimpleSilicon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  Contribute on GitHub <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button href="/academy" variant="primary" size="md">
                Start Learning Free <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
