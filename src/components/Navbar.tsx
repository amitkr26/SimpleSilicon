"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircuitBoard, Menu, X, ArrowRight, Compass, Library, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Academy", href: "/academy", icon: Compass },
  { label: "Video Courses", href: "/learn/video-courses", icon: Library },
  { label: "Resources", href: "/resources", icon: Briefcase },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <CircuitBoard className="w-4.5 h-4.5 text-white stroke-[2]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            Simple<span className="text-blue-600">Silicon</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-slate-100 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/about"
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive("/about")
                ? "bg-slate-100 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            About
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/academy"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
          >
            Start Learning Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-1 max-h-[85vh] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50",
                isActive(item.href) && "bg-slate-100 text-blue-600"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className={cn(
              "block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50",
              isActive("/about") && "bg-slate-100 text-blue-600"
            )}
          >
            About SimpleSilicon
          </Link>
          <div className="pt-2">
            <Link
              href="/academy"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors text-sm w-full shadow-sm"
            >
              Start Learning Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}