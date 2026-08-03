import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Medical Bill Reader",
  description:
    "Compare one free analysis per browser per UTC month, a $4.99 single-bill analysis, and the monthly Medical Bill Reader plan.",
  alternates: {
    canonical: "https://medicalbillreader.com/pricing",
  },
  openGraph: {
    title: "Pricing | Medical Bill Reader",
    description:
      "Compare one free analysis per browser per UTC month, a $4.99 single-bill analysis, and the monthly Medical Bill Reader plan.",
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
