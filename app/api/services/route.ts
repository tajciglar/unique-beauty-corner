import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET() {
 
  try {
    const services = await prisma.serviceCategory.findMany({
      include: {
        services: {
          include: {
            serviceCategory: true,
          },
          orderBy: {
          displayOrder: 'asc',
        },
        },
      },
    });

    const formattedServices = services.map((category: typeof services[0]) => ({
      ...category,
      services: category.services.map((service: typeof category.services[0]) => ({
        ...service,
        servicePrice: Number(service.servicePrice),
      })),
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
