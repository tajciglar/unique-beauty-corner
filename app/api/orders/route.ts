
import { sendEmail } from "@utility/sendEmail";
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

// GET /api/orders
export async function GET() {
  try {
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
    const { name, phone, email, date, startTime, duration, services, appointmentId } = await req.json();

    const existingOrder = await prisma.order.findFirst({
      where: {
        appointment: {
          date,
          startTime,
          available: false,
        },
        appointmentId,
      },
    });

    if (existingOrder) {
      return NextResponse.json({ message: "Termin zaseden" }, { status: 400 });
    }

    const newOrder = await prisma.order.create({
      data: {
        name,
        email,
        phone,
        duration,
        price: Number(services.reduce((sum: number, s: { price: number }) => sum + Number(s.price), 0)),
        appointment: { connect: { id: appointmentId } },
        services: { connect: services.map((s: { id: number }) => ({ id: s.id })) },
      },
      include: { appointment: true, services: true },
    });

    if (!newOrder) {
      return NextResponse.json({ message: 'New order can not be made' }, { status: 404 });
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { available: false }, 
    });
    console.log("order created:", newOrder);
    // Send confirmation email
    sendEmail({
      ...newOrder,
      price: typeof newOrder.price === "object" && "toNumber" in newOrder.price ? newOrder.price : Number(newOrder.price),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      services: newOrder.services.map((service: any) => ({
        ...service,
        serviceTime: service.serviceTime === null ? undefined : service.serviceTime
      }))
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}