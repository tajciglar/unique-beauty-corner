
import { sendEmail } from "@utility/sendEmail";
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { getSessionFromRequest } from "@lib/auth";
import { z } from "zod";
import { createCalendarToken } from "@lib/calendarToken";
import { buildAppointmentIcs } from "@utility/appointmentIcs";
import { sendSms } from "@utility/sendSms";

const orderCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  email: z.string().email(),
  appointmentId: z.coerce.number().int().positive(),
  services: z
    .array(z.object({ id: z.coerce.number().int().positive() }))
    .min(1),
});

const normalizeTime = (value: string) => {
  if (!value) return "";
  if (value.includes("T")) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toTimeString().slice(0, 5);
  }
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const addMinutesToTime = (time: string, minutes: number) => {
  if (!time) return "";
  const base = new Date(`1970-01-01T${time}:00`);
  base.setMinutes(base.getMinutes() + minutes);
  return base.toTimeString().slice(0, 5);
};

// GET /api/orders
export async function GET(req: Request) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: {
        appointment: true,
        services: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST /api/orders - from termin/page.tsx
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = orderCreateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, appointmentId, services } = parsed.data;
    const serviceIds = services.map((s) => s.id);

    const result = await prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.findUnique({
        where: { id: appointmentId },
        include: { order: true },
      });

      if (!appointment || !appointment.available) {
        throw new Error("TERMIN_TAKEN");
      }

      const dbServices = await tx.services.findMany({
        where: { id: { in: serviceIds } },
      });

      if (dbServices.length !== serviceIds.length) {
        throw new Error("INVALID_SERVICES");
      }

      const duration = dbServices.reduce(
        (sum, s) => sum + (s.serviceTime ?? 0),
        0
      );
      const price = dbServices.reduce(
        (sum, s) => sum + Number(s.servicePrice),
        0
      );

      const startTime = normalizeTime(appointment.startTime);
      const endTime =
        normalizeTime(appointment.endTime) ||
        addMinutesToTime(startTime, duration);

      const newOrder = await tx.order.create({
        data: {
          name,
          email,
          phone,
          duration,
          price,
          appointment: { connect: { id: appointmentId } },
          services: { connect: dbServices.map((s) => ({ id: s.id })) },
        },
        include: { appointment: true, services: true },
      });

      const updated = await tx.appointment.updateMany({
        where: { id: appointmentId, available: true },
        data: { available: false, startTime, endTime },
      });
      if (updated.count === 0) {
        throw new Error("TERMIN_TAKEN");
      }

      await tx.appointment.deleteMany({
        where: {
          date: appointment.date,
          available: true,
          startTime: { lt: endTime },
          NOT: { id: appointmentId },
        },
      });

      return newOrder;
    });

    const calendarToken = createCalendarToken(result.id);
    const calendarIcs =
      calendarToken && result.appointment
        ? buildAppointmentIcs({
            orderId: result.id,
            name: result.name,
            phone: result.phone,
            email: result.email,
            date: result.appointment.date,
            startTime: result.appointment.startTime,
            endTime: result.appointment.endTime,
            duration: result.duration,
            price: Number(result.price),
            services: result.services,
          })
        : null;

    try {
      await sendEmail({
      name: result.name!,
      phone: result.phone!,
      email: result.email!,
      duration: result.duration ?? 0,
      price: typeof result.price === "object" && "toNumber" in result.price
        ? result.price
        : Number(result.price),
      services: result.services,
      date: result.appointment!.date,
      startTime: result.appointment!.startTime,
      calendarAttachment:
        calendarToken && calendarIcs
          ? { filename: "appointment.ics", content: calendarIcs }
          : undefined,
    });
      console.log('Email sent successfully');
    } catch (emailError) {
      // Log the error but don't fail the entire request
      console.error('Failed to send email:', emailError);
      // You might want to add the order to a retry queue here
    }

    try {
      await sendSms({
        to: result.phone!,
        name: result.name!,
        date: result.appointment!.date,
        startTime: result.appointment!.startTime,
        duration: result.duration ?? 0,
        price: Number(result.price),
        services: result.services,
      });
      console.log("SMS sent successfully");
    } catch (smsError) {
      console.error("Failed to send SMS:", smsError);
    }

    return NextResponse.json(
      { ...result, calendarToken },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "TERMIN_TAKEN") {
        return NextResponse.json({ message: "Termin zaseden" }, { status: 400 });
      }
      if (error.message === "INVALID_SERVICES") {
        return NextResponse.json({ message: "Invalid services" }, { status: 400 });
      }
    }
    console.error("Error creating order:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
