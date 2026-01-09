'use client'
import { Bodoni_Moda } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useService } from "../context/ServiceContext";
import getServices from "../hooks/useFetchServices";
import { ServiceCategory, Service } from "../types/types";
const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});


export default function Home() {

  const { servicesPicked, setServicesPicked } = useService();
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory[]>([]);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  
  const fetchServices = async () => { 
    const data = await getServices();
    if (data) {
      setServiceCategory(data);
    }
  }
  useEffect(() => {
    fetchServices();
  }, []);

  const toggleServiceDetails = (serviceId: number) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

 
  const router = useRouter();
  const getService = (service: Service) => {
        const isServiceAlreadyPicked = servicesPicked.some((s) => s.serviceName === service.serviceName && s.serviceCategoryId === service.serviceCategoryId);
        if (isServiceAlreadyPicked) {
          alert("Storitve že izbrana"); 
          return
        } else {
          setServicesPicked((prevServices: Service[]) => prevServices ? [...prevServices, service] : [service]);
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
        <div className="mb-[30%] lg:mr-[30%]">
          <h1
            className={`${bodoniModa.variable} text-7xl font-bold m-3`}
          >
            Unique Beauty Corner
          </h1>
          <h2 className="italic text-lg ">Dobrodošli v Unique Beauty Corner</h2>
        </div>
        <div className="w-3/4 flex flex-col items-center gap-4">
          <a href="#storitve" className="w-full">
            <button className="button px-3 py-2 w-full lg:w-1/4 rounded-lg hover:bg-terracotta-dark focus:outline-none focus:ring-opacity-50">
              Naroči se
            </button>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="min-h-screen flex flex-col lg:flex-row justify-center bg-[var(--cream-white)] text-[var(--earth-brown)] lg:grid grid-cols-[3fr_1fr]">
        <div className="text-center w-full flex flex-col items-center p-2 lg:p-10 mx-auto ">
          <h2 id="storitve" className="text-4xl font-bold mb-8 text-[var(--terracotta)] ">Storitve</h2>
          <div className="flex flex-col w-full lg:w-3/4 gap-7 ">
            {serviceCategory.length > 0 ? (
              serviceCategory.map((category) => (
              <div
                key={category.id}
                className="border-b-1 p-2 lg:p-6 bg-[var(--warm-gray)] shadow-lg rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-2 text-[var(--terracotta)]">
                {category.categoryName}
                </h3>
                {category.categoryDescription && (
                  <p className="text-sm text-gray-700 mb-4 italic">
                    {category.categoryDescription}
                  </p>
                )}
                <ul className="space-y-2">
                {category.services.map((service) => {
                  const hasDescription = service.serviceDescription && service.serviceDescription.trim() !== '';
                  return (
                  <li
                  key={service.serviceName}
                  className="border-b border-gray-200 last:border-b-0"
                  >
                    <div 
                      className={`flex flex-col items-center lg:flex-row lg:justify-between text-lg font-normal lg:font-medium p-2 rounded transition-colors ${
                        hasDescription ? 'cursor-pointer hover:bg-gray-50' : ''
                      }`}
                      onClick={hasDescription ? () => toggleServiceDetails(service.id) : undefined}
                    >
                      <span className="w-full lg:w-1/3">{service.serviceName}</span>
                      <div className="grid grid-cols-3 lg:w-1/2 pb-3 lg:pb-0">
                        <span>{service.serviceTime ? `(${service.serviceTime} min)` : ''}</span>
                        ·
                        <span>{service.servicePrice} €</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            getService(service);
                          }} 
                          className="button pt-1 pb-1 px-3"
                        >
                          Izberi
                        </button>
                        {hasDescription && (
                          <span className="text-sm text-gray-500">
                            {expandedService === service.id ? '▼' : '▶'}
                          </span>
                        )}
                      </div>
                    </div>
                    {expandedService === service.id && hasDescription && (
                      <div className="mt-2 p-4 bg-[var(--cream-white)] rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                        <p className="text-base">{service.serviceDescription}</p>
                      </div>
                    )}
                  </li>
                  );
                })}
                </ul>
              </div>
              ))
            ) : (
              <p className="text-center text-lg font-medium text-[var(--terracotta)]">
              Naročanje preko spleta trenutno ni možno. Obrnite se na +386 70 654 560
              </p>
            )}
          </div>
        </div>
           { servicesPicked.length > 0 && (    
            <div className=" justify-center items-center p-10 mx-auto w-full">
                <div className="flex flex-col gap-4 justify-center items-center border-1  p-6 bg-[var(--warm-gray)] shadow-lg rounded-2xl w-full lg:sticky lg:top-[10px] lg:bottom-[10px]">
                    <div className="w-full flex flex-col gap-4 justify-center items-center">
                        <h3 className="text-2xl">Storitve:</h3>
                            {servicesPicked.map((service, index) => (
                            <div key={index} className="w-full font-light">
                                <p className="font-bold">{service.serviceCategory?.categoryName}</p>
                                <p>{service.serviceName}</p>
                                <p>Cena: {service.servicePrice} €</p>
                                <p>Trajanje: {service.serviceTime ? `${service.serviceTime} min` : 'N/A'}</p>
                                <button className="button text-sm px-2 py-1" onClick={() => setServicesPicked((prevServices: Service[]) => prevServices.filter((s) => !(s.serviceName === service.serviceName && s.serviceCategoryId === service.serviceCategoryId)))}>Odstrani</button>
                            </div>
                            ))}
                    </div>
                    <div className="mt-4 w-full">
                        <h3>Skupaj:</h3>
                        <p>Skupni čas: {servicesPicked.reduce((total, service) => total + (service.serviceTime || 0), 0)} min</p>
                        <p>Skupna cena: {servicesPicked.reduce((total, service) => total + (service.servicePrice ?? 0), 0)} €</p>
                    </div>
                    <button className="button" onClick={bookService}>Izberi termin</button>
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
