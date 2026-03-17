import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
  type UserRole,
} from "@lib/auth";

export async function POST(req: Request) {
  const { code } = await req.json();

  let role: UserRole | null = null;
  if (code === process.env.USER_CODE) role = "user";
  if (code === process.env.ADMIN_CODE) role = "admin";

  if (!role) {
    return NextResponse.json({ success: false, message: "Invalid code" });
  }

  const token = createSessionToken(role);
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Server configuration error" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ success: true, role });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });

  return response;
}
