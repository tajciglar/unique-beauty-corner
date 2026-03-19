import { createHmac, randomBytes } from "crypto";

const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required for CSRF");
  return secret;
};

/**
 * Generate a CSRF token: random nonce + HMAC signature.
 * Format: {nonce}.{signature}
 */
export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", getSecret())
    .update(nonce)
    .digest("hex");
  return `${nonce}.${signature}`;
}

/**
 * Verify a CSRF token by checking its HMAC signature.
 */
export function verifyCsrfToken(token: string): boolean {
  if (!token) return false;
  const [nonce, signature] = token.split(".");
  if (!nonce || !signature) return false;

  const expected = createHmac("sha256", getSecret())
    .update(nonce)
    .digest("hex");

  return signature === expected;
}

export const CSRF_HEADER = "x-csrf-token";
export const CSRF_COOKIE = "ubc_csrf";

/**
 * Validate CSRF using double-submit cookie pattern.
 * The header token must match the cookie token, and both must be valid.
 */
export function validateCsrf(req: Request): boolean {
  const headerToken = req.headers.get(CSRF_HEADER);
  if (!headerToken) return false;

  // Parse cookie
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return false;

  const cookies = cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});

  const cookieToken = cookies[CSRF_COOKIE];
  if (!cookieToken) return false;

  // Both tokens must match and be valid
  return headerToken === cookieToken && verifyCsrfToken(headerToken);
}
