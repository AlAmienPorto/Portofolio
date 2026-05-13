import type { Metadata } from "next";
import { Syne, Manrope, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Jawad Al Amien | Creative Developer & UI/UX Designer",
  description: "Premium portfolio of Jawad Al Amien — Creative Developer & UI/UX Designer specializing in immersive web experiences, motion design, and scalable front-end engineering.",
  keywords: ["Jawad Al Amien", "Creative Developer", "UI/UX Designer", "Next.js", "React", "Motion Design", "Framer Motion", "Portfolio", "Indonesia", "Graphic Design"],
  authors: [{ name: "Jawad Al Amien" }],
  creator: "Jawad Al Amien",
  openGraph: {
    title: "Jawad Al Amien | Creative Developer",
    description: "Immersive digital experiences that push the boundaries of the modern web.",
    url: "https://jawadalamien.com",
    siteName: "Jawad Al Amien Portfolio",
    images: [
      {
        url: "/uploads/profile.png",
        width: 1200,
        height: 630,
        alt: "Jawad Al Amien - Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jawad Al Amien | Creative Developer",
    description: "Immersive digital experiences that push the boundaries of the modern web.",
    images: ["/uploads/profile.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        <Analytics />
      </body>
    </html>
  );
}
