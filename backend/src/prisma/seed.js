import { PrismaClient } from '@prisma/client';
import { addDays, format, setHours, setMinutes, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories, services, appointments, and orders...");

  // Seed categories
  await prisma.serviceCategory.createMany({
    data: [
      { categoryName: "Trepalnice 1/1" },
      { categoryName: "Trepalnice Volumen" },
      { categoryName: "Obrvi" },
      { categoryName: "Nohti" },
      { categoryName: "Gel Nohti" }
    ]
  });

  // Seed services
  const services = await prisma.services.createMany({
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

  // Seed appointments (next 10 days, random times)
  const appointments = [];
  for (let i = 0; i < 20; i++) {
    const randomDate = addDays(new Date(), Math.floor(Math.random() * 10)); // Within the next 10 days
    const startHour = Math.floor(Math.random() * (18 - 9) + 9); // Between 9 AM and 6 PM
    const startTime = setMinutes(setHours(randomDate, startHour), 0); // Set start time (HH:mm)
    const endTime = addMinutes(startTime, 60); // Add 1 hour to start time for end time

    appointments.push({
      date: format(randomDate, "yyyy-MM-dd"),
      startTime: format(startTime, "HH:mm"), // Format start time to HH:mm (time only)
      endTime: format(endTime, "HH:mm"), // Format end time to HH:mm (time only)
      available: Math.random() > 0.3, // 70% available, 30% booked
      location: Math.random() > 0.5 ? "DOMŽALE" : "LJUBLJANA",
    });
  }

  // Insert appointments with start and end times
  await prisma.appointment.createMany({
    data: appointments,
  });

  // Get all service IDs for linking to orders
  const allServices = await prisma.services.findMany();

  // Seed orders (with random data)
  const orders = [];
  for (let i = 0; i < 20; i++) {
    const randomAppointmentId = Math.floor(Math.random() * 20) + 1; // Random appointment ID
    const selectedServices = allServices.slice(0, 3); // Pick the first 3 services for demo

    orders.push({
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+123456789${i}`,
      price: 100 + Math.floor(Math.random() * 50),
      appointmentId: randomAppointmentId,
      services: {
        connect: selectedServices.map(service => ({ id: service.id })) // Corrected to use service `id`
      }
    });
  }

  // Insert orders with services
  for (const order of orders) {
    await prisma.orders.create({
      data: order,
    });
  }

  console.log("Categories, Services, Appointments, and Orders seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });