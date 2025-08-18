import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
console.log("IN");
export async function GET() {
    console.log("Fetching services...");
    try {
        const services = await prisma.serviceCategory.findMany({
            include: {
                services: true,
            },
        });

        const formattedServices = services.map((category) => ({
            ...category,
            services: category.services.map((service) => ({
                ...service,
                servicePrice: Number(service.servicePrice) // Format price to two decimal places
            }))
        }));

        return NextResponse.json(formattedServices);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}