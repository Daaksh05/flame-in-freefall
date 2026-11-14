import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

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
      <body className="h-full flex overflow-hidden bg-[#f5f3ef] text-slate-900 selection:bg-[#1f6f68]/20 selection:text-[#113d3a]">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#f5f3ef]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
