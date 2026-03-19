import { createHmac, timingSafeEqual } from "crypto";

export type UserRole = "admin" | "user";

export const SESSION_COOKIE_NAME = "ubc_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  role: UserRole;
  exp: number;
}

const getSessionSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is required");
  }
  return secret;
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value).toString("base64url");

const base64UrlDecode = (value: string) =>
  Buffer.from(value, "base64url").toString("utf-8");

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export const createSessionToken = (role: UserRole) => {
  const secret = getSessionSecret();
  if (!secret) return null;
  const payload: SessionPayload = {
    role,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

export const verifySessionToken = (token: string): SessionPayload | null => {
  const secret = getSessionSecret();
  if (!secret) return null;
  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return null;
  const expected = sign(payloadPart, secret);
  try {
    const provided = Buffer.from(signaturePart, "base64url");
    const expectedBuf = Buffer.from(expected, "base64url");
    if (
      provided.length !== expectedBuf.length ||
      !timingSafeEqual(provided, expectedBuf)
    ) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadPart)) as SessionPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    if (payload.role !== "admin" && payload.role !== "user") return null;
    return payload;
  } catch {
    return null;
  }
};

const parseCookies = (cookieHeader: string | null) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

export const getSessionFromRequest = (req: Request) => {
  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  return verifySessionToken(token);
};
