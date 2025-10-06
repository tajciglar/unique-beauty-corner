 import { PrismaClient } from '@prisma/client';

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

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
