"use client";

import { useEffect } from "react";
import {
  createPrivacyConsentCookie,
  parsePrivacyConsent,
} from "@/lib/privacy-consent";

/**
 * Analytics is disabled for the strict-YMYL release, so there is no optional
 * tracking choice to present. Normalize a legacy opt-in cookie to essential
 * only; GPC remains honored because no analytics or advertising code loads for
 * any visitor.
 */
export default function PrivacyConsent() {
  useEffect(() => {
    if (parsePrivacyConsent(document.cookie) === "analytics") {
      document.cookie = createPrivacyConsentCookie("essential");
    }
  }, []);

  return null;
}
