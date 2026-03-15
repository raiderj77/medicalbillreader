import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Medical Bill Reader",
  description:
    "Learn how Medical Bill Reader helps patients understand confusing medical bills, insurance EOBs, and healthcare charges in plain language.",
  keywords:
    "about medical bill reader, understand medical bills, EOB explanation, medical billing help, CPT codes, deductible, coinsurance",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          About Medical Bill Reader
        </h1>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-[15px] leading-relaxed">
          {/* What It Does */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">
              What Medical Bill Reader Does
            </h2>
            <p>
              Medical Bill Reader helps you understand confusing medical bills and
              insurance Explanations of Benefits (EOBs) in plain language — no medical
              degree required. Our free AI-powered tool reads your bill, breaks down
              every charge, flags potential billing errors, and suggests clear next
              steps so you know exactly what you owe and why.
            </p>
            <p>
              Medical billing in the United States is notoriously complex. A single
              hospital visit can generate multiple bills from different providers, each
              filled with procedure codes, diagnostic codes, and insurance adjustments
              that are nearly impossible for the average person to decipher. Medical
              Bill Reader was built to change that. We believe every patient deserves
              to understand what they are being charged for and whether those charges
              are accurate.
            </p>
            <p>
              Our AI analyzes your bill line by line, translating cryptic codes and
              medical jargon into straightforward explanations. It identifies common
              billing mistakes like duplicate charges, upcoding, unbundling, and
              charges for services that may not have been provided. After the analysis,
              you receive a clear, organized summary with actionable advice on
              disputing errors, negotiating balances, or contacting your insurance
              company.
            </p>
          </section>

          {/* Who It Helps */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">
              Who Medical Bill Reader Helps
            </h2>
            <p>
              Medical Bill Reader is designed for anyone who has ever been confused by
              a medical bill. That includes patients who receive unexpected charges
              after a doctor visit or hospital stay, families trying to understand what
              their insurance actually covered, individuals reviewing an Explanation of
              Benefits from their insurer and struggling to match it against provider
              bills, uninsured or underinsured patients trying to verify whether their
              charges are fair, caregivers managing medical bills for aging parents or
              family members, and anyone who simply wants a second opinion on whether
              their medical bill is accurate before paying.
            </p>
            <p>
              Whether your bill is a simple office visit copay or a complex hospital
              stay with dozens of line items, Medical Bill Reader can help you make
              sense of it.
            </p>
          </section>

          {/* How to Use It */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">
              How to Use Medical Bill Reader
            </h2>
            <p>
              Using Medical Bill Reader is simple and takes less than a minute. First,
              take a photo of your medical bill or save it as a PDF. Next, visit our
              homepage and upload the image or PDF using the drag-and-drop area or the
              file picker. Then click &quot;Explain My Bill&quot; and wait about 30 seconds
              while our AI reads and analyzes every line. Finally, review your
              plain-English explanation, which includes a breakdown of each charge,
              flags for potential errors, and suggestions for next steps.
            </p>
            <p>
              No account is required. Your bill is processed privately and deleted
              immediately after analysis — it is never stored on our servers.
            </p>
          </section>

          {/* Common Medical Billing Terms */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">
              Common Medical Billing Terms Explained
            </h2>
            <p>
              Medical bills are full of specialized terminology. Here are some of the
              most common terms you will encounter and what they actually mean:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>CPT Codes (Current Procedural Terminology):</strong> Five-digit
                codes assigned to every medical procedure or service performed. For
                example, CPT code 99213 represents a standard office visit. These codes
                determine how much your provider bills for each service.
              </li>
              <li>
                <strong>EOB (Explanation of Benefits):</strong> A document your insurance
                company sends after processing a claim. It shows what the provider
                charged, what the insurance paid, and what you still owe. An EOB is not a
                bill — it is a summary of how your claim was handled.
              </li>
              <li>
                <strong>Deductible:</strong> The amount you must pay out of pocket each
                year before your insurance starts covering costs. For example, with a
                $1,500 deductible, you pay the first $1,500 of covered services yourself.
              </li>
              <li>
                <strong>Coinsurance:</strong> The percentage of costs you share with your
                insurance after meeting your deductible. If your plan has 20% coinsurance,
                you pay 20% of covered charges and your insurer pays 80%.
              </li>
              <li>
                <strong>Out-of-Pocket Maximum:</strong> The most you will pay in a
                calendar year for covered services. Once you reach this limit, your
                insurance covers 100% of remaining costs for the rest of the year. This
                amount includes your deductible, copays, and coinsurance.
              </li>
              <li>
                <strong>Copay:</strong> A fixed dollar amount you pay for a specific
                service, such as $30 for a doctor visit or $15 for a prescription. Copays
                are set by your insurance plan and do not vary by provider.
              </li>
              <li>
                <strong>Allowed Amount:</strong> The maximum amount your insurance plan
                will pay for a covered service. If your provider charges more than the
                allowed amount, you may be responsible for the difference (known as
                balance billing).
              </li>
            </ul>
          </section>

          {/* Why It Matters */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">
              Why Understanding Your Medical Bill Matters
            </h2>
            <p>
              Medical billing errors are far more common than most people realize.
              Studies have found that a significant percentage of medical bills contain
              errors, ranging from duplicate charges and incorrect codes to charges for
              services never rendered. These mistakes can cost patients hundreds or even
              thousands of dollars.
            </p>
            <p>
              Understanding your bill is the first step toward catching these errors.
              When you know what each charge means, you can verify that the services
              listed match what you actually received. You can compare your provider
              bill against your insurance EOB to make sure the numbers align. And you
              can make informed decisions about whether to dispute a charge, negotiate
              a payment plan, or apply for financial assistance.
            </p>
            <p>
              Medical debt is the leading cause of personal bankruptcy in the United
              States. By helping patients understand and verify their bills, Medical
              Bill Reader aims to reduce the financial burden of healthcare and
              empower people to take control of their medical expenses.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <p className="text-amber-900 font-semibold text-base mb-2">
                Important Disclaimer
              </p>
              <p className="text-amber-800 text-sm leading-relaxed">
                Medical Bill Reader is for informational purposes only. The analysis
                provided by this tool does not constitute medical advice, financial
                advice, legal advice, or a professional billing review. Always verify
                charges directly with your healthcare provider and insurance company
                before taking action. If you believe your bill contains errors, contact
                your provider&apos;s billing department or your insurance company&apos;s member
                services line for resolution.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-400 border-t border-slate-200 pt-8 mt-12">
          <p>
            &copy; {new Date().getFullYear()} MedicalBillReader.com &middot; For
            informational purposes only &middot; Not medical or legal advice
          </p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="text-slate-400 hover:text-slate-600">
              Home
            </Link>
            <Link href="/about" className="text-slate-400 hover:text-slate-600">
              About
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-slate-600">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-slate-600">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
