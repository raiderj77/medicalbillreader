import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Medical Bill Reader",
  description:
    "Privacy policy for MedicalBillReader.com. Learn how we handle your data, medical bills, and personal information.",
  keywords: "privacy policy, medical bill reader, data privacy, CCPA, GDPR, health data",
  robots: "index, follow, max-snippet:-1",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">
          Last Updated: March 11, 2026
        </p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-[15px] leading-relaxed">
          {/* Data Controller */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">1. Who We Are</h2>
            <p>
              MedicalBillReader.com (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) is operated by an experienced web professional. We provide an AI-powered tool that helps consumers understand their medical bills. This Privacy Policy describes how we collect, use, and protect your information when you use our website and services.
            </p>
            <p>
              For privacy-related inquiries, contact us at: <strong>privacy@medicalbillreader.com</strong>
            </p>
          </section>

          {/* Categories of Data Collected */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">2. Categories of Personal Data We Collect</h2>
            <p>We collect the following categories of personal data:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Uploaded Medical Bills</strong> — Images or PDFs you upload for analysis. These may contain sensitive personal and health information including patient names, dates of service, diagnoses, procedure codes (CPT, ICD-10, HCPCS), and billing amounts.</li>
              <li><strong>Device &amp; Browser Information</strong> — IP address, browser type, operating system, and device identifiers collected automatically via server logs and analytics.</li>
              <li><strong>Usage Data</strong> — Pages visited, features used, timestamps, and interaction patterns.</li>
              <li><strong>Cookies &amp; Tracking Technologies</strong> — Data collected via cookies for analytics and advertising purposes (on marketing pages only).</li>
            </ul>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">3. How We Use Your Data</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>To analyze your uploaded medical bills and provide plain-English explanations.</li>
              <li>To operate, maintain, and improve our website and services.</li>
              <li>To display relevant advertisements on marketing pages (not on analysis pages).</li>
              <li>To comply with legal obligations.</li>
            </ul>
            <p>
              <strong>Lawful Basis (GDPR):</strong> We process data based on (a) your consent when you upload a medical bill, (b) our legitimate interest in operating and improving the service, and (c) legal compliance obligations.
            </p>
          </section>

          {/* Medical Bill Data — Critical Section */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">4. Medical Bill Data — How We Handle Your Health Information</h2>
            <p>
              We treat all uploaded medical bills with the highest level of sensitivity. Medical bills may contain protected health information and are handled with HIPAA-adjacent care, even though MedicalBillReader.com is not a HIPAA-covered entity.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Immediate Deletion:</strong> Uploaded medical bills are deleted immediately after analysis is complete. We do not retain your bill images or PDFs on our servers.</li>
              <li><strong>No Logging of Bill Contents:</strong> The text, codes, charges, and other contents of your medical bills are never logged, stored in databases, or written to server logs.</li>
              <li><strong>Anthropic API Disclosure:</strong> To analyze your bill, the uploaded image or PDF text is sent to Anthropic&apos;s Claude API for AI-powered processing. Anthropic processes this data according to their <a href="https://www.anthropic.com/privacy" className="text-teal-600 hover:text-teal-800 underline" target="_blank" rel="noopener noreferrer">privacy policy</a>. Anthropic does not use API inputs to train their models.</li>
              <li><strong>No Advertising Use:</strong> Your medical bill data, health information, and analysis results are never shared with advertising systems, ad networks, or used for ad targeting.</li>
              <li><strong>Browser-Session Only:</strong> Your bill preview and analysis results exist only in your browser session and are cleared when you close or refresh the page.</li>
            </ul>
            <p>
              During the upload experience, we display a visible privacy notice informing you that your bill will be processed by AI and deleted immediately after analysis.
            </p>
            <p>
              <strong>Important:</strong> Analysis results are estimates for informational purposes only. They do not constitute medical advice, financial advice, or a professional billing review.
            </p>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">5. Third Parties We Share Data With</h2>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Anthropic (Claude API)</strong> — Uploaded bill images/text are sent to Anthropic for AI-powered analysis. Anthropic processes data under their API terms and does not use API inputs for model training.</li>
              <li><strong>Google AdSense</strong> — On marketing pages only, Google may collect cookies and device information for ad serving. Medical bill data is never shared with Google.</li>
              <li><strong>Google Analytics</strong> — We use Google Analytics to understand website usage patterns. Analytics data does not include medical bill contents.</li>
              <li><strong>Vercel</strong> — Our hosting provider processes server requests. No medical bill data is persisted by Vercel beyond standard request processing.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">6. Data Retention Periods</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Uploaded Medical Bills:</strong> Deleted immediately after analysis — zero retention.</li>
              <li><strong>Analysis Results:</strong> Exist only in your browser session — not stored on our servers.</li>
              <li><strong>Server Logs:</strong> Retained for up to 30 days for security and debugging, then automatically deleted. Logs do not contain medical bill contents.</li>
              <li><strong>Analytics Data:</strong> Retained per Google Analytics default settings (up to 14 months).</li>
              <li><strong>Cookie Data:</strong> Varies by cookie type; advertising cookies expire per Google&apos;s cookie policies.</li>
            </ul>
          </section>

          {/* CCPA / Consumer Rights */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">7. Your Privacy Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">California Residents (CCPA/CPRA)</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Right to Know:</strong> Request what personal data we have collected about you.</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal data.</li>
              <li><strong>Right to Correct:</strong> Request correction of inaccurate personal data.</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of your personal information.</li>
              <li><strong>Right to Limit Sensitive Data Use:</strong> Limit how we use sensitive personal information, including health data.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">EU/EEA/UK Residents (GDPR)</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Right of access, rectification, erasure, restriction, portability, and objection.</li>
              <li>Right to withdraw consent at any time.</li>
              <li>Right to lodge a complaint with your supervisory authority.</li>
            </ul>

            <p className="mt-4">
              To exercise any of these rights, contact us at <strong>privacy@medicalbillreader.com</strong>. We will respond within 45 days (CCPA) or 30 days (GDPR).
            </p>
          </section>

          {/* Do Not Sell or Share */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">8. Do Not Sell or Share My Personal Information</h2>
            <p>
              We do not sell your personal information. Under the CCPA, certain advertising-related data sharing (such as cookies used by Google AdSense) may be considered &quot;sharing&quot; of personal information.
            </p>
            <p>
              You may opt out of this sharing by:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Adjusting your cookie preferences via our consent banner.</li>
              <li>Enabling Global Privacy Control (GPC) in your browser — we honor GPC signals as a valid opt-out request.</li>
              <li>Contacting us at <strong>privacy@medicalbillreader.com</strong>.</li>
            </ul>
            <p>
              <strong>Medical bill data is never sold, shared, or used for advertising under any circumstances.</strong>
            </p>
          </section>

          {/* GPC */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">9. Global Privacy Control (GPC)</h2>
            <p>
              We honor Global Privacy Control (GPC) signals sent by your browser. When we detect a GPC signal, we treat it as a valid opt-out of the sale or sharing of your personal information under applicable state privacy laws, including the CCPA.
            </p>
          </section>

          {/* Sensitive Data — CCPA Jan 2026 */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">10. Sensitive Personal Information (CCPA January 2026 Categories)</h2>
            <p>
              Under the CCPA as amended effective January 2026, certain categories of data receive heightened protections. We address each applicable category:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Mental and Physical Health Information:</strong> Medical bills may contain health-related data (diagnoses, procedure codes). This data is processed solely for bill analysis, deleted immediately after processing, and never used for profiling, advertising, or secondary purposes.</li>
              <li><strong>Biometric Data:</strong> We do not collect biometric data.</li>
              <li><strong>Genetic Data:</strong> We do not collect genetic data.</li>
              <li><strong>Precise Geolocation:</strong> We do not collect precise geolocation data. Approximate location may be inferred from IP address for analytics only.</li>
              <li><strong>Citizenship and Immigration Status:</strong> We do not collect citizenship or immigration status data.</li>
            </ul>
            <p>
              You have the right to limit our use of sensitive personal information to what is strictly necessary to provide the service you requested.
            </p>
          </section>

          {/* GDPR Article 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">11. Special Category Health Data (GDPR Article 9)</h2>
            <p>
              Under GDPR Article 9, medical and health-related data constitutes &quot;special category&quot; personal data requiring explicit consent and additional safeguards. When you upload a medical bill:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>We process health data solely based on your explicit consent given at the time of upload.</li>
              <li>Processing is limited to the specific purpose of bill analysis.</li>
              <li>Data is deleted immediately after processing — no retention.</li>
              <li>We implement appropriate technical and organizational safeguards.</li>
            </ul>
          </section>

          {/* State Health Privacy Laws */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">12. State Health Privacy Laws</h2>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Washington My Health My Data Act (MHMDA)</h3>
            <p>
              For Washington state residents: We comply with the My Health My Data Act. We do not collect, share, or sell consumer health data except as necessary to provide our bill analysis service. Health data is deleted immediately after processing. You have the right to withdraw consent and request deletion of any health data at any time.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Maryland Online Data Privacy Act (MODPA)</h3>
            <p>
              For Maryland residents: Effective October 2025, the Maryland MODPA prohibits the sale of health data. We do not sell health data under any circumstances. Medical bill data is processed solely for the purpose of providing analysis and is never sold, licensed, or otherwise transferred for monetary consideration.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">HIPAA-Adjacent Sensitivity</h3>
            <p>
              While MedicalBillReader.com is not a HIPAA-covered entity or business associate, we recognize that medical bills contain the same types of sensitive health information protected under HIPAA. We voluntarily adopt HIPAA-adjacent security and privacy practices, including immediate data deletion, no logging of health data, and access controls on data processing systems.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">13. Cookies &amp; Tracking</h2>
            <p>
              We use cookies on marketing pages for analytics and advertising. We do not use advertising cookies or trackers on bill analysis pages. For EU/EEA/UK visitors, we obtain consent before setting non-essential cookies.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">14. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we will promptly delete it.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">15. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Material changes will be posted on this page with an updated &quot;Last Updated&quot; date. Your continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">16. Contact Us</h2>
            <p>
              For privacy inquiries, data requests, or questions about this policy:
            </p>
            <p>
              <strong>Email:</strong> privacy@medicalbillreader.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-400 border-t border-slate-200 pt-8 mt-12">
          <p>&copy; {new Date().getFullYear()} MedicalBillReader.com &middot; For informational purposes only &middot; Not medical or legal advice</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="text-slate-400 hover:text-slate-600">Home</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-slate-600">Privacy</Link>
            <Link href="/terms" className="text-slate-400 hover:text-slate-600">Terms</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
