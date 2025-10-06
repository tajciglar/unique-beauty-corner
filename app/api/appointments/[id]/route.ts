// app/api/appointments/[id]/route.ts
import { Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@lib/prisma";
import { Service } from "../../../../types/types";

// GET appointment by ID
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const appointmentId = Number(id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        order: {
          include: {
            services: {
              include: { serviceCategory: true },
            },
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update appointment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, context: any) {
  const { id } = context.params;
  const appointmentId = Number(id);
  const updatedData = await req.json();

  if (!appointmentId || !updatedData) {
    return NextResponse.json(
      { message: "Appointment ID and data are required" },
      { status: 400 }
    );
  }

  try {
    const { order, ...appointmentData } = updatedData;

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...appointmentData,
        order: order
          ? {
              upsert: {
                create: {
                  name: order.name,
                  email: order.email,
                  phone: order.phone,
                  price: new Prisma.Decimal(order.price || 0),
                  duration: order.duration,
                  services:
                    order.services?.map((service: Service) => ({ id: service.id })) || [],
                },
                update: {
                  name: order.name,
                  email: order.email,
                  phone: order.phone,
                  price: Number(order.price || 0),
                  duration: order.duration,
                  services:
                    order.services?.map((service: Service) => ({ id: service.id })) || [],
                },
              },
            }
          : undefined,
      },
      include: { order: { include: { services: true } } },
    });

    return NextResponse.json({
      message: "Appointment updated successfully",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE appointment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, context: any) {
  const { id } = context.params;
  const appointmentId = Number(id);

  if (!appointmentId) {
    return NextResponse.json(
      { message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.order.deleteMany({ where: { appointmentId } });
    await prisma.appointment.delete({ where: { id: appointmentId } });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
