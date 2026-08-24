import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Medical Bill Reader",
  description:
    "Compare one free analysis per browser per UTC month with a $4.99 single-bill analysis. New monthly subscriptions are unavailable.",
  alternates: {
    canonical: "https://medicalbillreader.com/pricing",
  },
  openGraph: {
    title: "Pricing | Medical Bill Reader",
    description:
      "Compare one free analysis per browser per UTC month with a $4.99 single-bill analysis. New monthly subscriptions are unavailable.",
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
