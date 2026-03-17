// app/api/appointments/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@lib/prisma";
import { Service } from "../../../../types/types";
import { getSessionFromRequest } from "@lib/auth";
import { z } from "zod";

const appointmentUpdateSchema = z.object({
  date: z.string().min(1).optional(),
  startTime: z.string().min(1).optional(),
  endTime: z.string().min(1).optional(),
  available: z.boolean().optional(),
  order: z
    .object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().min(5).optional(),
      price: z.number().nonnegative().optional(),
      duration: z.number().int().nonnegative().optional(),
      services: z.array(z.object({ id: z.number().int().positive() })).optional(),
    })
    .optional(),
});

// GET appointment by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // <- ADD AWAIT HERE
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const payload = await req.json();
    const parsed = appointmentUpdateSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid payload", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updatedData = parsed.data;
    const { order, ...appointmentData } = updatedData;

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...appointmentData,
        order: order
          ? {
              upsert: {
                create: {
                  name: order.name || '',
                  email: order.email || '',
                  phone: order.phone || '',
                  price: Number(order.price || 0),
                  duration: order.duration || 0,
                  services: {
                    connect: order.services?.map((service: { id: number }) => ({ id: service.id })) || []
                  }
                },
                update: {
                  name: order.name || '',
                  email: order.email || '',
                  phone: order.phone || '',
                  price: Number(order.price || 0),
                  duration: order.duration || 0,
                  services: {
                    set: order.services?.map((service: { id: number }) => ({ id: service.id })) || []
                  }
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
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // <- ADD AWAIT HERE
    const appointmentId = Number(id);

    if (Number.isNaN(appointmentId)) {
      return NextResponse.json(
        { message: "Appointment ID is required" },
        { status: 400 }
      );
    }

    await prisma.order.deleteMany({ where: { appointmentId } });
    await prisma.appointment.delete({ where: { id: appointmentId } });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
