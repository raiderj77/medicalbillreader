import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Medical Bill Reader",
  description:
    "Compare the free monthly analysis, $4.99 single-bill analysis, and monthly Medical Bill Reader plan.",
  alternates: {
    canonical: "https://medicalbillreader.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
