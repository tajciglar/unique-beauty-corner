 import { PrismaClient } from '@prisma/client';
import { addDays, format, setHours, setMinutes, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories, services, appointments, and orders...");

  // Seed Service Categories
  await prisma.serviceCategory.createMany({
    data: [
      { categoryName: "Trepalnice 1/1" },
      { categoryName: "Trepalnice Volumen" },
      { categoryName: "Obrvi" },
      { categoryName: "Nohti" },
      { categoryName: "Gel Nohti" }
    ]
  });

  // Seed Services
  await prisma.services.createMany({
    data: [
      { serviceName: "Podaljševanje na novo", servicePrice: 35, serviceTime: 90, serviceCategoryId: 1 },
      { serviceName: "Korekcija po dveh tednih", servicePrice: 15, serviceTime: 45, serviceCategoryId: 1 },
      { serviceName: "Korekcija po treh tednih", servicePrice: 25, serviceTime: 60, serviceCategoryId: 1 },
      { serviceName: "Podaljševanje na novo", servicePrice: 45, serviceTime: 120, serviceCategoryId: 2 },
      { serviceName: "Korekcija po dveh tednih", servicePrice: 25, serviceTime: 75, serviceCategoryId: 2 },
      { serviceName: "Korekcija po treh tednih", servicePrice: 35, serviceTime: 90, serviceCategoryId: 2 },
      { serviceName: "Odstranjevanje trepalnic", servicePrice: 10, serviceTime: 30, serviceCategoryId: 2 },
      { serviceName: "Lash lift", servicePrice: 40, serviceTime: 60, serviceCategoryId: 2 },
      { serviceName: "Urejanje obrvi", servicePrice: 10, serviceTime: 15, serviceCategoryId: 3 },
      { serviceName: "Laminacija obrvi", servicePrice: 40, serviceTime: 60, serviceCategoryId: 3 },
      { serviceName: "Permanentno lakiranje", servicePrice: 25, serviceTime: 60, serviceCategoryId: 4 },
      { serviceName: "Permanentno lakiranje z barvno bazo", servicePrice: 25, serviceTime: 60, serviceCategoryId: 4 },
      { serviceName: "Odstranjevanje laka", servicePrice: 5, serviceTime: 30, serviceCategoryId: 4 },
      { serviceName: "Podaljševanje nohtov", servicePrice: 40, serviceTime: 120, serviceCategoryId: 5 },
      { serviceName: "Korektura geliranih nohtov", servicePrice: 30, serviceTime: 90, serviceCategoryId: 5 },
      { serviceName: "Geliranje naravnih nohtov", servicePrice: 35, serviceTime: 90, serviceCategoryId: 5 },
      { serviceName: "Odstranjevanje gela", servicePrice: 5, serviceTime: 30, serviceCategoryId: 5 },
      { serviceName: "Poslikava", servicePrice: 5, serviceTime: null, serviceCategoryId: 5 }
    ]
  });

  // Fetch all services
  const allServices = await prisma.services.findMany();

  // Create appointments with random availability
  for (let i = 0; i < 20; i++) {
    const randomDate = addDays(new Date(), Math.floor(Math.random() * 10));
    const startHour = Math.floor(Math.random() * (18 - 9) + 9);
    const startTime = setMinutes(setHours(randomDate, startHour), 0);
    
    let duration = 60; // Default duration for available appointments
    let endTime = addMinutes(startTime, duration);
    const available = Math.random() > 0.3; // 70% available, 30% booked
    
    // If the appointment is booked, assign a real duration based on services
    let selectedServices = [];
    if (!available) {
      const numServices = Math.floor(Math.random() * 2) + 1; // 1 or 2 services
      selectedServices = allServices.sort(() => 0.5 - Math.random()).slice(0, numServices);

      duration = selectedServices.reduce((sum, service) => sum + (service.serviceTime || 0), 0);
      endTime = addMinutes(startTime, duration);
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: randomDate.toISOString().split("T")[0],
        startTime: format(startTime, "HH:mm"),
        endTime: format(endTime, "HH:mm"),
        available,
      }
    });

    // If booked, create an order with customer details and services
    if (!available) {
      const totalPrice = selectedServices.reduce((sum, service) => sum + parseFloat(service.servicePrice.toString()), 0);

      await prisma.order.create({
        data: {
          name: `Customer ${appointment.id}`,
          email: `customer${appointment.id}@example.com`,
          phone: `+123456789${appointment.id}`,
          price: totalPrice,
          duration, // Store the total service duration in minutes
          appointmentId: appointment.id,
          services: {
            connect: selectedServices.map(service => ({ id: service.id }))
          }
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
