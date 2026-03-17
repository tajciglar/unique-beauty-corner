import { createHmac, timingSafeEqual } from "crypto";

const getCalendarSecret = () => process.env.CALENDAR_TOKEN_SECRET || "";

export const createCalendarToken = (orderId: number) => {
  const secret = getCalendarSecret();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(String(orderId))
    .digest("base64url");
};

export const verifyCalendarToken = (orderId: number, token: string) => {
  const expected = createCalendarToken(orderId);
  if (!expected) return false;
  try {
    const provided = Buffer.from(token, "base64url");
    const expectedBuf = Buffer.from(expected, "base64url");
    if (provided.length !== expectedBuf.length) return false;
    return timingSafeEqual(provided, expectedBuf);
  } catch {
    return false;
  }
};
