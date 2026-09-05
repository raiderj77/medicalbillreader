import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Medical Bill Reader",
  description:
    "Use one free analysis per browser per UTC month. New paid checkout is temporarily unavailable; existing subscribers can still manage their account.",
  alternates: {
    canonical: "https://medicalbillreader.com/pricing",
  },
  openGraph: {
    title: "Pricing | Medical Bill Reader",
    description:
      "Use one free analysis per browser per UTC month. New paid checkout is temporarily unavailable; existing subscribers can still manage their account.",
    url: "https://medicalbillreader.com/pricing",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
