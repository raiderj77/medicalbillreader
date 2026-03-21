"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview, fileType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </div>
          <span className="text-sm text-slate-500">Free · No account needed</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block bg-teal-50 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200">
            Free Medical Bill Explainer — No Sign-Up Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Finally Understand<br />Your Medical Bill
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-4 text-center">Last updated: March 16, 2026</p>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Medical Bill Reader helps you understand confusing medical bills and insurance EOBs in plain language — no medical degree required. Upload a photo or PDF and get every charge explained, potential errors flagged, and clear next steps.
          </p>
        </div>

        {/* Main Tool */}
        {!result ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-teal-400 bg-teal-50"
                    : "border-slate-300 hover:border-teal-400 hover:bg-slate-50"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div className="text-5xl mb-4">📄</div>
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  Drop your bill here or click to upload
                </p>
                <p className="text-sm text-slate-400">
                  Supports JPG, PNG, or PDF · Processed privately in your browser session
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-xl">📄</div>
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-sm text-slate-400 hover:text-slate-600">
                    Remove
                  </button>
                </div>

                {preview && file.type.startsWith("image/") && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 max-h-64 flex items-center justify-center bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Bill preview" className="max-h-64 object-contain" />
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Analyzing your bill…
                    </span>
                  ) : (
                    "Explain My Bill →"
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
            {/* AI-Generated Analysis Badge */}
            <div className="bg-blue-600 px-6 py-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.59-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5" />
              </svg>
              <span className="text-white font-bold text-sm tracking-wide uppercase">AI-Generated Analysis</span>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-xl">✅</div>
                  <h2 className="text-xl font-bold text-slate-800">Your Medical Bill Explained Simply</h2>
                </div>
                <button
                  onClick={reset}
                  className="text-sm text-teal-600 hover:text-teal-800 font-medium border border-teal-200 px-4 py-2 rounded-lg"
                >
                  Analyze Another Bill
                </button>
              </div>
              <div className="prose prose-slate max-w-none">
                {result.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return <h2 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">{line.replace("## ", "")}</h2>;
                  }
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return <p key={i} className="font-semibold text-slate-700 mt-4">{line.replace(/\*\*/g, "")}</p>;
                  }
                  if (line.startsWith("- ")) {
                    return <li key={i} className="text-slate-600 ml-4 list-disc">{line.replace("- ", "")}</li>;
                  }
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-slate-600 leading-relaxed">{line}</p>;
                })}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
                <p className="text-amber-900 font-semibold text-base mb-2">Important Disclaimer</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  This analysis was generated by artificial intelligence and is for informational purposes only. It does not constitute medical or financial advice. Always verify charges with your healthcare provider and insurance company before taking action.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const text = result.split('\n').map(line => {
                      if (line.startsWith('## ')) return line.replace('## ', '') + ':';
                      if (line.startsWith('**') && line.endsWith('**')) return line.replace(/\*\*/g, '');
                      if (line.startsWith('- ')) return '  • ' + line.replace('- ', '');
                      return line;
                    }).join('\n');
                    navigator.clipboard.writeText(text).then(() => {
                      const btn = document.getElementById('copy-btn');
                      if (btn) {
                        btn.textContent = '✓ Copied!';
                        setTimeout(() => { btn.textContent = 'Copy Summary'; }, 2000);
                      }
                    });
                  }}
                  id="copy-btn"
                  className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg transition-colors"
                >
                  Copy Summary
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.share) {
                      navigator.share({
                        title: 'Medical Bill Analysis',
                        text: 'I analyzed my medical bill at MedicalBillReader.com',
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText('I analyzed my medical bill at MedicalBillReader.com ' + window.location.href).then(() => {
                        const btn = document.getElementById('share-btn');
                        if (btn) {
                          btn.textContent = '✓ Copied!';
                          setTimeout(() => { btn.textContent = 'Share'; }, 2000);
                        }
                      });
                    }
                  }}
                  id="share-btn"
                  className="px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-800 border border-teal-200 rounded-lg transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "📤", title: "Upload Your Bill", desc: "Take a photo or upload a PDF of any medical bill, EOB, or hospital statement." },
            { icon: "🤖", title: "AI Reads It", desc: "Our AI scans every line item, code, and charge — the same way a billing expert would." },
            { icon: "💬", title: "Get Plain English", desc: "You get a clear breakdown of every charge, plus flags for anything that looks unusual." },
          ].map((step) => (
            <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-6 text-center">
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { icon: "🔒", label: "Never stored", desc: "Bills are never saved" },
            { icon: "🆓", label: "Always free", desc: "No account needed" },
            { icon: "⚡", label: "30 seconds", desc: "Fast results" },
          ].map((t) => (
            <div key={t.label}>
              <div className="text-2xl mb-1">{t.icon}</div>
              <p className="font-semibold text-slate-800 text-sm">{t.label}</p>
              <p className="text-xs text-slate-400">{t.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Frequently Asked Questions About Medical Bills</h2>
          <div className="space-y-4">
            {[
              {
                q: "Is my medical bill kept private?",
                a: "Yes. Your bill is sent directly to our AI for analysis and is never stored, logged, or shared. Each session is completely private.",
              },
              {
                q: "What types of bills can I upload?",
                a: "Any medical bill, hospital statement, Explanation of Benefits (EOB) from your insurer, or itemized billing statement. JPG, PNG, and PDF formats are all supported.",
              },
              {
                q: "Can this tool catch billing errors?",
                a: "Yes. Our AI is trained to flag common billing issues like duplicate charges, upcoding, unbundling, and charges for services not rendered. However, always verify with your provider.",
              },
              {
                q: "What should I do if my bill has errors?",
                a: "Contact your healthcare provider's billing department directly. Ask for an itemized bill if you don't have one, and request a review of any flagged charges. You can also contact your insurance company.",
              },
              {
                q: "Is this medical or legal advice?",
                a: "No. This tool provides educational information to help you understand your bill. It is not a substitute for professional medical billing advice or legal counsel.",
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
