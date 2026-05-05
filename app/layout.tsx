import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/landing/header";
import { Footer } from "./components/landing/footer-section";

export const metadata: Metadata = {
  title: "DentFlow - Streamlining Dental Practice Management",
  description: "DentFlow is a comprehensive dental practice management software designed to streamline operations, enhance patient care, and boost productivity. With features like appointment scheduling, patient records management, billing and invoicing, and analytics, DentFlow empowers dental professionals to focus on what matters most - providing exceptional care to their patients.",
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
