// app/api/appointments/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

// DELETE appointment
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  // Explicitly await params
  const params = await Promise.resolve(context.params);
  const appointmentId = Number(params.id);

  if (!appointmentId) {
    return NextResponse.json(
      { message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    // Delete related orders first
    await prisma.order.deleteMany({ where: { appointmentId } });

    // Delete appointment
    const deletedAppointment = await prisma.appointment.delete({
      where: { id: appointmentId },
    });

    return NextResponse.json({
      message: "Appointment deleted successfully",
      deletedAppointment,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update appointment
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  const params = await Promise.resolve(context.params);
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
        order: { include: { services: true } },
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