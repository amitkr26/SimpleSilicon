import Link from "next/link";
import { CircuitBoard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <CircuitBoard className="w-4 h-4 text-white stroke-[2]" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-slate-900">
                Simple<span className="text-blue-600">Silicon</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              A free, independent VLSI &amp; semiconductor engineering learning project.
              From RTL to GDSII — no paywalls, no login required.
            </p>
          </div>

          {/* Column 1: Learn */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Learn
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/academy" className="text-slate-500 hover:text-slate-900 transition-colors">
                  VLSI Academy
                </Link>
              </li>
              <li>
                <Link href="/learn/video-courses" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Video Course Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/resources" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-500 hover:text-slate-900 transition-colors">
                  About SimpleSilicon
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} SimpleSilicon. 100% free and open for semiconductor engineers.
          </p>
        </div>
      </div>
    </footer>
  );
}