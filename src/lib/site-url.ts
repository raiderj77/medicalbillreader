const PRODUCTION_ORIGIN = "https://medicalbillreader.com";
const PROJECT_VERCEL_ALIAS = "medicalbillreader.vercel.app";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const VERCEL_HOST_ENV_KEYS = [
  "VERCEL_URL",
  "VERCEL_BRANCH_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
] as const;

function cleanProjectVercelHost(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const candidate = value.includes("://") ? value : `https://${value}`;
    const url = new URL(candidate);
    const projectNamedHost =
      url.hostname === PROJECT_VERCEL_ALIAS ||
      (url.hostname.startsWith("medicalbillreader-") &&
        url.hostname.endsWith(".vercel.app"));
    const cleanHostValue =
      url.protocol === "https:" &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      (url.pathname === "/" || url.pathname === "");

    return projectNamedHost && cleanHostValue ? url.hostname : null;
  } catch {
    return null;
  }
}

function projectVercelHosts(): Set<string> {
  const hosts = new Set([PROJECT_VERCEL_ALIAS]);
  for (const key of VERCEL_HOST_ENV_KEYS) {
    const host = cleanProjectVercelHost(process.env[key]);
    if (host) hosts.add(host);
  }
  return hosts;
}

/**
 * Returns an allowlisted application origin for Stripe redirects. Request host
 * headers are intentionally not trusted because they can be attacker supplied.
 */
export function trustedSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return PRODUCTION_ORIGIN;

  try {
    const url = new URL(configured);
    const hasUnexpectedParts =
      Boolean(url.username || url.password || url.search || url.hash) ||
      (url.pathname !== "/" && url.pathname !== "");
    if (hasUnexpectedParts) return PRODUCTION_ORIGIN;

    if (url.origin === PRODUCTION_ORIGIN) return PRODUCTION_ORIGIN;

    const isLocalDevelopment =
      LOCAL_HOSTS.has(url.hostname) &&
      (url.protocol === "http:" || url.protocol === "https:");
    if (isLocalDevelopment) return url.origin;

    const isCurrentProjectVercelOrigin =
      url.protocol === "https:" &&
      !url.port &&
      projectVercelHosts().has(url.hostname);

    return isCurrentProjectVercelOrigin ? url.origin : PRODUCTION_ORIGIN;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}
