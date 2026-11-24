import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio PDF — Jawad Al Amien",
  description: "Print-ready PDF version of Jawad Al Amien's portfolio — Creative Developer & UI/UX Designer.",
  robots: { index: false },
};

export default function PDFLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
