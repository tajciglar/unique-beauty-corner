import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@lib/auth";

export const config = {
  matcher: ["/admin/:path*"],
};

export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const session = verifySessionToken(token);

  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
