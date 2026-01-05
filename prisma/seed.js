import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories, services, appointments, and orders...");

  // Seed Service Categories
  await prisma.serviceCategory.createMany({
    data: [
      { 
        categoryName: "Trepalnice 1/1",
        categoryDescription: "Trepalnice 1:1 (klasične) so metoda podaljševanja, kjer se ena umetna trepalnica prilepi na eno naravno – rezultat je naraven videz z malo več dolžine in gostote, brez volumna."
      },
      { 
        categoryName: "Trepalnice Volumen",
        categoryDescription: "Volumenske trepalnice so tehnika podaljševanja, pri kateri se na eno naravno trepalnico namesti več zelo tankih umetnih trepalnic za bolj gost, poln in izrazit videz. Število trepalnic na eno naravno se vedno določi v posvetu s stranko, glede na želeni izgled in stanje naravnih trepalnic."
      },
      { 
        categoryName: "Lash Lift",
        categoryDescription: "Lash lift je postopek privihanja in dviga naravnih trepalnic, ki jim da bolj odprt, poudarjen videz brez umetnih trepalnic; učinek traja približno 6–8 tednov."
      },
      { categoryName: "Obrvi"},
      { categoryName: "Manikura" },
      { categoryName: "Pedikura" }
    ]
  });

  // Seed Services
  await prisma.services.createMany({
    data: [
      // Trepalnice 1/1 (categoryId: 1)
      { 
        serviceName: "Podaljševanje na novo", 
        servicePrice: 45, 
        serviceTime: 90, 
        serviceCategoryId: 1,
        displayOrder: 1,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po dveh tednih", 
        servicePrice: 15, 
        serviceTime: 60, 
        serviceCategoryId: 1,
        displayOrder: 2,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po treh tednih", 
        servicePrice: 25, 
        serviceTime: 75, 
        serviceCategoryId: 1,
        displayOrder: 3,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po štirih tednih", 
        servicePrice: 35, 
        serviceTime: 90, 
        serviceCategoryId: 1,
        displayOrder: 4,
        serviceDescription: null
      },
      { 
        serviceName: "Odstranjevanje trepalnic", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 1,
        displayOrder: 5,
        serviceDescription: null
      },
      // Trepalnice Volumen (categoryId: 2)
      { 
        serviceName: "Podaljševanje na novo", 
        servicePrice: 55, 
        serviceTime: 135, 
        serviceCategoryId: 2,
        displayOrder: 1,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po dveh tednih", 
        servicePrice: 25, 
        serviceTime: 60, 
        serviceCategoryId: 2,
        displayOrder: 2,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po treh tednih", 
        servicePrice: 35, 
        serviceTime: 90, 
        serviceCategoryId: 2,
        displayOrder: 3,
        serviceDescription: null
      },
      { 
        serviceName: "Refil po štirih tednih", 
        servicePrice: 45, 
        serviceTime: 105, 
        serviceCategoryId: 2,
        displayOrder: 4,
        serviceDescription: null
      },
      { 
        serviceName: "Odstranjevanje trepalnic", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 2,
        displayOrder: 5,
        serviceDescription: null
      },
      // Lash Lift (categoryId: 3)
      { 
        serviceName: "Lash lift", 
        servicePrice: 25, 
        serviceTime: 75, 
        serviceCategoryId: 3,
        displayOrder: 1,
        serviceDescription: null
      },
      // Obrvi (categoryId: 4)
      { 
        serviceName: "Arhitektura obrvi", 
        servicePrice: 20, 
        serviceTime: 30, 
        serviceCategoryId: 4,
        displayOrder: 1,
        serviceDescription: "Arhitektura obrvi je postopek, pri katerem se obrvi oblikujejo in negujejo, da so simetrične, čiste in poudarjene. Vključuje lahko striženje, odstranjevanje dlačic s pinceto ali voskom ter po želji barvanje obrvi za polnejši videz. Rezultat so urejene obrvi, ki poudarijo obraz in izgledajo naravno."
      },
      { 
        serviceName: "Laminacija obrvi", 
        servicePrice: 25, 
        serviceTime: 60, 
        serviceCategoryId: 4,
        displayOrder: 3,
        serviceDescription: "Laminacija obrvi je kozmetični postopek, s katerim se dlačice obrvi zmehčajo in oblikujejo v želeno smer, da so obrvi videti bolj polne, urejene in simetrične; učinek običajno traja več tednov."
      },
      { 
        serviceName: "Powder brows", 
        servicePrice: 120, 
        serviceTime: 120, 
        serviceCategoryId: 4,
        displayOrder: 3,
        serviceDescription: "Powder brows so tehnika poltrajnega senčenja obrvi, pri kateri se pigment nežno vnaša v kožo za učinek mehko zasenčenih, pudrastih obrvi, podobnih ličilu; rezultat običajno traja od 2 do 4 leta, odvisno od tipa kože in nege."
      },
      { 
        serviceName: "Voskanje", 
        servicePrice: 10, 
        serviceTime: 20, 
        serviceCategoryId: 4,
        displayOrder: 4,
        serviceDescription: "Voskanje obrvi je hiter in učinkovit postopek za natančno oblikovanje obrvi in odstranjevanje neželenih dlačic."
      },
      // Nohti (categoryId: 5)
      { 
        serviceName: "Nega z seal & protect", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 5,
        displayOrder: 1,
        serviceDescription: "Seal & Protect je zaključna nega nohtov, namenjena zaščiti naravnega nohta in obnohtne kožice"
      },
      { 
        serviceName: "Permanentno lakiranje z barvno bazo (BIAB)", 
        servicePrice: 25, 
        serviceTime: 75, 
        serviceCategoryId: 5,
        displayOrder: 2,
        serviceDescription: "BIAB nohti so naravna manikura z ojačitvenim gelom (Builder In A Bottle), ki krepi naravne nohte, preprečuje lomljenje in daje urejen, nežen videz brez podaljškov."
      },
      { 
        serviceName: "Permanentno lakiranje (barva + baza)", 
        servicePrice: 30, 
        serviceTime: 90, 
        serviceCategoryId: 5,
        displayOrder: 3,
        serviceDescription: "BIAB + barva pomeni, da se na naravne nohte najprej nanese BIAB gel za ojačitev, nato pa še barvni gel ali trajni lak – nohti so tako močnejši, obstojnejši in hkrati v izbrani barvi."
      },
      { 
        serviceName: "Podaljševanje nohtov", 
        servicePrice: 40, 
        serviceTime: 120, 
        serviceCategoryId: 5,
        displayOrder: 4,
        serviceDescription: "Podaljševanje nohtov je postopek, kjer se naravni nohti podaljšajo z gelom (ali drugim profesionalnim materialom) ter oblikujejo v želeno dolžino in obliko."
      },
      { 
        serviceName: "Korekcija podaljšanih nohtov", 
        servicePrice: 35, 
        serviceTime: 90, 
        serviceCategoryId: 5,
        displayOrder: 5,
        serviceDescription: "Korekcija je vzdrževalni postopek, ki se običajno opravi na 3–4 tedne, odvisno od rasti nohtov."
      },
      { 
        serviceName: "Odstranjevanje permanentnega laka", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 5,
        displayOrder: 6,
        serviceDescription: null
      },
      { 
        serviceName: "Odstranjevanje gel / podaljšanih nohtov", 
        servicePrice: 15, 
        serviceTime: 30, 
        serviceCategoryId: 5,
        displayOrder: 7,
        serviceDescription: null
      },
      
      // Manikura  (categoryId: 6)
      { 
        serviceName: "Permanentno lakiranje (BIAB)", 
        servicePrice: 25, 
        serviceTime: 60, 
        serviceCategoryId: 6,
        displayOrder: 1,
        serviceDescription: "BIAB nohti so naravna manikura z ojačitvenim gelom (Builder In A Bottle), ki krepi naravne nohte, preprečuje lomljenje in daje urejen, nežen videz brez podaljškov."
      },
      { 
        serviceName: "Nega z seal & protect", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 6,
        displayOrder: 2,
        serviceDescription: "Seal & Protect je zaključna nega nohtov, namenjena zaščiti naravnega nohta in obnohtne kožice."
      },
       { 
        serviceName: "Popravilo nohta", 
        servicePrice: 5, 
        serviceTime: 10, 
        serviceCategoryId: 6,
        displayOrder: 3,
        serviceDescription: null
      },
      { 
        serviceName: "Odstranjevanje permanentnega laka", 
        servicePrice: 10, 
        serviceTime: 30, 
        serviceCategoryId: 6,
        displayOrder: 4,
        serviceDescription: null
      }
      
    ]
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });