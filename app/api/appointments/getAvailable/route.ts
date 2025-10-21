// app/api/appointments/getAvailable/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // Extract date from query parameter

    if (!date) {
      return NextResponse.json(
        { message: "Date query parameter is required" },
        { status: 400 }
      );
    }

    const availableAppointments = await prisma.appointment.findMany({
      where: {
        date: date,
        available: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(availableAppointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching available appointments:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}