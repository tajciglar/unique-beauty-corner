import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { rateLimit, getClientIp } from "@lib/rateLimit";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`public-appointments:${ip}`, { limit: 30, windowSeconds: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ message: "Too many requests" }, { status: 429 });
    }

    const availableAppointments = await prisma.appointment.findMany({
      where: { available: true },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        available: true,
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ availableAppointments });
  } catch (error) {
    console.error("Error fetching public appointments:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
