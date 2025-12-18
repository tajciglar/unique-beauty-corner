import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import type { ServiceCategory, Services } from "@prisma/client";

export async function GET() {
 
  try {
    const services = await prisma.serviceCategory.findMany({
      include: {
        services: {
          include: {
            serviceCategory: true,
          },
          orderBy: {
          servicePrice: 'asc',
        },
        },
      },
    });

    const formattedServices = services.map((category: ServiceCategory & { services: Services[] }) => ({
      ...category,
      services: category.services.map((service: Services) => ({
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
