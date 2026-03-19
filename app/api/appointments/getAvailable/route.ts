// app/api/appointments/getAvailable/route.ts
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

const isValidDate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // Extract date from query parameter
    const requiredDuration = searchParams.get("duration"); // Extract duration from query parameter

    if (!date) {
      return NextResponse.json(
        { message: "Date query parameter is required" },
        { status: 400 }
      );
    }
    if (!isValidDate(date)) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Return all available slots for the requested date.
    // (Time filtering is handled client-side to avoid timezone-related issues.)
    let availableAppointments = await prisma.appointment.findMany({
      where: {
        date,
        available: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Filter appointments by duration if specified
    if (requiredDuration) {
      const durationMinutes = parseInt(requiredDuration);
      if (!isNaN(durationMinutes)) {
        availableAppointments = availableAppointments.filter((appointment) => {
          const startTime = new Date(`1970-01-01T${appointment.startTime}:00`);
          const endTime = new Date(`1970-01-01T${appointment.endTime}:00`);
          const appointmentDuration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
          return appointmentDuration === durationMinutes;
        });
      }
    }

    return NextResponse.json(availableAppointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching available appointments:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
