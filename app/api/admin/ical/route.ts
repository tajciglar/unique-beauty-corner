import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import {
  ICS_TIMEZONE,
  addMinutes,
  escapeIcsText,
  formatIcsDate,
  formatUtcStamp,
  parseAppointmentDateTime,
} from "@utility/ical";

const CAL_NAME = "Unique Beauty Appointments";
const LOCATION = "Unique Beauty Studio, Jesenova ulica 31, 1230 Domžale";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Support both Authorization header (preferred) and URL token (for calendar clients)
  let token: string | null = null;

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = searchParams.get("token");
  }

  if (!process.env.ADMIN_ICAL_TOKEN || token !== process.env.ADMIN_ICAL_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    const appointments = await prisma.appointment.findMany({
      where: {
        available: false,
        date: {
          gte: today,
        },
      },
      include: {
        order: {
          include: {
            services: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    const nowStamp = formatUtcStamp();

    const events = appointments
      .map((appointment) => {
        const start = parseAppointmentDateTime(
          appointment.date,
          appointment.startTime
        );
        if (!start) return null;

        const end =
          parseAppointmentDateTime(appointment.date, appointment.endTime) ||
          (appointment.order?.duration
            ? addMinutes(start, appointment.order.duration)
            : null);
        if (!end) return null;

        const order = appointment.order;
        const serviceNames = order?.services?.map((s) => s.serviceName).join(", ");

        const summary = escapeIcsText(
          order?.name ? `Termin - ${order.name}` : "Termin"
        );

        const descriptionParts = [
          order?.name ? `Stranka: ${order.name}` : null,
          order?.phone ? `Telefon: ${order.phone}` : null,
          order?.email ? `Email: ${order.email}` : null,
          order?.duration ? `Trajanje: ${order.duration} min` : null,
          order?.price != null ? `Cena: €${order.price}` : null,
          serviceNames ? `Storitve: ${serviceNames}` : null,
        ].filter(Boolean);

        const description = escapeIcsText(descriptionParts.join("\n"));

        return [
          "BEGIN:VEVENT",
          `UID:appointment-${appointment.id}@unique-beauty-corner`,
          `DTSTAMP:${nowStamp}`,
          `DTSTART;TZID=${ICS_TIMEZONE}:${formatIcsDate(start)}`,
          `DTEND;TZID=${ICS_TIMEZONE}:${formatIcsDate(end)}`,
          `SUMMARY:${summary}`,
          `DESCRIPTION:${description}`,
          `LOCATION:${escapeIcsText(LOCATION)}`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .filter(Boolean)
      .join("\r\n");

    const calendar = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Unique Beauty Corner//Admin Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${escapeIcsText(CAL_NAME)}`,
      `X-WR-TIMEZONE:${ICS_TIMEZONE}`,
      events,
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    return new NextResponse(calendar, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="unique-beauty-admin.ics"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating admin iCal feed:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
