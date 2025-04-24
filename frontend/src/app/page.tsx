'use client'
import { Bodoni_Moda } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useService } from "@/context/ServiceContext";
import useFetchServices from "@/hooks/useFetchServices";
import { ServiceCategory } from "@/types/types";
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});


export default function Home() {

  const { servicesPicked, setServicesPicked } = useService();
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory[]>([]);

  const fetchServices = async () => {
    const data = await useFetchServices();
    console.log(data);
    if (data) {
      setServiceCategory(data);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  
 
  const router = useRouter();
  const getService = (service: ServiceItem) => {
        if (service) {
          setServicesPicked((prevServices: ServiceItem[]) => prevServices ? [...prevServices, service] : [service]);
        }
      };

    const bookService = () => {
      if (servicesPicked.length) {
        router.push('/termin');
        }
    }

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
          <h2 className="italic text-lg ">Dobrodošli v Unique Beauty Corner</h2>
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
      <section className="min-h-screen bg-[var(--cream-white)] text-[var(--earth-brown)] grid grid-cols-[3fr_1fr]">
        <div className="text-center w-full flex flex-col items-center p-10 mx-auto">
          <h2 id="storitve" className="text-4xl font-bold mb-8 text-[var(--terracotta)]">Storitve</h2>
          <div className="flex flex-col w-3/4 gap-7">
            {serviceCategory.map((category) => (
              <div
                key={category.id}
                className="border-b-2 border-[var(--warm-gray)] p-6 bg-[var(--beige)] shadow-lg"
              >
                <h3 className="text-xl font-bold mb-4 text-[var(--terracotta)]">
                  {category.categoryName}
                </h3>
                <ul className="space-y-2">
                  {category.services.map((service) => (
                    <li
                      key={service.name}
                      className="flex justify-between text-lg font-medium"
                    >
                      <span>{service.name}</span>
                      <div className="grid grid-cols-3 gap-2">
                        <span>{service.price} €</span>
                        <span>{service.time ? `(${service.time} min)` : ''}</span>
                        <button onClick={() => getService(service)} className="pt-1 pb-1">Izberi</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
           { servicesPicked.length > 0 && (    
            <div className="flex justify-center items-center p-10 mx-auto w-full">
                <div className="flex flex-col gap-4 justify-center items-center border-2  p-6 bg-[var(--beige)] shadow-lg w-full sticky top-10 bottom-10">
                    <div className="w-full flex flex-col gap-4 justify-center items-center">
                        <h2>Storitve:</h2>
                            {servicesPicked.map((service, index) => (
                            <div key={index} className=" w-full">
                                <p>{service.name}</p>
                                <p>Cena: {service.price} €</p>
                                <p>Trajanje: {service.time ? `${service.time} min` : 'N/A'}</p>
                                <button className="text-sm px-2 py-1" onClick={() => setServicesPicked((prevServices: ServiceItem[]) => prevServices.filter((s) => s.name !== service.name))}>Odstrani</button>
                            </div>
                            ))}
                    </div>
                    <div className="mt-4 w-full">
                        <h3>Skupaj:</h3>
                        <p>Skupni čas: {servicesPicked.reduce((total, service) => total + (service.time || 0), 0)} min</p>
                        <p>Skupna cena: {servicesPicked.reduce((total, service) => total + service.price, 0)} €</p>
                    </div>
                    <button onClick={bookService}>Izberi termin</button>
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
