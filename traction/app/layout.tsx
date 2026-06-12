import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Traction | Tracking Every Action",
    template: "%s | Traction",
  },
  description: "Traction brings together performance analytics, one-to-one networking, and Atlas business discovery—helping members build stronger relationships.",
  keywords: ["Traction", "Analytics", "Business Discovery", "Networking", "KPIs", "Performance Tracking", "Professional Networking"],
  authors: [{ name: "Traction" }],
  creator: "Traction",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Traction | Tracking Every Action",
    description: "Traction brings together performance analytics, one-to-one networking, and Atlas business discovery—helping members build stronger relationships.",
    siteName: "Traction",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traction | Tracking Every Action",
    description: "Traction brings together performance analytics, one-to-one networking, and Atlas business discovery.",
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
