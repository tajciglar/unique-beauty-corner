import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req: Request) {
  try {
    const appointment = await req.json();

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
                connect: appointment.order.services.map((service: { id: string }) => ({
                  id: service.id,
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