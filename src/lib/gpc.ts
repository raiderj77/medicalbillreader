// Global Privacy Control detection and honoring.
// Server-side detection is used in middleware to set the empire_gpc cookie.
// Client-side detection is used in the Cookiebot auto-decline script in layout.tsx.

export function detectGPCServer(request: Request): boolean {
  const header = request.headers.get('sec-gpc')
  return header === '1'
}

export function detectGPCClient(): boolean {
  if (typeof navigator === 'undefined') return false
  // @ts-expect-error — globalPrivacyControl is not yet in the TS lib
  return navigator.globalPrivacyControl === true
}

export function getConsentDefaultsFromGPC(gpcActive: boolean) {
  if (gpcActive) {
    return {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
    }
  }
  return null
}
