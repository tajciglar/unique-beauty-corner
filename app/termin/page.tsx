'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useService } from "../../context/ServiceContext";
import ClientCalander from "../../components/ClientCalendar";
import { Appointment } from "../../types/types";


export default function Termini() {
  const router = useRouter();
  const { servicesPicked } = useService();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const totalTime = servicesPicked.reduce((acc, curr) => acc + (curr.serviceTime || 0), 0);
  const price = servicesPicked.reduce((acc, curr) => acc + (curr.servicePrice || 0), 0);
  

  const handleSelectTimeSlot = (date: Date, time: string, selectedAppointment: Appointment) => {
    setSelectedAppointment(selectedAppointment);
    setSelectedDate(date);
    setSelectedTimeSlot(time);
  };

  const appointmentForm = () => { 
    setAppointment(true);
  }

  const bookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      date: selectedDate,
      startTime: selectedTimeSlot,
      duration: totalTime,  
      price: servicesPicked.reduce((acc, curr) => acc + (curr.servicePrice || 0), 0),
      appointmentId: selectedAppointment?.id,
      services: servicesPicked.map((service) => ({
        id: service.id,
        name: service.serviceName,
        price: service.servicePrice,
        time: service.serviceTime,
      })),
    };

    try {
      const response = await fetch("/api/orders", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("lastBooking", JSON.stringify(result));
        router.push("/termin/confirmation");
      } else {
        console.error("Error booking appointment:", response.statusText);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };


  return (
    <>
      <div className="min-h-screen flex flex-col gap-6 m-0 p-2 bg-[var(--cream-white)] items-center lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:p-6">
      <ClientCalander onSelectTimeSlot={handleSelectTimeSlot} />
      <div className="w-3/4 lg:w-full max-w-md bg-[var(--warm-gray)] p-6 rounded-2xl shadow-lg text-base flex flex-col items-center text-center space-y-4 lg:p-8 mb-4">
        <h3 className="text-3xl font-bold text-[var(--terracotta)]">Izbrali ste:</h3>
        <div className="text-base text-[var(--dark-brown)]">
          <ul>
            {servicesPicked.map((service, index) => (
              <li key={index}>
                {service.serviceName} - {service.servicePrice}€
              </li>
            ))}
          </ul>
          <p>Čas storitve: {totalTime} min</p>
        </div> 
        {selectedTimeSlot && (
            <>
              <p className="m-0  text-lg text-[var(--terracotta)]">
                  Izbrani termin: <span className="font-extrabold text-[var(--dark-brown)]">{selectedDate?.toLocaleDateString("sl").split(" ")} {selectedTimeSlot}</span>
              </p>
              <div className="flex justify-center">
                  <button className="mt-4 py-2 px-6 rounded-full hover:bg-[#ffd6b9] transition transform hover:scale-105" onClick={() => appointmentForm()}>Potrdi</button>
              </div>
            </>
        )}
      </div>
      
    </div>
    {appointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] px-4">
          <div className="bg-[#fae9e1] bg-opacity-100 p-4 rounded-lg w-full max-w-md text-base flex flex-col gap-4 overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl">Obrazec za naročilo</h2>
          <form onSubmit={bookAppointment} className="flex flex-col gap-3">
            <label htmlFor="name">Ime in priimek:</label>
            <input type="text" id="name" name="name" required/>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required/>
            <label htmlFor="phone">Telefonska številka:</label>
            <input type="text" id="phone" name="phone" required/>
            <h3 className="text-lg">Informacije o storitvi:</h3>
              <ul>
                {servicesPicked.map((service, key) => (
                <li key={key}>{service.serviceName}</li>
                ))}
              </ul>
            <p> {selectedDate ? selectedDate.toLocaleDateString("sl").split(" ") : "Datum ni izbran"} ob {selectedTimeSlot} ({totalTime} min )</p>
            <p>{price} €</p>
            <button type="submit">Naroči se</button>
            <button onClick={() => setAppointment(false)}>Prekliči</button>
          </form>
        </div>
      </div>
    )}
    </>
  );
}