import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Medical Bill in Plain English",
  description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Medical Bill Reader",
  url: "https://medicalbillreader.com",
  description:
    "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
