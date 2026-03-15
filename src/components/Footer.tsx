import Link from "next/link";

const sisterSites = [
  { name: "FiberTools", url: "https://fibertools.app" },
  { name: "MindCheck Tools", url: "https://mindchecktools.com" },
  { name: "FlipMyCase", url: "https://flipmycase.com" },
  { name: "Creator Revenue Calculator", url: "https://creatorrevenuecalculator.com" },
  { name: "ContractExtract", url: "https://contractextract.com" },
  { name: "524 Tracker", url: "https://524tracker.com" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 py-8 px-4 text-center text-xs text-slate-500">
      <p className="max-w-3xl mx-auto mb-4">
        This tool provides general explanations of medical billing codes and
        charges for informational purposes only. It is not financial or medical
        advice. Always consult a qualified healthcare provider regarding your
        medical bills or insurance questions.
      </p>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4">
        <Link href="/" className="hover:text-slate-700">
          Home
        </Link>
        <Link href="/about" className="hover:text-slate-700">
          About
        </Link>
        <Link href="/contact" className="hover:text-slate-700">
          Contact
        </Link>
        <Link href="/privacy" className="hover:text-slate-700">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-slate-700">
          Terms
        </Link>
      </div>

      <p className="mb-3 text-slate-400">Our Other Tools</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-4">
        {sisterSites.map((site) => (
          <a
            key={site.url}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700"
          >
            {site.name}
          </a>
        ))}
      </div>

      <p className="mt-4 text-slate-400">
        &copy; {new Date().getFullYear()} MedicalBillReader.com
      </p>
    </footer>
  );
}
