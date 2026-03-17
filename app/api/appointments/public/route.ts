import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET() {
  try {
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
