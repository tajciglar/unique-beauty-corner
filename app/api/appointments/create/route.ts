import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { sendEmail } from "@utility/sendEmail";
import { getSessionFromRequest } from "@lib/auth";
import { z } from "zod";
import { createCalendarToken } from "@lib/calendarToken";
import { buildAppointmentIcs } from "@utility/appointmentIcs";
import { sendSms } from "@utility/sendSms";

const appointmentCreateSchema = z.object({
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  available: z.boolean(),
  order: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(5),
      price: z.number().nonnegative(),
      duration: z.number().int().nonnegative(),
      services: z.array(z.object({ id: z.string().or(z.number()) })).min(1),
    })
    .optional(),
});

export async function POST(req: Request) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();
    const parsed = appointmentCreateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const appointment = parsed.data;

    // check if appointment slot is already taken
    const checkAppointment = await prisma.appointment.findFirst({
      where: { date: appointment.date, startTime: appointment.startTime },
    });

    if (checkAppointment) {
      return NextResponse.json(
        { message: "Termin že zaseden" },
        { status: 400 }
      );
    }

    let newAppointment;

    if (appointment.order) {
      newAppointment = await prisma.appointment.create({
        data: {
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          available: appointment.available,
          order: {
            create: {
              name: appointment.order.name,
              email: appointment.order.email,
              phone: appointment.order.phone,
              price: appointment.order.price,
              duration: appointment.order.duration,
              services: {
                connect: appointment.order.services.map((service: { id: string | number }) => ({
                  id: Number(service.id),
                })),
              },
            },
          },
        },
        include: {
          order: {
            include: {
              services: true,
            },
          },
        },
      });
      console.log("try email")
      try {
        const calendarToken = newAppointment.order
          ? createCalendarToken(newAppointment.order.id)
          : null;
        const calendarIcs =
          calendarToken && newAppointment.order
            ? buildAppointmentIcs({
                orderId: newAppointment.order.id,
                name: newAppointment.order.name,
                phone: newAppointment.order.phone,
                email: newAppointment.order.email,
                date: newAppointment.date,
                startTime: newAppointment.startTime,
                endTime: newAppointment.endTime,
                duration: newAppointment.order.duration,
                price: Number(newAppointment.order.price),
                services: newAppointment.order.services,
              })
            : null;

        await sendEmail({
          name: newAppointment.order!.name!,
          phone: newAppointment.order!.phone!,
          email: newAppointment.order!.email!,
          duration: Number(newAppointment.order!.duration ?? 0),
          price: Number(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            typeof newAppointment.order!.price === "object" && newAppointment.order!.price !== null && typeof (newAppointment.order!.price as any).toNumber === "function"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? (newAppointment.order!.price as any).toNumber()
              : newAppointment.order!.price
          ),
          services: newAppointment.order!.services,
          date: newAppointment.date,
          startTime: newAppointment.startTime,
          calendarAttachment:
            calendarToken && calendarIcs
              ? { filename: "appointment.ics", content: calendarIcs }
              : undefined,
        })
      } catch (emailError) {
        // Log the error but don't fail the entire request
        console.error('Failed to send email:', emailError);
        // You might want to add the order to a retry queue here
      }

      try {
        await sendSms({
          to: newAppointment.order!.phone!,
          name: newAppointment.order!.name!,
          date: newAppointment.date,
          startTime: newAppointment.startTime,
          duration: Number(newAppointment.order!.duration ?? 0),
          price: Number(newAppointment.order!.price),
          services: newAppointment.order!.services,
        });
        console.log("SMS sent successfully");
      } catch (smsError) {
        console.error("Failed to send SMS:", smsError);
      }

    } else {
      newAppointment = await prisma.appointment.create({
        data: {
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          available: appointment.available,
        },
      });
    }
    
    return NextResponse.json({ message: "New appointment added", newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
