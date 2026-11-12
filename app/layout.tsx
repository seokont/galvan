import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./catalog.css";
import CustomCursor from "./custom-cursor";
import { Suspense } from "react";
import PageLoader from "./page-loader";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const editorial = localFont({ src: './fonts/italiana/italiana.ttf', variable: '--font-editorial', weight: '400', display: 'swap' });

export const metadata: Metadata = {
  title: "Atelier | Bridal Collections & Wedding Dresses",
  description: "Explore Atelier's curated bridal collections from Galvan Sposa Group. Discover Italian design, elegant wedding dresses and a style that feels entirely like you.",
  applicationName: "Atelier",
  openGraph: {
    type: "website",
    siteName: "Atelier",
    locale: "en_US",
    title: "Atelier | Bridal Collections & Wedding Dresses",
    description: "Discover elegant wedding dresses and Italian bridal design from Galvan Sposa Group at Atelier.",
  },
  twitter: {
    card: "summary",
    title: "Atelier | Bridal Collections & Wedding Dresses",
    description: "Discover elegant wedding dresses and Italian bridal design from Galvan Sposa Group at Atelier.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${editorial.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><Suspense fallback={null}><PageLoader /></Suspense>{children}<Suspense fallback={null}><CustomCursor /></Suspense></body>
    </html>
  );
}
