import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Footer from "@/components/Footer";
import PrivacyConsent from "@/components/PrivacyConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Medical Bill Reader ,  Understand Your Bill",
  description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  keywords: "medical bill reader, understand medical bill, EOB explanation, medical billing codes, CPT codes, insurance EOB, billing errors",
  authors: [{ name: "Jason Ramirez" }],
  alternates: {
    canonical: "https://medicalbillreader.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  },
  other: {
    "msvalidate.01": "C4C9B6256BDEDED169E4DE01CA953390",
    "google-site-verification": "mcxrvS-mdjf8xOfnWYi-tTavwcBPGWaDguoY1EjIidw",
  },
  openGraph: {
    title: "Medical Bill Reader ,  Understand Your Bill",
    description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
    url: "https://medicalbillreader.com",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Medical Bill Reader",
  url: "https://medicalbillreader.com",
  description:
    "AI-powered medical bill analysis tool that helps patients understand confusing medical bills and insurance EOBs in plain language.",
  dateModified: new Date().toISOString().substring(0,10),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@medicalbillreader.com",
    url: "https://medicalbillreader.com/contact",
  },
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Medical Bill Reader",
  url: "https://medicalbillreader.com",
  description:
    "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  dateModified: new Date().toISOString().substring(0,10),
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Medical Bill Reader",
  url: "https://medicalbillreader.com",
  description:
    "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  applicationCategory: "HealthApplication",
  operatingSystem: "All",
  dateModified: new Date().toISOString().substring(0,10),
  author: {
    "@type": "Person",
    name: "Jason Ramirez",
    jobTitle: "Founder of Your Friendly Developer",
    url: "https://medicalbillreader.com/about",
  },
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
    <html lang="en" className={inter.variable}>
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
          id="consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  });
` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded">
          Skip to main content
        </a>
        {children}
        <Footer />
        <PrivacyConsent />
      </body>
    </html>
  );
}
