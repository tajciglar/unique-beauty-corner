// PUT update appointment
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@lib/prisma"
import { Service } from '../../../../types/types';
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const params = await Promise.resolve(context.params);
  const appointmentId = Number(params.id);
  const updatedData = await req.json();

  console.log("Updating appointment with ID:", appointmentId, "Data:", updatedData);

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