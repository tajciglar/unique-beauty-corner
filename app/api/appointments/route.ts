
import { NextResponse } from "next/server";
import prisma from "@lib/prisma"; 
import { getSessionFromRequest } from "@lib/auth";


// Fetch all appointments, both available and booked
export async function GET(req: Request) {
    try {
          const session = getSessionFromRequest(req);
          if (!session || session.role !== "admin") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
          }

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
          return NextResponse.json({availableAppointments, bookedAppointments});
      } catch (error) {
          console.error("Error fetching termini:", error);
          return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
