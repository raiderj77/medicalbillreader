import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-8 px-4 text-center text-xs text-slate-700 dark:text-slate-300">
      <p className="max-w-3xl mx-auto mb-4">
        This tool provides general explanations of medical billing codes and
        charges for informational purposes only. It is not financial or medical
        advice. Verify important details with the provider&apos;s billing office and
        your insurer; consult a qualified billing advocate, attorney, or other
        professional when your situation requires one.
      </p>

      <div className="mb-4 flex flex-wrap justify-center gap-x-3 gap-y-1 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:px-1">
        <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
          Home
        </Link>
        <Link href="/pricing" className="hover:text-slate-700 dark:hover:text-slate-300">
          Pricing
        </Link>
        <Link href="/about" className="hover:text-slate-700 dark:hover:text-slate-300">
          About
        </Link>
        <Link href="/contact" className="hover:text-slate-700 dark:hover:text-slate-300">
          Contact
        </Link>
        <Link href="/blog" className="hover:text-slate-700 dark:hover:text-slate-300">
          Blog
        </Link>
        <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
          Privacy
        </Link>
        <Link href="/consumer-health-data-privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
          Consumer Health Data Privacy
        </Link>
        <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">
          Terms
        </Link>
        <Link href="/cookies" className="hover:text-slate-700 dark:hover:text-slate-300">
          Cookies
        </Link>
        <Link href="/accessibility" className="hover:text-slate-700 dark:hover:text-slate-300">
          Accessibility
        </Link>
        <Link href="/disclaimer" className="hover:text-slate-700 dark:hover:text-slate-300">
          Disclaimer
        </Link>
        <Link href="/editorial-policy" className="hover:text-slate-700 dark:hover:text-slate-300">
          Editorial Policy
        </Link>
      </div>

      <div className="mb-4">
        <Link
          href="/do-not-sell"
          className="inline-flex min-h-11 items-center px-1 text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 font-medium underline"
        >
          Do Not Sell or Share My Personal Information
        </Link>
      </div>

      <p className="mt-4 text-slate-600 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Medical Bill Reader. All rights reserved.
      </p>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        Built by{" "}
        <Link href="/about" className="inline-flex min-h-11 items-center underline hover:text-slate-700 dark:hover:text-slate-300">
          Jason Ramirez
        </Link>
      </p>
    </footer>
  );
}
