import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Flame in Freefall | Microgravity Combustion Intelligence",
  description:
    "AI-powered dashboard for microgravity combustion data, fire-safety insights, and spacecraft flammability analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${manrope.variable} h-full antialiased`}>
      <body className="h-full text-slate-900 selection:bg-[#EA580C]/20 selection:text-[#7C2D12]">
        {children}
      </body>
    </html>
  );
}
