import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Medical Bill in Plain English",
  description: "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
