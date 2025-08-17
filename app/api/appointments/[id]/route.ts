// app/api/appointments/delete/[id]/route.ts
import { NextResponse } from "next/server";
import {prisma} from "@lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const appointmentId = Number(params.id);

  if (!appointmentId) {
    return NextResponse.json(
      { message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    // First, delete the related order if it exists
    await prisma.order.deleteMany({
      where: {
        appointmentId: appointmentId,
      },
    });

    // Then, delete the appointment
    const deletedAppointment = await prisma.appointment.delete({
      where: {
        id: appointmentId,
      },
    });

    return NextResponse.json({
      message: "Appointment deleted",
      deletedAppointment,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// app/api/appointments/update/[id]/route.ts
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const appointmentId = Number(params.id);
  const updatedData = await req.json();

  if (!appointmentId || !updatedData) {
    return NextResponse.json(
      { message: "Appointment ID and data are required" },
      { status: 400 }
    );
  }

  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updatedData,
      include: {
        order: {
          include: {
            services: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Appointment updated",
      updatedAppointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}