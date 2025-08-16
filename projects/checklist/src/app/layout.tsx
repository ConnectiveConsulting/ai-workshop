import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Checklist Manager - Stay Organized",
  description: "A simple and powerful checklist application to help you stay organized and boost productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="w-full flex justify-center gap-8 py-4 border-b mb-8">
          <Link href="/" className="hover:underline font-semibold">Home</Link>
          <Link href="/checklist" className="hover:underline font-semibold">Checklist</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
