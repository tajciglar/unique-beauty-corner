// PUT update appointment
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@lib/prisma"
import { Service } from '../../../../types/types';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params properly
    const { id } = await context.params;
    const appointmentId = Number(id);

    // Validate appointment ID
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { message: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    // Fetch the appointment including related order & services
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        order: {
          include: {
            services: {
              include: {
                serviceCategory: true, // Include service category
              },
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
  req: Request,
  context: { params: { id: string } }
) {
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
    // Separate appointment fields from order fields
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
                  services: {
                    connect: order.services?.map((service: Service) => ({
                      id: service.id,
                    })) || [],
                  },
                },
                update: {
                  name: order.name,
                  email: order.email,
                  phone: order.phone,
                  price: new Prisma.Decimal(order.price || 0),
                  duration: order.duration,
                  services: {
                    set: order.services?.map((service: Service) => ({
                      id: service.id,
                    })) || [],
                  },
                },
              },
            }
          : undefined, // Leave order unchanged if no data provided
      },
      include: {
        order: {
          include: { services: true },
        },
      },
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

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const params = await Promise.resolve(context.params);
  const appointmentId = Number(params.id);

  if (!appointmentId) {
    return NextResponse.json(
      { message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.order.deleteMany({
      where: { appointmentId: appointmentId },
    });

    await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }

}
  