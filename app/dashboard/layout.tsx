import type { Metadata } from "next";
import "../globals.css";
import  Header  from "../components/Dashboard/Header";
import { Sidebar } from "../components/Dashboard/Sidebar";
export const metadata: Metadata = {
  title: "DentFlow - Streamlining Dental Practice Management",
  description:
    "DentFlow is a comprehensive dental practice management software designed to streamline operations, enhance patient care, and boost productivity. With features like appointment scheduling, patient records management, billing and invoicing, and analytics, DentFlow empowers dental professionals to focus on what matters most - providing exceptional care to their patients.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="grid-layout-dashboard" suppressHydrationWarning>
        <Sidebar /> 
        <Header /> 
        <main className="[grid-area:content] overflow-auto">{children}</main>
      </body>
    </html>
  );
}
