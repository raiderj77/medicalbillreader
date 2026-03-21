import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Bill",
  description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  keywords: "medical bill reader, understand medical bill, EOB explanation, medical billing codes, CPT codes, insurance EOB, billing errors",
  alternates: {
    canonical: "https://medicalbillreader.com",
  },
  robots: "index, follow, max-snippet:-1",
  other: {
    "msvalidate.01": "C4C9B6256BDEDED169E4DE01CA953390",
  },
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
        <script dangerouslySetInnerHTML={{ __html: `
  (function() {
    try {
      var s = localStorage.getItem('theme');
      var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var t = s || (m ? 'dark' : 'light');
      document.documentElement.classList.add(t);
    } catch(e) {}
  })();
` }} />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="a9a99ccb-4863-4e33-a895-a6d5642f408d"
          data-blockingmode="auto"
          strategy="beforeInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
