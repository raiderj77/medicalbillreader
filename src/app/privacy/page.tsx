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
      {/* Answer capsule — must be first visible text for GEO/AI scrapers */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        <p className="text-lg text-slate-700 leading-relaxed mb-0 bg-white border border-slate-200 rounded-lg p-5">
          MedicalBillReader.com is committed to protecting your privacy. This policy explains what information we collect when you use our AI-powered bill analysis tool, how we use it, and your rights under U.S. state and international privacy laws. We never store your uploaded medical bills — documents are deleted immediately after analysis and results exist only in your browser session.
        </p>
      </div>

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
          Effective Date: January 1, 2026 | Last Reviewed: March 2026
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

          {/* California Privacy Rights — CCPA/CPRA Jan 2026 + State Health Laws */}
          <section id="california-privacy" aria-labelledby="california-heading">
            <h2 id="california-heading" className="text-xl font-bold text-slate-800">7. California Privacy Rights (CCPA/CPRA)</h2>

            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) as amended
              by the California Privacy Rights Act (CPRA) grants you specific rights regarding your
              personal information. These rights are effective as of January 1, 2026.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Information We Collect</h3>
            <p>In the past 12 months we have collected the following categories of personal information:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Identifiers:</strong> IP address, email address (if account created), browser type, device identifiers.</li>
              <li><strong>Internet or network activity:</strong> Pages visited, tool usage patterns, time on site.</li>
              <li><strong>Health and medical information:</strong> Medical bill documents submitted for analysis. This data is processed server-side and deleted immediately after analysis is complete. It is never stored, logged beyond the active session, or shared.</li>
              <li><strong>Inferred data:</strong> Interests inferred from browsing behavior via advertising partners (marketing pages only — not analysis pages).</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Sensitive Personal Information — Medical Bill Data</h3>
            <p>
              As of January 1, 2026, California law defines health and medical information as sensitive
              personal information requiring heightened protections. Medical bills you upload contain
              sensitive health information including patient names, diagnosis codes (ICD-10), procedure
              codes (CPT/HCPCS), provider information, and financial data.
            </p>
            <p>
              <strong>Medical Bill Reader treats all uploaded bill data as sensitive personal
              information.</strong> Specifically:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Bill documents are processed in memory and deleted immediately after analysis is returned to you</li>
              <li>We do not store, log, index, or retain bill content after your session ends</li>
              <li>Bill content is never used for advertising targeting, never sold, and never shared with third parties</li>
              <li>Advertising is served via non-personalized ads on analysis pages to prevent any health data from reaching advertising systems</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Washington My Health My Data Act (WA MHMDA)</h3>
            <p>
              For Washington State residents, the My Health My Data Act provides additional protections
              for consumer health data. Medical bill information constitutes consumer health data under
              this law. We comply with WA MHMDA by: processing health data only to provide the
              requested service; not selling consumer health data; not sharing health data with
              third parties for advertising; and deleting health data immediately after processing.
              Washington residents have the right to access, delete, and withdraw consent for
              processing of their consumer health data by contacting us via the{' '}
              <Link href="/contact" className="text-teal-600 hover:text-teal-800 underline">Contact page</Link>.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Maryland Online Data Privacy Act (MD MODPA)</h3>
            <p>
              For Maryland residents, the Maryland Online Data Privacy Act (effective October 2025)
              prohibits the sale of sensitive data including health information. We do not sell
              medical bill data or any health-related information. Maryland residents have the right
              to access, delete, correct, and opt out of the processing of their personal data by
              contacting us via the <Link href="/contact" className="text-teal-600 hover:text-teal-800 underline">Contact page</Link>.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Data Minimization</h3>
            <p>
              We collect only the minimum personal information necessary to operate this service.
              Medical bill documents are processed in memory and deleted immediately after analysis.
              We do not retain document content beyond the active processing session.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">How We Use Your Information</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>To perform medical bill analysis using AI processing</li>
              <li>To display non-personalized advertising on marketing pages through Google AdSense</li>
              <li>To analyze aggregate site traffic via analytics (no health data included)</li>
              <li>To maintain site security and prevent fraud</li>
            </ul>
            <p>We do not sell your personal information. We do not use health or medical bill content for advertising targeting under any circumstances.</p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Your Rights as a California Resident</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Right to Know:</strong> Request disclosure of personal information collected in the past 12 months.</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information. Note: medical bill documents are deleted automatically upon processing completion.</li>
              <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information such as account details.</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of sharing personal information for advertising. We honor Global Privacy Control (GPC) signals automatically. We use non-personalized ads on analysis pages by default.</li>
              <li><strong>Right to Limit Use of Sensitive Information:</strong> You have the right to limit our use of your sensitive personal information (including health data) to only what is necessary to provide the service you requested.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of these rights.</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Do Not Sell or Share My Personal Information</h3>
            <p>
              We do not sell personal information or health data. To opt out of sharing for advertising
              purposes on non-analysis pages, use a{' '}
              <a href="https://globalprivacycontrol.org/" className="text-teal-600 hover:text-teal-800 underline" target="_blank" rel="noopener noreferrer">Global Privacy Control (GPC)</a>-enabled
              browser, or contact us via the <Link href="/contact" className="text-teal-600 hover:text-teal-800 underline">Contact page</Link>.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">How to Submit a Request</h3>
            <p>Contact us via the <Link href="/contact" className="text-teal-600 hover:text-teal-800 underline">Contact page</Link>. We will respond within 45 days. Identity verification may be required.</p>

            <h3 className="text-lg font-semibold text-slate-800 mt-4">Data Retention</h3>
            <p>Account data is retained until account deletion. Analytics data is retained for 26 months. Medical bill documents are deleted immediately after processing. Server logs (without health content) are retained for 90 days.</p>
          </section>

          {/* Additional U.S. State Privacy Rights */}
          <section id="state-privacy" aria-labelledby="state-heading">
            <h2 id="state-heading" className="text-xl font-bold text-slate-800">8. Additional U.S. State Privacy Rights</h2>
            <p>
              Residents of the following states have privacy rights similar to California&apos;s CCPA/CPRA.
              To exercise your rights, contact us via the <Link href="/contact" className="text-teal-600 hover:text-teal-800 underline">Contact page</Link>.
              We will respond within the timeframe required by your state&apos;s law.
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-800">State</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-800">Law</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-800">Effective</th>
                    <th className="text-left py-2 font-semibold text-slate-800">Key Rights</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Colorado</td><td className="py-2 pr-4">CPA</td><td className="py-2 pr-4">Jul 2023</td><td className="py-2">Access, delete, correct, opt-out, portability</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Connecticut</td><td className="py-2 pr-4">CTDPA</td><td className="py-2 pr-4">Jul 2023</td><td className="py-2">Access, delete, correct, opt-out, portability</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Virginia</td><td className="py-2 pr-4">VCDPA</td><td className="py-2 pr-4">Jan 2023</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Texas</td><td className="py-2 pr-4">TDPSA</td><td className="py-2 pr-4">Jul 2024</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Florida</td><td className="py-2 pr-4">FDBR</td><td className="py-2 pr-4">Jul 2024</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Montana</td><td className="py-2 pr-4">MTCPA</td><td className="py-2 pr-4">Oct 2024</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Oregon</td><td className="py-2 pr-4">OCPA</td><td className="py-2 pr-4">Jul 2024</td><td className="py-2">Access, delete, correct, opt-out, portability</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Tennessee</td><td className="py-2 pr-4">TIPA</td><td className="py-2 pr-4">Jul 2025</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Minnesota</td><td className="py-2 pr-4">MNDPA</td><td className="py-2 pr-4">Jul 2025</td><td className="py-2">Access, delete, correct, opt-out, portability</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Maryland</td><td className="py-2 pr-4">MODPA</td><td className="py-2 pr-4">Oct 2025</td><td className="py-2">Access, delete, correct, opt-out; bans sale of sensitive data</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Indiana</td><td className="py-2 pr-4">IDCPA</td><td className="py-2 pr-4">Jan 2026</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Kentucky</td><td className="py-2 pr-4">KYCPA</td><td className="py-2 pr-4">Jan 2026</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                  <tr className="border-b border-slate-200"><td className="py-2 pr-4">Rhode Island</td><td className="py-2 pr-4">RIDPA</td><td className="py-2 pr-4">Jan 2026</td><td className="py-2">Access, delete, correct, opt-out</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              We honor Global Privacy Control (GPC) signals from all states that require it.
              We do not sell personal information to third parties. We do not engage in targeted
              advertising using sensitive personal information.
            </p>
          </section>

          {/* GDPR Article 9 */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">9. Special Category Health Data (GDPR Article 9)</h2>
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

          {/* HIPAA-Adjacent Sensitivity */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">10. HIPAA-Adjacent Sensitivity</h2>
            <p>
              While MedicalBillReader.com is not a HIPAA-covered entity or business associate, we recognize that medical bills contain the same types of sensitive health information protected under HIPAA. We voluntarily adopt HIPAA-adjacent security and privacy practices, including immediate data deletion, no logging of health data, and access controls on data processing systems.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">11. Cookies &amp; Tracking</h2>
            <p>
              We use cookies on marketing pages for analytics and advertising. We do not use advertising cookies or trackers on bill analysis pages. For EU/EEA/UK visitors, we obtain consent before setting non-essential cookies.
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">12. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, contact us and we will promptly delete it.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Material changes will be posted on this page with an updated &quot;Last Updated&quot; date. Your continued use of the service after changes constitutes acceptance.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-bold text-slate-800">14. Contact Us</h2>
            <p>
              For privacy inquiries, data requests, or questions about this policy:
            </p>
            <p>
              <strong>Email:</strong> privacy@medicalbillreader.com
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}
