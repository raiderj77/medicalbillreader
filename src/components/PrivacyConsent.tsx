"use client";

import { useEffect, useState } from "react";
import {
  createPrivacyConsentCookie,
  parsePrivacyConsent,
  type PrivacyConsent,
} from "@/lib/privacy-consent";

const GA_ID = "G-3P9M4GWKE7";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function hasGlobalPrivacyControl(): boolean {
  return (
    // globalPrivacyControl is not yet included in every TypeScript DOM release.
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true ||
    document.cookie.includes("empire_gpc=1")
  );
}

function grantAnalyticsConsent() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!document.getElementById("ga4-src")) {
    const script = document.createElement("script");
    script.id = "ga4-src";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

}

export default function PrivacyConsent() {
  const [choice, setChoice] = useState<PrivacyConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [gpcActive, setGpcActive] = useState(false);

  useEffect(() => {
    const gpc = hasGlobalPrivacyControl();
    const savedChoice = parsePrivacyConsent(document.cookie);

    if (gpc) {
      document.cookie = createPrivacyConsentCookie("essential");
    } else {
      if (savedChoice === "analytics") grantAnalyticsConsent();
    }

    queueMicrotask(() => {
      setGpcActive(gpc);
      setChoice(gpc ? "essential" : savedChoice);
      setPreferencesOpen(savedChoice === null && !gpc);
      setReady(true);
    });
  }, []);

  function saveChoice(nextChoice: PrivacyConsent) {
    if (nextChoice === "analytics" && gpcActive) return;

    const previouslyLoadedAnalytics = choice === "analytics";
    document.cookie = createPrivacyConsentCookie(nextChoice);
    setChoice(nextChoice);
    setPreferencesOpen(false);

    if (nextChoice === "analytics") {
      grantAnalyticsConsent();
    } else if (previouslyLoadedAnalytics) {
      window.location.reload();
    }
  }

  if (!ready) return null;

  return (
    <>
      {preferencesOpen && (
        <section
          aria-labelledby="privacy-consent-title"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          role="dialog"
        >
          <h2
            id="privacy-consent-title"
            className="text-lg font-bold text-slate-900 dark:text-white"
          >
            Your privacy choices
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Essential cookies keep the service secure and remember this choice.
            With your permission, Google Analytics helps us understand site usage.
            We never send uploaded bill content or analysis results to it.
          </p>
          {gpcActive && (
            <p className="mt-2 text-sm font-medium text-teal-700 dark:text-teal-300">
              Your browser sent a Global Privacy Control signal, so optional
              analytics remain off.
            </p>
          )}
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={() => saveChoice("essential")}
              type="button"
            >
              Use essential only
            </button>
            {!gpcActive && (
              <button
                className="min-h-11 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                onClick={() => saveChoice("analytics")}
                type="button"
              >
                Allow analytics
              </button>
            )}
          </div>
        </section>
      )}

      {!preferencesOpen && (
        <button
          className="fixed bottom-3 left-3 z-[90] min-h-11 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => setPreferencesOpen(true)}
          type="button"
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
