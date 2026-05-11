import type { Metadata } from "next";
import { Syne, Manrope, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Jawad Al Amien | Creative Developer",
  description: "Premium portfolio of Jawad Al Amien — Creative Developer & UI/UX Designer specializing in immersive web experiences, motion design, and scalable front-end engineering.",
  keywords: ["Creative Developer", "UI/UX Designer", "Next.js", "Motion Design", "Portfolio", "Indonesia"],
  openGraph: {
    title: "Jawad Al Amien | Creative Developer",
    description: "Immersive digital experiences that push the boundaries of the modern web.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${syne.variable} ${manrope.variable} ${bebasNeue.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
