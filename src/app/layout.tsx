import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flight-risk-store-v1.netlify.app"),
  title: {
    default: "FLIGHT RISK | Premium FPV Drone Store & Configurator",
    template: "%s | FLIGHT RISK"
  },
  description: " The ultimate source for high-performance FPV drone parts, brushless whoop components, and custom build tutorials. Outperform the competition with expert-curated gear.",
  keywords: ["FPV Drone", "Tiny Whoop", "Brushless Whoop", "Drone Parts", "Flight Controller", "FPV Motors", "BetaFPV Alternative", "GetFPV Alternative", "Drone Configurator"],
  authors: [{ name: "Flight Risk Systems" }],
  creator: "Flight Risk Systems",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flight-risk-store-v1.netlify.app",
    title: "FLIGHT RISK | Premium FPV Drone Ecosystem",
    description: "Precision engineering for micro FPV pilots. Shop expert-curated parts and configure your dream build.",
    siteName: "Flight Risk",
    images: [
      {
        url: "/images/og-share.png", // We'll need to ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: "Flight Risk FPV Store"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FLIGHT RISK | FPV Drone Architect",
    description: "Build your legacy. High-performance parts for the modern pilot.",
    creator: "@flightriskfpv"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6468295788849077"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Flight Risk",
              "url": "https://flight-risk-store-v1.netlify.app",
              "logo": "https://flight-risk-store-v1.netlify.app/images/logo.png",
              "sameAs": [
                "https://twitter.com/flightriskfpv",
                "https://instagram.com/flightriskfpv"
              ],
              "description": "Premium retailer for FPV drone components and specialized micro-quad parts."
            })
          }}
        />
      </body>
    </html>
  );
}
