import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import { ServiceCategory } from "../../../types/types";
console.log("IN");
export async function GET() {
    console.log("Fetching services...");
    try {
        const services = await prisma.serviceCategory.findMany({
            include: {
                services: true,
            },
        });

        const formattedServices = services.map((category: ServiceCategory & { services: { servicePrice: number }[] }) => ({
            ...category,
            services: category.services.map((service: { servicePrice: number }) => ({
                ...service,
            servicePrice: service.servicePrice.toFixed(2) // Format price to two decimal places
        }))
        }));

        return NextResponse.json(formattedServices);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}