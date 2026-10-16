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
              A free, independent VLSI & semiconductor engineering learning project.
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
                <Link href="/learn" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/learn/rtl-verilog" className="text-slate-500 hover:text-slate-900 transition-colors">
                  RTL Verilog
                </Link>
              </li>
              <li>
                <Link href="/learn/digital-logic" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Digital Logic
                </Link>
              </li>
              <li>
                <Link href="/learn/static-timing" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Static Timing Analysis
                </Link>
              </li>
              <li>
                <Link href="/learn/verification" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Design Verification
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
                <Link href="/sta-interview-questions" className="text-slate-500 hover:text-slate-900 transition-colors">
                  STA Interview Q&A
                </Link>
              </li>
              <li>
                <Link href="/engineering-lab" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Engineering Lab
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Courses & Guides
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
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/amitkr26/SimpleSilicon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              GitHub
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 7.11 5.387 8.418 1.017.607.819.858.819.858 5.012 0 6.522-3.438 6.522-7.492 0-2.153-.52-2.448-1.52-2.448-6.984 0-5.483-3.388-6.895-6.895-6.895-2.152 0-2.508.368-3.195 1.125.064-.065.082-.25.082-.5v-1.105c-2.817-.344-5.306-1.395-5.306-4.741 0-2.048.727-3.427 2.228-3.427 2.315 0 3.108 1.5 3.108 4.054 0 3.807-2.32 5.757-3.908 6.217-2.067.857-2.506 1.5-2.506 3.673 0 3.35 1.838 5.225 4.097 5.225 4.095 0 5.388-1.953 5.388-5.225 0-1.172-.193-2.085-.602-2.568-2.178 1.062-.628 1.162-1.588 1.162-2.568 0-1.333-.26-2.33-.82-3.153 1.886 1.212 3.263 1.886 5.283 1.886 6.354 0 6.668-2.58 6.668-6.658 0-1.533-.14-2.13-.53-2.636 2.525 1.527-1.528 2.608-3.888 2.608-6.617 0-2.86-.465-3.636-1.5-4.097-1.42-.967-3.16-1.188-3.958-1.188-4.612 0-5.388 3.31-5.388 5.388 0 2.057.415 3.508 1.14 4.393 2.02 1.785 3.183 3.113 3.183 5.054 0 3.124-1.272 4.13-3.51 4.13-5.385 0-3.027-1.26-3.68-3.067-3.68-2.155 0-3.415.778-3.415 2.284 0 1.372.337 2.15.88 2.53 1.945-1.532 3.09-2.12 3.09-3.887 0-3.812-2.05-3.812-5.317 0-4.102 2.153-5.082 4.888-5.082 4.655 0 5.557 2.532 5.557 5.082 0 2.295-1.517 3.655-3.23 3.655-5.162 0-4.217-2.318-4.655-4.378-4.655-2.155 0-3.093.578-3.86 1.275zM12 2.5c-1.396 0-2.5 1.104-2.5 2.5 0 1.396.63 2.49 1.492 3.218 1.506 1.224 2.624 2.398 2.624 3.946 0 2.305-1.177 3.163-2.39 3.395 1.803.518 3.517 1.198 3.517 3.078 0 3.475-1.729 3.976-3.415 3.976-2.316 0-3.317-1.672-3.317-4.054 0-2.605.608-3.546 1.237-3.75 1.195-.468 2.146-1.1 3.187-1.1 3.822 0 1.848.513 3.183 1.387 3.933 1.637 1.268 3.125 2.14 3.518 2.595 1.184.288 2.218.288 3.315 0 2.177-1.082 3.396-2.39 3.473-1.245.158-2.46.158-3.588 0-2.534 1.163-3.415 2.31-3.415 3.636 0 5.053 2.672 5.053 5.63 0 1.214-.32 2.183-.88 2.738-1.135.973-2.26.95-3.208.655-3.208-1.554 0-2.413-.5-3.19-1.442-1.427-1.766-1.627-3.285-3.028-3.285-4.677 0-5.13 3.218-5.13 7.156 0 5.14 3.232 5.14 7.312 0 2.413-.52 3.655-1.48 4.392-2.076 1.62-3.716 2.157-3.716 4.832 0 5.135 3.11 5.135 6.655 0 3.518-2.05 4.45-4.357 4.45-4.66 0-3.317-1.387-3.933-3.232-3.933-2.05 0-3.6 1.245-3.6 3.887 0 4.708 3.15 5.318 5.16 5.318 4.357 0 6.393-3.245 6.393-7.188 0-5.017-3.12-5.43-5.16-5.43-4.135 0-4.655 2.292-4.655 5.636 0 2.083.515 3.43 1.237 3.93 1.978 1.187 3.09 2.165 3.09 4.655 0 3.317 1.272 3.68 3.067 3.68 2.155 0 3.367-.78 3.367-2.284 0-3.68-1.937-3.68-4.393z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} SimpleSilicon. 100% free and open for semiconductor engineers.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/amitkr26/SimpleSilicon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              GitHub
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 7.11 5.387 8.418 1.017.607.819.858.819.858 5.012 0 6.522-3.438 6.522-7.492 0-2.153-.52-2.448-1.52-2.448-6.984 0-5.483-3.388-6.895-6.895-6.895-2.152 0-2.508.368-3.195 1.125.064-.065.082-.25.082-.5v-1.105c-2.817-.344-5.306-1.395-5.306-4.741 0-2.048.727-3.427 2.228-3.427 2.315 0 3.108 1.5 3.108 4.054 0 3.807-2.32 5.757-3.908 6.217-2.067.857-2.506 1.5-2.506 3.673 0 3.35 1.838 5.225 4.097 5.225 4.095 0 5.388-1.953 5.388-5.225 0-1.172-.193-2.085-.602-2.568-2.178 1.062-.628 1.162-1.588 1.162-2.568 0-1.333-.26-2.33-.82-3.153 1.886 1.212 3.263 1.886 5.283 1.886 6.354 0 6.668-2.58 6.668-6.658 0-1.533-.14-2.13-.53-2.636 2.525 1.527-1.528 2.608-3.888 2.608-6.617 0-2.86-.465-3.636-1.5-4.097-1.42-.967-3.16-1.188-3.958-1.188-4.612 0-5.388 3.31-5.388 5.388 0 2.057.415 3.508 1.14 4.393 2.02 1.785 3.183 3.113 3.183 5.054 0 3.124-1.272 4.13-3.51 4.13-5.385 0-3.027-1.26-3.68-3.067-3.68-2.155 0-3.415.778-3.415 2.284 0 1.372.337 2.15.88 2.53 1.945-1.532 3.09-2.12 3.09-3.887 0-3.812-2.05-3.812-5.317 0-4.102 2.153-5.082 4.888-5.082 4.655 0 5.557 2.532 5.557 5.082 0 2.295-1.517 3.655-3.23 3.655-5.162 0-4.217-2.318-4.655-4.378-4.655-2.155 0-3.093.578-3.86 1.275zM12 2.5c-1.396 0-2.5 1.104-2.5 2.5 0 1.396.63 2.49 1.492 3.218 1.506 1.224 2.624 2.398 2.624 3.946 0 2.305-1.177 3.163-2.39 3.395 1.803.518 3.517 1.198 3.517 3.078 0 3.475-1.729 3.976-3.415 3.976-2.316 0-3.317-1.672-3.317-4.054 0-2.605.608-3.546 1.237-3.75 1.195-.468 2.146-1.1 3.187-1.1 3.822 0 1.848.513 3.183 1.387 3.933 1.637 1.268 3.125 2.14 3.518 2.595 1.184.288 2.218.288 3.315 0 2.177-1.082 3.396-2.39 3.473-1.245.158-2.46.158-3.588 0-2.534 1.163-3.415 2.31-3.415 3.636 0 5.053 2.672 5.053 5.63 0 1.214-.32 2.183-.88 2.738-1.135.973-2.26.95-3.208.655-3.208-1.554 0-2.413-.5-3.19-1.442-1.427-1.766-1.627-3.285-3.028-3.285-4.677 0-5.13 3.218-5.13 7.156 0 5.14 3.232 5.14 7.312 0 2.413-.52 3.655-1.48 4.392-2.076 1.62-3.716 2.157-3.716 4.832 0 5.135 3.11 5.135 6.655 0 3.518-2.05 4.45-4.357 4.45-4.66 0-3.317-1.387-3.933-3.232-3.933-2.05 0-3.6 1.245-3.6 3.887 0 4.708 3.15 5.318 5.16 5.318 4.357 0 6.393-3.245 6.393-7.188 0-5.017-3.12-5.43-5.16-5.43-4.135 0-4.655 2.292-4.655 5.636 0 2.083.515 3.43 1.237 3.93 1.978 1.187 3.09 2.165 3.09 4.655 0 3.317 1.272 3.68 3.067 3.68 2.155 0 3.367-.78 3.367-2.284 0-3.68-1.937-3.68-4.393z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}