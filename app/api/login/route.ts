import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();
  
  if (code === process.env.USER_CODE) {
    return NextResponse.json({ success: true, role: 'user' });
  }

  if (code === process.env.ADMIN_CODE) {
    return NextResponse.json({ success: true, role: 'admin' });
  }

  return NextResponse.json({ success: false, message: 'Invalid code' });
}