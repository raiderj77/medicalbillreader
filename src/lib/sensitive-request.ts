import { trustedSiteOrigin } from "./site-url";

export class SensitiveRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super("Sensitive request rejected");
    this.name = "SensitiveRequestError";
    this.status = status;
  }
}

function validJsonContentType(value: string | null): boolean {
  if (!value) return false;
  const parts = value
    .split(";")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (parts[0] !== "application/json") return false;
  return parts.slice(1).every((part) => part === "charset=utf-8");
}

/**
 * Browser-only sensitive POSTs fail closed unless their URL, Host, Origin, and
 * media type all match the configured application origin. No request headers
 * are reflected and this helper never enables cross-origin access.
 */
export function validateSensitiveJsonRequest(request: Request): void {
  if (!validJsonContentType(request.headers.get("content-type")))
    throw new SensitiveRequestError(415);

  const expected = new URL(trustedSiteOrigin());
  let actual: URL;
  try {
    actual = new URL(request.url);
  } catch {
    throw new SensitiveRequestError(403);
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (
    actual.origin !== expected.origin ||
    actual.host !== expected.host ||
    host?.toLowerCase() !== expected.host.toLowerCase() ||
    origin !== expected.origin
  ) {
    throw new SensitiveRequestError(403);
  }
}
