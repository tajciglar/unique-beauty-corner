
import { NextResponse } from "next/server";
import prisma from "@lib/prisma"; 


// Fetch all appointments, both available and booked
export async function GET() {
    try {
          const availableAppointments = await prisma.appointment.findMany({
              where: {
                  available: true,
              }
          });
  
          const bookedAppointments = await prisma.appointment.findMany({
              where: {
                  available: false,
              },
              include: {
                  order: {
                      include: {
                          services: {
                            include: { 
                                serviceCategory: true 
                            }
                          },
                      }
                  }
              },
          });
          console.log("Fetched appointments:", {availableAppointments, bookedAppointments});
          return NextResponse.json({availableAppointments, bookedAppointments});
      } catch (error) {
          console.error("Error fetching termini:", error);
          return NextResponse.json({ message: 'Server error' });
    }
}