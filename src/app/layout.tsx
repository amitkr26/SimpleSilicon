import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "SimpleSilicon — Free VLSI Learning",
    template: "%s | SimpleSilicon",
  },
  description:
    "SimpleSilicon — a free, independent VLSI and semiconductor engineering learning project: academy tracks, university video lectures, and career resources. No login required.",
  keywords: [
    "VLSI", "physical design", "STA", "synthesis", "Verilog", "semiconductor",
    "ASIC", "RTL design", "digital logic", "EDA", "OpenLane", "OpenROAD",
    "clock tree synthesis", "timing signoff", "DFT", "low power", "SimpleSilicon",
  ],
  authors: [{ name: "SimpleSilicon" }],
  creator: "SimpleSilicon",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SimpleSilicon",
    title: "SimpleSilicon — Free VLSI Learning",
    description:
      "Free, independent VLSI learning: academy tracks, university video lectures, and career resources. No login required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SimpleSilicon — Free VLSI Learning",
    description:
      "Free, independent VLSI learning: academy tracks, university video lectures, and career resources. No login required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "noarchive": true
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SimpleSilicon",
    "description": "Free, independent VLSI learning: academy tracks, university video lectures, and career resources.",
    "inLanguage": "en-IN",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body bg-slate-50 text-slate-900 min-h-screen antialiased`}
      >
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', border: '1px solid #374151', color: '#F9FAFB' } }} />
      </body>
    </html>
  );
}
