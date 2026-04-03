import type { Metadata } from "next";

import "./globals.css";
import { Quantico, Play } from "next/font/google"

const quantico = Quantico({
  subsets: ["latin"],
  variable: "--font-quantico",
  weight: ["400", "700"]
})

const play = Play({
  subsets: ["latin"],
  variable: "--font-play",
  weight: ["400", "700"]
})

export const metadata: Metadata = {
  title: "Code analyzer - Analyze your GitHub codebase with AI",
  description: "Analyze your GitHub codebase with AI - Get insights, identify issues, and improve your code quality effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quantico.variable} ${play.variable}`}>
      <body>{children}</body>
    </html>
  );
}
