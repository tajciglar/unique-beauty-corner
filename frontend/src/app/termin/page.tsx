'use client';

import { useState } from "react";
import { useService } from "@/context/ServiceContext";
import KoledarZaStranke from "../../components/ClientCalendar";
import { Appointment } from "@/types/types";

export default function Termini() {
  const { servicesPicked } = useService();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const totalTime = servicesPicked.reduce((acc, curr) => acc + (curr.time || 0), 0);
  const price = servicesPicked.reduce((acc, curr) => acc + (curr.price || 0), 0);
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
      price: servicesPicked.reduce((acc, curr) => acc + (curr.price || 0), 0),
      appointmentId: selectedAppointment?.id,
      services: servicesPicked.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        time: service.time,
      })),
    };

    console.log("Data to be sent:", data);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Appointment booked successfully:", result);
        // Handle success (e.g., show a confirmation message)
      } else {
        console.error("Error booking appointment:", response.statusText);
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      // Handle error (e.g., show an error message)
    }
  };


  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-[var(--cream-white)] gap-10">
      <KoledarZaStranke onSelectTimeSlot={handleSelectTimeSlot} />
      <div className="mb-4 bg-[var(--soft-rose)] p-4 rounded-lg text-base">
        <h3 className="text-3xl font-bold">Izbrali ste:</h3>
        <ul>
          {servicesPicked.map((service, index) => (
            <li key={index}>
              {service.name} - {service.price}€
            </li>
          ))}
        </ul>
        <p>Čas storitve: {totalTime} min</p>
        {selectedTimeSlot && (
            <>
                <p className="mt-4 text-lg">
                Izbrani termin: <strong>{selectedTimeSlot}</strong>
            </p>
            <div className="flex justify-center">
                <button className="mt-4" onClick={() => appointmentForm()}>Potrdi</button>
            </div>
            </>
        )}
      </div>
      
    </div>
    {appointment && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4">
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
                <li key={key}>{service.name}</li>
                ))}
              </ul>
            <p>{selectedTimeSlot} ({totalTime} min )</p>
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