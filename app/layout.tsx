import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { ChartNoAxesColumn, Flag, Home, Map } from "lucide-react";
import "@/app/globals.css";
import { PwaRegister } from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Mini Golf Score",
  description: "A fast offline-first mini golf scoring PWA.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mini Golf Score",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#137a4b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        <main className="app-shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <strong>Mini Golf Score</strong>
              <span>Offline scorecards, courses, and rivalries</span>
            </Link>
            <Link className="button primary" href="/new">
              <Flag size={18} /> New Round
            </Link>
          </header>
          {children}
        </main>
        <nav className="nav" aria-label="Primary">
          <Link href="/">
            <Home size={19} />
            <span>Home</span>
          </Link>
          <Link href="/courses">
            <Map size={19} />
            <span>Courses</span>
          </Link>
          <Link href="/history">
            <ChartNoAxesColumn size={19} />
            <span>History</span>
          </Link>
          <Link href="/settings">
            <Flag size={19} />
            <span>Settings</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
