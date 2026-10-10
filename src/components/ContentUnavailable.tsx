import Link from "next/link";
import { Compass, Library } from "lucide-react";

// Neutral "temporarily unavailable" notice for curriculum sections that are
// hidden pending independent redevelopment. Deliberately makes no claims and
// points only at live surfaces.
export default function ContentUnavailable({ label }: { label: string }) {
  return (
    <div className="min-h-[60vh] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {label} — temporarily unavailable
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
          This section is not being served while its content is independently
          revised. The rest of SimpleSilicon — the VLSI Academy and the free
          NPTEL &amp; YouTube course library — remains completely free and open.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Compass className="w-4 h-4" /> VLSI Academy
          </Link>
          <Link
            href="/learn/video-courses"
            className="inline-flex items-center gap-2 border border-slate-300 hover:border-blue-400 hover:text-blue-600 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Library className="w-4 h-4" /> Free Video Course Library
          </Link>
        </div>
      </div>
    </div>
  );
}