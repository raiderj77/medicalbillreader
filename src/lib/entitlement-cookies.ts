export const PAY_PER_USE_COOKIE_MAX_AGE = 60 * 60 * 24;
export const SUBSCRIPTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

export const ENTITLEMENT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export const SUBSCRIPTION_HINT_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};
