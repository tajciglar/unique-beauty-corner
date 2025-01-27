import { Bodoni_Moda } from "next/font/google"; 

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const services = [
    {
      title: "Trepalnice 1/1",
      items: [
        { name: "Podaljševanje na novo", price: "35 €" },
        { name: "Korekcija po dveh tednih", price: "15 €" },
        { name: "Korekcija po treh tednih", price: "25 €" },
      ],
    },
    {
      title: "Trepalnice Volumen",
      items: [
        { name: "Podaljševanje na novo", price: "45 €" },
        { name: "Korekcija po dveh tednih", price: "25 €" },
        { name: "Korekcija po treh tednih", price: "35 €" },
        { name: "Odstranjevanje trepalnic", price: "10 €" },
        { name: "Lash lift", price: "40 €" },
      ],
    },
    {
      title: "Obrvi",
      items: [
        { name: "Urejanje obrvi", price: "10 €" },
        { name: "Laminacija obrvi", price: "40 €" },
      ],
    },
    {
      title: "Nohti",
      items: [
        { name: "Permanentno lakiranje", price: "25 €" },
        { name: "Permanentno lakiranje z barvno bazo", price: "25 €" },
        { name: "Odstranjevanje laka", price: "5 €" },
      ],
    },
    {
      title: "Gel Nohti",
      items: [
        { name: "Podaljševanje nohtov", price: "40 €" },
        { name: "Korektura geliranih nohtov", price: "30 €" },
        { name: "Geliranje naravnih nohtov", price: "35 €" },
        { name: "Odstranjevanje gela", price: "5 €" },
        { name: "Poslikava", price: "5 €" },
      ],
    },
  ];


export default function Home() {
  return (
    <div className="grid grid-rows-2 min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="mb-[30%] mr-[30%]">
          <h1 className={`${bodoniModa.variable} text-7xl font-bol m-3`} style={{ fontFamily: 'var(--font-bodoni-moda) !important' }}>Unique Beauty Corner</h1>
          <p className="italic">Dobrodošli v Unique Beauty Corner</p>
        </div>
        <div className="w-3/4 flex flex-col items-center gap-4">
          <button type="button" className="px-3 py-2 rounded-lg w-1/4">Naroči se</button>
        </div>
      </div>
      <div className="min-h-screen flex justify-center items-center w-full">
          <div className="min-h-screen text-[var(--earth-brown)] w-3/4">
            <h1 className="text-center text-4xl font-bold my-8">Storitve</h1>
            <div className="w-full">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="border-b-1px border-[var(--warm-gray)] rounded-lg p-6 shadow-md bg-[var(--beige)]"
                >
                  <h2 className="text-xl font-bold mb-4 text-[var(--terracotta)]">
                    {service.title}
                  </h2>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex justify-between text-lg font-medium"
                      >
                        <span>{item.name}</span>
                        <span>{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}