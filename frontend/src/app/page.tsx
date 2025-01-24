'use client'
import { Bodoni_Moda } from "next/font/google";
import { useState } from "react";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

interface ServiceItem {
  name: string;
  price: number;
  time: number | null;
}

interface Service {
  title: string;
  items: ServiceItem[];
}

const services: Service[] = [
  {
    title: "Trepalnice 1/1",
    items: [
      { name: "Podaljševanje na novo", price: 35, time: 90 },
      { name: "Korekcija po dveh tednih", price: 15, time: 45 },
      { name: "Korekcija po treh tednih", price: 25, time: 60 },
    ],
  },
  {
    title: "Trepalnice Volumen",
    items: [
      { name: "Podaljševanje na novo", price: 45, time: 120 },
      { name: "Korekcija po dveh tednih", price: 25, time: 75 },
      { name: "Korekcija po treh tednih", price: 35, time: 90 },
      { name: "Odstranjevanje trepalnic", price: 10, time: 30 },
      { name: "Lash lift", price: 40, time: 60 },
    ],
  },
  {
    title: "Obrvi",
    items: [
      { name: "Urejanje obrvi", price: 10, time: 15 },
      { name: "Laminacija obrvi", price: 40, time: 60 },
    ],
  },
  {
    title: "Nohti",
    items: [
      { name: "Permanentno lakiranje", price: 25, time: 60 },
      { name: "Permanentno lakiranje z barvno bazo", price: 25, time: 60 },
      { name: "Odstranjevanje laka", price: 5, time: 30 },
    ],
  },
  {
    title: "Gel Nohti",
    items: [
      { name: "Podaljševanje nohtov", price: 40, time: 120 },
      { name: "Korektura geliranih nohtov", price: 30, time: 90 },
      { name: "Geliranje naravnih nohtov", price: 35, time: 90 },
      { name: "Odstranjevanje gela", price: 5, time: 30 },
      { name: "Poslikava", price: 5, time: null },
    ],
  },
];

export default function Home() {
  const [servicePicked, setServicePicked] = useState<ServiceItem | null>(null);

  const getService = (service: ServiceItem) => {
    if (service) {
      setServicePicked(service);
      
    }
  };

  return (
    <div>
      <section className="flex flex-col items-center justify-center h-screen bg-[var(--cream-white)] text-[var(--earth-brown)]">
        <div className="mb-[30%] mr-[30%]">
          <h1
            className={`${bodoniModa.variable} text-7xl font-bold m-3`}
            style={{ fontFamily: "var(--font-bodoni-moda) !important" }}
          >
            Unique Beauty Corner
          </h1>
          <p className="italic">Dobrodošli v Unique Beauty Corner</p>
        </div>
        <div className="w-3/4 flex flex-col items-center gap-4">
          <a href="#storitve" className="w-full">
            <button className="px-3 py-2 w-1/4 rounded-lg hover:bg-terracotta-dark focus:outline-none focus:ring-opacity-50">
              Naroči se
            </button>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="min-h-screen bg-[var(--cream-white)] text-[var(--earth-brown)]">
        <div className="text-center w-3/4 flex flex-col items-center p-10 mx-auto">
          <h2 id="storitve" className="text-4xl font-bold mb-8 text-[var(--terracotta)]">Storitve</h2>
          <div className="flex flex-col w-3/4 gap-7">
            {services.map((service) => (
              <div
                key={service.title}
                className="border-b-2 border-[var(--warm-gray)] p-6 bg-[var(--beige)] shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4 text-[var(--terracotta)]">
                  {service.title}
                </h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex justify-between text-lg font-medium"
                    >
                      <span>{item.name}</span>
                      <div className="grid grid-cols-3 gap-2">
                        <span>{item.price} €</span>
                        <span>{item.time ? `(${item.time} min)` : ''}</span>
                        <button onClick={() => getService(item)} className="pt-1 pb-1">Izberi</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        { servicePicked && (    
            <div>{servicePicked.name}</div>
        )}
      </section>
    </div>
  );
}
