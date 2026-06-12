import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components/atlas-auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Atlas",
    default: "Atlas - Discover Local Professionals",
  },
  description: "Connect with local professionals, discover businesses, and grow your network with Atlas.",
  keywords: ["networking", "local businesses", "professionals", "bni", "atlas", "connect"],
  authors: [{ name: "Atlas" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Atlas",
    title: "Atlas - Discover Local Professionals",
    description: "Connect with local professionals, discover businesses, and grow your network with Atlas.",
  },
};

export default function AtlasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} h-full antialiased min-h-full flex flex-col`}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </div>
  );
}
