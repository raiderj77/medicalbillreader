"use client";
import { useState } from "react";
import { readJsonResponse } from "@/lib/read-json-response";
export default function SingleAnalysisPurchase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function buy() {
    if (loading) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priceType: "per-use" }) });
      const data = await readJsonResponse<{ url?: string; error?: string }>(response);
      if (response.ok && data.url) window.location.assign(data.url);
      else setError(data.error || "Checkout could not be started.");
    } catch { setError("Checkout could not be started. Please try again."); }
    finally { setLoading(false); }
  }
  return <div><button type="button" onClick={buy} disabled={loading} aria-busy={loading} className="block w-full rounded-lg bg-teal-700 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-50">{loading ? "Loading..." : "Buy Single Analysis"}</button><p role="status">{error}</p></div>;
}
