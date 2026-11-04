"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  createPrivacyConsentCookie,
  parsePrivacyConsent,
  type PrivacyConsent as ConsentChoice,
} from "@/lib/privacy-consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
const SCRIPT_ID = "google-analytics-script";
type GtagArguments = [command: string, action: string | Date, params?: Record<string, unknown>];
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: GtagArguments) => void;
};

function clearAnalyticsCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name === "_ga" || name?.startsWith("_ga_")) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.medicalbillreader.com; SameSite=Lax`;
    }
  });
}

function readSavedChoice(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  return parsePrivacyConsent(document.cookie);
}

function hasPrivacySignal(): boolean {
  if (typeof window === "undefined") return false;
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true ||
    navigator.doNotTrack === "1"
  );
}

const subscribeToMount = () => () => {};

export default function PrivacyConsent() {
  // The server snapshot is false, so SSR and the hydration render stay
  // empty; the client snapshot flips to true right after hydration.
  const mounted = useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );
  const [choice, setChoice] = useState<ConsentChoice | null>(readSavedChoice);
  const [showChoices, setShowChoices] = useState<boolean>(
    () => readSavedChoice() === null,
  );

  useEffect(() => {
    const savedChoice = parsePrivacyConsent(document.cookie);
    if (!GA_MEASUREMENT_ID?.trim()) {
      if (savedChoice === "analytics") {
        document.cookie = createPrivacyConsentCookie("essential");
      }
      return;
    }
    if (hasPrivacySignal()) {
      document.cookie = createPrivacyConsentCookie("essential");
      return;
    }
    if (savedChoice === "analytics") loadGoogleAnalytics();
  }, []);

  const saveChoice = (nextChoice: ConsentChoice) => {
    document.cookie = nextChoice === "analytics"
      ? createPrivacyConsentCookie("analytics")
      : createPrivacyConsentCookie("essential");
    setChoice(nextChoice);
    setShowChoices(false);
    if (nextChoice === "analytics") {
      loadGoogleAnalytics();
    } else if (choice === "analytics") {
      (window as AnalyticsWindow).gtag?.("consent", "update", { analytics_storage: "denied" });
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  if (!mounted) return null;
  if (!GA_MEASUREMENT_ID?.trim()) return null;
  if (hasPrivacySignal()) return null;
  if (!showChoices) {
    return (
      <button type="button" onClick={() => setShowChoices(true)}
        className="fixed bottom-3 left-3 z-50 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2">
        Privacy choices
      </button>
    );
  }
  return (
    <section role="dialog" aria-modal="false" aria-labelledby="analytics-choice-heading"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
      <h2 id="analytics-choice-heading" className="text-base font-semibold text-slate-900">Your analytics choice</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        We use Google Analytics only if you accept. It counts page views and basic usage so we can improve the site. It never receives your uploaded bills, reports, or payment details. Advertising and personalization stay off.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Link href="/privacy" className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 underline focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2">Privacy details</Link>
        <button type="button" onClick={() => saveChoice("essential")} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2">Essential only</button>
        <button type="button" onClick={() => saveChoice("analytics")} className="min-h-11 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2">Accept analytics</button>
      </div>
    </section>
  );
}

function loadGoogleAnalytics() {
  const measurementId = GA_MEASUREMENT_ID?.trim();
  if (!measurementId) return;
  if (document.getElementById(SCRIPT_ID)) return;

  const currentWindow = window as AnalyticsWindow;
  currentWindow.dataLayer = currentWindow.dataLayer || [];
  currentWindow.gtag = currentWindow.gtag || ((...args: GtagArguments) => {
    currentWindow.dataLayer?.push(args);
  });
  currentWindow.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  currentWindow.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  currentWindow.gtag("js", new Date());
  currentWindow.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    // Send only origin + path, never the query string. Post-checkout
    // landings carry ?payment=success and marketing links carry utm_*
    // params; none of them belong in analytics page URLs.
    page_location: `${window.location.origin}${window.location.pathname}`,
  });
}
