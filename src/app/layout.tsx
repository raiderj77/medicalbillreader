import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Bill",
  description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  keywords: "medical bill reader, understand medical bill, EOB explanation, medical billing codes, CPT codes, insurance EOB, billing errors",
  authors: [{ name: "Built by an experienced web professional" }],
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
    "google-adsense-account": "ca-pub-7171402107622932",
  },
  openGraph: {
    title: "Medical Bill Reader — Understand Your Bill",
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
  dateModified: "2026-04-07",
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
  dateModified: "2026-04-07",
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
  dateModified: "2026-04-07",
  author: {
    "@type": "Person",
    name: "Built by an experienced web professional",
    jobTitle: "Web Professional",
    url: "https://medicalbillreader.com/about",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const gpcHeader = headersList.get('sec-gpc') === '1';
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
        {!gpcHeader && (
          <Script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid="a9a99ccb-4863-4e33-a895-a6d5642f408d"
            data-blockingmode="auto"
            strategy="beforeInteractive"
          />
        )}
        {!gpcHeader && (
          <Script
            id="gpc-auto-decline"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
        (function() {
          try {
            var gpcActive = !!navigator.globalPrivacyControl || document.cookie.indexOf('empire_gpc=1') !== -1;
            if (!gpcActive) return;
            if (window.Cookiebot && window.Cookiebot.decline) {
              window.Cookiebot.decline();
            } else {
              window.addEventListener('CookiebotOnLoad', function() {
                if (window.Cookiebot) window.Cookiebot.decline();
              });
            }
          } catch(e) {}
        })();
      `,
            }}
          />
        )}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7171402107622932"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          id="consent-mode-v2"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
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
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "vsqobt7va0");
` }}
        />
        <Script
          id="ga4-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-3P9M4GWKE7"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-3P9M4GWKE7');
` }}
        />
      </body>
    </html>
  );
}
