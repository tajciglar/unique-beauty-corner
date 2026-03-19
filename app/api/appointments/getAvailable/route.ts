// app/api/appointments/getAvailable/route.ts
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

const isValidDate = (date: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
};

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const requiredDuration = searchParams.get("duration");

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

    // Fetch all available slots for the requested date, sorted by startTime
    const availableAppointments = await prisma.appointment.findMany({
      where: {
        date,
        available: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // If no duration filter, return all slots as-is
    if (!requiredDuration) {
      return NextResponse.json(availableAppointments, { status: 200 });
    }

    const durationMinutes = parseInt(requiredDuration);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      return NextResponse.json(availableAppointments, { status: 200 });
    }

    // Build consecutive slot chains and find valid start times
    // A slot chain is a sequence of slots where slot[i].endTime === slot[i+1].startTime
    const results: Array<{
      id: number;
      date: string;
      startTime: string;
      endTime: string;
      available: boolean;
      coveredSlotIds: number[];
    }> = [];

    for (let i = 0; i < availableAppointments.length; i++) {
      const chain = [availableAppointments[i]];
      let chainEnd = timeToMinutes(availableAppointments[i].endTime);

      // Extend chain with consecutive slots
      for (let j = i + 1; j < availableAppointments.length; j++) {
        const nextStart = timeToMinutes(availableAppointments[j].startTime);
        if (nextStart === chainEnd) {
          chain.push(availableAppointments[j]);
          chainEnd = timeToMinutes(availableAppointments[j].endTime);
        } else {
          break;
        }
      }

      const chainStart = timeToMinutes(chain[0].startTime);
      const totalChainDuration = chainEnd - chainStart;

      if (totalChainDuration >= durationMinutes) {
        // This starting slot can accommodate the required duration
        // Calculate which slots are covered
        const bookingEnd = chainStart + durationMinutes;
        const coveredSlotIds: number[] = [];

        for (const slot of chain) {
          const slotStart = timeToMinutes(slot.startTime);
          if (slotStart < bookingEnd) {
            coveredSlotIds.push(slot.id);
          } else {
            break;
          }
        }

        results.push({
          id: chain[0].id,
          date: chain[0].date,
          startTime: chain[0].startTime,
          endTime: minutesToTime(bookingEnd),
          available: true,
          coveredSlotIds,
        });
      }
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error fetching available appointments:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
