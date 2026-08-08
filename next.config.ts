import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/medical-bill-payment-plans",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/medical-debt-collections-rights",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/medical-bill-after-insurance",
        destination: "/blog/how-to-read-an-explanation-of-benefits-eob",
        permanent: true,
      },
      {
        source: "/blog/how-to-read-medical-bill",
        destination: "/blog/how-to-read-an-explanation-of-benefits-eob",
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
