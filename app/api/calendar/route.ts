import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { verifyCalendarToken } from "@lib/calendarToken";
import { buildAppointmentIcs } from "@utility/appointmentIcs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderIdParam = searchParams.get("orderId");
    const token = searchParams.get("token") || "";

    const orderId = Number(orderIdParam);
    if (!orderIdParam || Number.isNaN(orderId)) {
      return NextResponse.json({ message: "Invalid order id" }, { status: 400 });
    }

    if (!verifyCalendarToken(orderId, token)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        appointment: true,
        services: true,
      },
    });

    if (!order || !order.appointment) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const ics = buildAppointmentIcs({
      orderId: order.id,
      name: order.name,
      phone: order.phone,
      email: order.email,
      date: order.appointment.date,
      startTime: order.appointment.startTime,
      endTime: order.appointment.endTime,
      duration: order.duration,
      price: order.price,
      services: order.services,
    });

    if (!ics) {
      return NextResponse.json(
        { message: "Could not create calendar event" },
        { status: 500 }
      );
    }

    return new NextResponse(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="appointment.ics"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating calendar event:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
