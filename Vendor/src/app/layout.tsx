import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "OGDCL · Vendor Medicine Bill",
  description:
    "Secure vendor billing portal for OGDCL — confirm medicine availability and submit reconciled bills for organization payment.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#edf3f5] text-[#102a36] antialiased">{children}</body>
    </html>
  );
}
