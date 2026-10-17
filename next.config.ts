import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.medicalbillreader.com",
          },
        ],
        destination: "https://medicalbillreader.com/:path*",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/guides",
        permanent: true,
      },
      {
        source: "/blog/how-to-read-an-explanation-of-benefits-eob",
        destination: "/guides/how-to-read-an-eob",
        permanent: true,
      },
      {
        source: "/blog/common-medical-billing-errors-and-how-to-spot-them",
        destination: "/guides/common-medical-bill-errors",
        permanent: true,
      },
      {
        source: "/blog/how-to-dispute-a-medical-bill",
        destination: "/guides/how-to-dispute-a-medical-bill",
        permanent: true,
      },
      {
        source: "/blog/medical-bill-payment-plans",
        destination: "/guides/how-to-negotiate-a-hospital-bill",
        permanent: true,
      },
      {
        source: "/blog/medical-debt-collections-rights",
        destination: "/guides/how-to-dispute-a-medical-bill",
        permanent: true,
      },
      {
        source: "/blog/medical-bill-statute-of-limitations",
        destination: "/guides/how-to-dispute-a-medical-bill",
        permanent: true,
      },
      {
        source: "/blog/medical-bill-after-insurance",
        destination: "/guides/how-to-read-an-eob",
        permanent: true,
      },
      {
        source: "/blog/health-insurance-deductible-explained",
        destination: "/guides/how-to-read-an-eob",
        permanent: true,
      },
      {
        source: "/blog/how-to-read-medical-bill",
        destination: "/guides/how-to-read-an-eob",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; media-src 'none'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
