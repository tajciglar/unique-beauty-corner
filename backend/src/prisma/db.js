import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();
async function main() {
  // Create categories and their services
  const categories = await prisma.kategorijaStoritev.createMany({
    data: [
      {
        naslovKategorije: "Trepalnice 1/1",
      },
      {
        naslovKategorije: "Trepalnice Volumen",
      },
      {
        naslovKategorije: "Obrvi",
      },
      {
        naslovKategorije: "Nohti",
      },
      {
        naslovKategorije: "Gel Nohti",
      }
    ]
  });

  // Create services and link them to categories
  await prisma.storitve.createMany({
    data: [
      { imeStoritve: "Podaljševanje na novo", cena: 35, časStoritve: 90, kategorijaStoritevId: 1 },
      { imeStoritve: "Korekcija po dveh tednih", cena: 15, časStoritve: 45, kategorijaStoritevId: 1 },
      { imeStoritve: "Korekcija po treh tednih", cena: 25, časStoritve: 60, kategorijaStoritevId: 1 },

      { imeStoritve: "Podaljševanje na novo", cena: 45, časStoritve: 120, kategorijaStoritevId: 2 },
      { imeStoritve: "Korekcija po dveh tednih", cena: 25, časStoritve: 75, kategorijaStoritevId: 2 },
      { imeStoritve: "Korekcija po treh tednih", cena: 35, časStoritve: 90, kategorijaStoritevId: 2 },
      { imeStoritve: "Odstranjevanje trepalnic", cena: 10, časStoritve: 30, kategorijaStoritevId: 2 },
      { imeStoritve: "Lash lift", cena: 40, časStoritve: 60, kategorijaStoritevId: 2 },

      { imeStoritve: "Urejanje obrvi", cena: 10, časStoritve: 15, kategorijaStoritevId: 3 },
      { imeStoritve: "Laminacija obrvi", cena: 40, časStoritve: 60, kategorijaStoritevId: 3 },

      { imeStoritve: "Permanentno lakiranje", cena: 25, časStoritve: 60, kategorijaStoritevId: 4 },
      { imeStoritve: "Permanentno lakiranje z barvno bazo", cena: 25, časStoritve: 60, kategorijaStoritevId: 4 },
      { imeStoritve: "Odstranjevanje laka", cena: 5, časStoritve: 30, kategorijaStoritevId: 4 },

      { imeStoritve: "Podaljševanje nohtov", cena: 40, časStoritve: 120, kategorijaStoritevId: 5 },
      { imeStoritve: "Korektura geliranih nohtov", cena: 30, časStoritve: 90, kategorijaStoritevId: 5 },
      { imeStoritve: "Geliranje naravnih nohtov", cena: 35, časStoritve: 90, kategorijaStoritevId: 5 },
      { imeStoritve: "Odstranjevanje gela", cena: 5, časStoritve: 30, kategorijaStoritevId: 5 },
      { imeStoritve: "Poslikava", cena: 5, časStoritve: null, kategorijaStoritevId: 5 }
    ]
  });

  console.log("Categories and Services added!");

}

main().catch(e => {
  throw e
}).finally(async () => {
  await prisma.$disconnect()
});
