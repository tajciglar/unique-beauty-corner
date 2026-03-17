import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@lib/auth";
import { sendEmail } from "@utility/sendEmail";
import { buildAppointmentIcs } from "@utility/appointmentIcs";

const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

export async function POST(req: Request) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" && body.email.trim()
      ? body.email.trim()
      : process.env.EMAIL_USER;

    if (!email) {
      return NextResponse.json(
        { message: "No target email configured" },
        { status: 400 }
      );
    }

    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const date = toIsoDate(tomorrow);
    const startTime = "10:00";
    const duration = 60;

    const calendarIcs = buildAppointmentIcs({
      orderId: 0,
      name: "Test Stranka",
      phone: "+386 40 000 000",
      email,
      date,
      startTime,
      endTime: "11:00",
      duration,
      price: 50,
      services: [{ serviceName: "Test storitev" }],
    });

    await sendEmail({
      name: "Test Stranka",
      phone: "+386 40 000 000",
      email,
      duration,
      price: 50,
      services: [{ serviceName: "Test storitev" }],
      date,
      startTime,
      calendarAttachment: calendarIcs
        ? { filename: "appointment.ics", content: calendarIcs }
        : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
